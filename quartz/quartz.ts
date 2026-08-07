import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { PageTypeDispatcher } from "./quartz/plugins/pageTypes"
import ConditionalRender from "./quartz/components/ConditionalRender"
import { QuartzComponentProps } from "./quartz/components/types"
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
      depth: -1, // 홈에서는 일부가 아니라 전체 그래프를 보여준다
      scale: 1.9, // 넓은 캔버스에서 노드가 너무 작아 보이지 않도록 확대
      repelForce: 0.6,
      centerForce: 0.3,
      linkDistance: 45,
      fontSize: 0.7,
      opacityScale: 1,
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

// beforeBody 끝에 붙이면 제목/메타 아래, 본문 위에 그래프가 들어간다.
// isIndex 조건 때문에 홈이 아니면 null을 렌더링하므로 다른 페이지엔 영향이 없다.
const withHomeGraph = (l: Partial<FullPageLayout>): Partial<FullPageLayout> => ({
  ...l,
  beforeBody: [...(l.beforeBody ?? []), HomeGraph],
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
