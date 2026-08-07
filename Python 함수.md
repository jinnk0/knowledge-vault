---
created: 2026-08-07
tags: []
public: true
---

# Python 함수

상위 개념: [[Python]]

## 키워드 인자를 갖는 함수 (Functions with keyword arguments)

- 기본값(default value)이 설정된 인자를 키워드 인자(keyword arguments)라 하고, 필수 입력 인자를 위치 인자(positional arguments)라고 합니다.
- 위치 인자는 항상 먼저 배치되어야 하며, 키워드 인자는 그 뒤에 따라와야 합니다. (즉, 모든 필수 위치 인자가 앞에 오고, 선택적인 키워드 인자가 뒤에 위치합니다.)
- 기본값이 없는 인자는 필수 입력 항목입니다.

> [!warning] 수정됨
> 원문: "누락될 경우 문법 오류(SyntaxError)가 발생합니다" → 정확히는, 함수 호출 시 필수 인자가 누락되면 실행 시점에 `TypeError`(missing required positional argument)가 발생합니다. `SyntaxError`는 함수를 정의할 때 위치 인자 뒤에 기본값 없는 인자를 두는 등 문법 규칙 자체를 어겼을 때 발생합니다.
