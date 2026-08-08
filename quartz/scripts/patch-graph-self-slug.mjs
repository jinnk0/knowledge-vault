#!/usr/bin/env node
// @quartz-community/graph의 번들 클라이언트 스크립트(dist/components/index.js) 안에는
// 현재 페이지 URL을 그래프 데이터의 슬러그와 비교하기 위해 정규화하는 we() 함수가 있다.
//
// 이 함수가 다른 정규화 대상(콘텐츠 인덱스 키, crawl-links가 만든 링크 엣지)과
// 다르게 동작해서 두 가지 문제가 생긴다:
//   1. 끝 슬래시를 무조건 지운다 — 이 vault는 상위 개념 노트를 폴더로 승격하므로
//      (CLAUDE.md 규칙, 예: Python/Python.md) 그 노트의 URL은 "python/"으로 끝나는데,
//      데이터 쪽 정규화는 끝 슬래시를 보존해서 "python/"으로 남는다. we()만 슬래시를
//      지워 "python"이 되면서 자기 자신과도 매칭이 안 되고, 로컬 그래프가 이웃 노드를
//      하나도 찾지 못한다.
//   2. decodeURIComponent를 부르지 않는다 — 브라우저는 한글이 포함된 경로를 퍼센트
//      인코딩(예: %EC%97%B0%EC%82%B0%EC%9E%90)된 채로 location.pathname에 돌려주는데,
//      콘텐츠 인덱스의 키는 이미 디코딩된 유니코드 문자열이라 마찬가지로 매칭이 안
//      되고, 심지어 자기 자신의 라벨이 인코딩된 문자열 그대로 표시된다.
//
// 거의 모든 노트 제목이 한글이고 상위 개념 노트가 전부 폴더로 승격되는 이 vault
// 구조에서는 사실상 모든 페이지의 사이드바(로컬) 그래프가 영향을 받는다. 홈페이지
// 히어로 그래프는 depth: -1(전체 그래프) 모드라 self-id 매칭에 의존하지 않아서
// 증상이 드러나지 않았을 뿐이다.
//
// node_modules를 직접 고치면 재설치 시 사라지므로, npm install/ci 직후 자동 실행되는
// postinstall 훅으로 매번 다시 적용한다. 원본 함수 시그니처가 패키지 업데이트로
// 바뀌면 치환 대상을 못 찾으므로 경고만 출력하고 그냥 넘어간다(빌드를 깨지 않는다).

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const targetPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@quartz-community",
  "graph",
  "dist",
  "components",
  "index.js",
)

const buggyWe =
  'function we(){let u=window.location.pathname;return u.endsWith("/")&&(u=u.slice(0,-1)),u.startsWith("/")&&(u=u.slice(1)),u}'
const fixedWe =
  'function we(){let u=decodeURIComponent(window.location.pathname);return u.startsWith("/")&&(u=u.slice(1)),u}'

if (!fs.existsSync(targetPath)) {
  console.log("[patch-graph-self-slug] @quartz-community/graph가 설치되어 있지 않다. 건너뜀.")
  process.exit(0)
}

const original = fs.readFileSync(targetPath, "utf-8")

if (original.includes(fixedWe)) {
  console.log("[patch-graph-self-slug] 이미 패치되어 있다. 건너뜀.")
  process.exit(0)
}

if (!original.includes(buggyWe)) {
  console.warn(
    "[patch-graph-self-slug] 패치 대상 함수(we())를 찾지 못했다 — " +
      "@quartz-community/graph 버전이 바뀌어 내부 구현이 달라졌을 수 있다. " +
      "그래프 self-id 매칭 버그가 여전히 남아있을 수 있으니 확인 필요.",
  )
  process.exit(0)
}

fs.writeFileSync(targetPath, original.replace(buggyWe, fixedWe), "utf-8")
console.log("[patch-graph-self-slug] we() 함수를 패치했다 (끝 슬래시 보존 + URI 디코딩).")
