# knowledge-vault

### 👉 [사이트 바로가기](https://jinnk0.github.io/knowledge-vault)

배우고 정리한 것들을 쌓아두는 개인 지식 저장소입니다. Obsidian으로 노트를 작성하고, [Quartz](https://quartz.jzhao.xyz)로 정적 사이트를 만들어 GitHub Pages에 배포합니다.

## 구조

- 노트는 주제별 폴더에 마크다운 파일로 저장됩니다.
- 노트끼리는 `[[위키링크]]`로 연결되며, 사이트에서는 그래프 뷰로 관계를 볼 수 있습니다.
- `quartz/` 폴더는 사이트 생성 도구 코드이며, 노트가 아닙니다.

## 배포

`master` 브랜치에 push하면 GitHub Actions가 자동으로 사이트를 빌드해 배포합니다. 설정은 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)에 있습니다.

frontmatter에 `publish: true`가 있는 노트만 사이트에 공개됩니다. 그 외의 노트는 저장소에는 남아 있지만 사이트에는 나타나지 않습니다.

## 로컬에서 미리보기

```bash
cd quartz
npm i
npx quartz build --directory .. --serve
```
