import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { PageTypeDispatcher } from "./quartz/plugins/pageTypes"
import ConditionalRender from "./quartz/components/ConditionalRender"
import { QuartzComponent, QuartzComponentProps } from "./quartz/components/types"
import { FullPageLayout } from "./quartz/cfg"
import { Graph } from "@quartz-community/graph/components"

const config = await loadQuartzConfig()
const baseLayout = await loadQuartzLayout()

// quartz.config.yaml의 condition에는 "홈페이지에서만 보이기" 프리셋이 없다.
// (내장 조건은 not-index / has-tags / has-backlinks / has-toc 뿐)
// 그래서 index 전용 조건을 여기서 직접 정의한다.
const isIndex = (props: QuartzComponentProps) => props.fileData.slug === "index"

// 홈페이지 메인 영역에 들어가는 큰 그래프.
// 사이드바 그래프(quartz.config.yaml)와 달리 전체 노트를 다 보여준다.
const HomeGraph = ConditionalRender({
  component: Graph({
    localGraph: {
      depth: -1,
      // scale은 확대율이 아니라 라벨 크기의 역수다 (label.scale = 1/scale).
      // 값을 낮춰야 노드 이름이 커진다.
      scale: 1.0,
      // 라벨이 겹치지 않도록 노드 간격을 넉넉히 잡는다
      repelForce: 0.7,
      centerForce: 0.32,
      linkDistance: 65,
      fontSize: 0.62,
      // 라벨 alpha = max((zoom * opacityScale - 1) / 3.75, 0)
      // 기본값 1이면 확대 전까지 라벨이 완전히 안 보인다.
      opacityScale: 5,
      showTags: false,
      focusOnHover: true,
      enableRadial: true,
    },
    globalGraph: {
      showTags: false,
    },
  }),
  condition: isIndex,
})

// Quartz 그래프는 노드 라벨을 alpha 0으로 만들어 두고, d3 zoom 이벤트가
// 발생할 때만 alpha = max((zoom * opacityScale - 1) / 3.75, 0)으로 갱신한다.
// 즉 사용자가 확대/드래그하기 전까지는 이름이 절대 안 보인다.
// 그래서 그래프가 그려진 직후 wheel 이벤트를 한 번 흘려보내 라벨을 띄운다.
//
// 이건 플러그인 내부 동작에 기대는 우회책이라, Quartz를 올릴 때 동작이 바뀌면
// 이 스크립트만 무력화되고 그래프 자체는 그대로 동작하도록 방어적으로 작성했다.
//
// 주의: 이 스크립트를 Graph의 afterDOMLoaded에 이어붙이면 문자열이 달라져
// 사이드바 그래프와 중복 제거(Set)가 안 되고 그래프 초기화가 두 번 돈다.
// 그래서 아무것도 렌더링하지 않는 별도 컴포넌트로 분리한다.
const graphZoomNudgeScript = `
;(function () {
  function nudgeOnce() {
    var container = document.querySelector(".page-header .graph-container")
    if (!container) return true // 홈페이지가 아니면 할 일 없음
    var canvas = container.querySelector("canvas")
    if (!canvas) return false // 아직 그리는 중
    var rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return false
    try {
      canvas.dispatchEvent(
        new WheelEvent("wheel", {
          deltaY: -200,
          bubbles: true,
          cancelable: true,
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
        }),
      )
    } catch (e) {}
    return true
  }
  function run() {
    var tries = 0
    var timer = setInterval(function () {
      if (nudgeOnce() || ++tries > 60) clearInterval(timer)
    }, 100)
  }
  run()
  document.addEventListener("nav", run)
})()
`

const GraphZoomNudge: QuartzComponent = () => null
GraphZoomNudge.afterDOMLoaded = graphZoomNudgeScript

// beforeBody 끝에 붙이면 제목/메타 아래, 본문 위에 그래프가 들어간다.
// isIndex 조건 때문에 홈이 아니면 null을 렌더링하므로 다른 페이지엔 영향이 없다.
const withHomeGraph = (l: Partial<FullPageLayout>): Partial<FullPageLayout> => ({
  ...l,
  beforeBody: [...(l.beforeBody ?? []), HomeGraph, GraphZoomNudge],
})

const patchedLayout = {
  defaults: withHomeGraph(baseLayout.defaults),
  byPageType: Object.fromEntries(
    Object.entries(baseLayout.byPageType).map(([pageType, pageLayout]) => [
      pageType,
      pageType === "content" ? withHomeGraph(pageLayout) : pageLayout,
    ]),
  ),
}

// loadQuartzConfig()가 이미 기본 레이아웃으로 PageTypeDispatcher를 만들어 emitters에
// 넣어둔다. 문서에 나온 loadQuartzLayout(overrides) 방식은 YAML 설정을 쓸 때는
// 반영되지 않으므로(export된 layout은 레거시 경로에서만 읽힘), 여기서 dispatcher를
// 수정된 레이아웃으로 교체한다. build.ts는 이 파일의 default export를 그대로 쓴다.
const dispatcherIndex = config.plugins.emitters.findIndex((e) => e.name === "PageTypeDispatcher")
if (dispatcherIndex === -1) {
  throw new Error("PageTypeDispatcher를 emitters에서 찾지 못했다 — Quartz 내부 구조가 바뀌었는지 확인 필요")
}
config.plugins.emitters[dispatcherIndex] = PageTypeDispatcher(patchedLayout)

export default config
export const layout = patchedLayout
