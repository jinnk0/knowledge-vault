---
created: 2026-11-13
tags: [데이터베이스, sql, sqld]
publish: true
---

DDL(Data Definition Language, 데이터 정의어)은 테이블·인덱스·뷰 같은 데이터 구조(스키마) 자체를 정의·변경·삭제하는 [[데이터베이스/SQL/SQL.md|SQL]] 명령어다. 테이블 안의 데이터를 다루는 [[데이터베이스/SQL/DML.md|DML]]과 달리, DDL은 데이터를 담는 틀을 다룬다. (출처: 문어CBT SQLD 개념 로드맵)

## 주요 명령어

| 명령 | 하는 일 | 롤백 (Oracle) |
|---|---|---|
| CREATE | 테이블·인덱스·뷰 등 객체를 생성한다 | 불가 |
| ALTER | 기존 객체의 구조를 변경한다 (컬럼 추가 등) | 불가 |
| DROP | 객체 자체를 삭제한다. 구조까지 사라진다 | 불가 |
| TRUNCATE | 테이블의 전체 행을 한 번에 비운다. 구조는 유지된다 | 불가 |
| RENAME | 객체의 이름을 바꾼다 | 불가 |

```sql
CREATE TABLE 주문 (주문번호 NUMBER, 고객명 VARCHAR2(20));
ALTER TABLE 주문 ADD (주문일 DATE);  -- 컬럼 추가
TRUNCATE TABLE 주문;                 -- 행은 모두 지우고 테이블 구조는 남긴다
DROP TABLE 주문;                     -- 테이블 자체를 삭제한다
```

## Oracle의 암시적 커밋

Oracle에서는 DDL 앞뒤에 암시적 COMMIT이 실행된다. 그래서 DDL 자체를 ROLLBACK으로 되돌릴 수 없고, DDL보다 앞서 실행한 커밋되지 않은 DML도 함께 커밋될 수 있다.

```sql
DELETE FROM 사원 WHERE 부서 = '영업';  -- 아직 커밋 전
CREATE TABLE 임시 (번호 NUMBER);       -- DDL 실행 → 암시적 COMMIT
ROLLBACK;                              -- 앞의 DELETE도 이미 커밋되어 되돌려지지 않는다
```

이 때문에 같은 "삭제"라도 DML인 DELETE와 DDL인 TRUNCATE·DROP은 동작이 다르다. DELETE는 조건에 맞는 행만 지우고 커밋 전이라면 롤백할 수 있지만, TRUNCATE는 전체 행을 비우고 DROP은 테이블 구조까지 없애며, 둘 다 암시적 커밋 때문에 롤백할 수 없다. "TRUNCATE도 DELETE처럼 ROLLBACK된다"고 보면 틀린다. 세 명령의 자세한 비교는 [[데이터베이스/SQL/DML.md|DML]] 노트에서 다룬다.

## ALTER의 세부 동작

ALTER는 컬럼을 더하고 빼는 것 말고도 컬럼의 정의를 바꿀 수 있는데, 값이 이미 든 컬럼을 바꿀 때는 제약이 걸린다.

- **컬럼 크기 축소**: 데이터가 없으면 자유롭게 줄일 수 있지만, 이미 저장된 값보다 작게는 줄일 수 없다.
- **DEFAULT 변경**: DEFAULT를 바꿔도 이미 저장된 행에는 소급 적용되지 않는다. 변경 이후에 삽입되는 행부터 새 기본값이 적용된다.
- **NOT NULL 추가**: NOT NULL을 새로 걸 때 그 컬럼에 이미 [[데이터베이스/NULL.md|NULL]]이 있으면 오류가 난다. 먼저 값을 채워야 한다.

```sql
ALTER TABLE 사원 MODIFY (이름 VARCHAR2(10));       -- 10자보다 긴 이름이 있으면 오류
ALTER TABLE 사원 MODIFY (상태 DEFAULT 'Y');        -- 기존 행의 상태 값은 그대로다
UPDATE 사원 SET 전화번호 = '없음' WHERE 전화번호 IS NULL;
ALTER TABLE 사원 MODIFY (전화번호 NOT NULL);       -- NULL을 먼저 채운 뒤에 건다
```

## CTAS로 테이블 복제

CTAS(`CREATE TABLE ... AS SELECT`)는 조회 결과를 그대로 새 테이블로 빠르게 복제하는 방법이다. 테이블의 구조와 데이터를 함께 복제한다.

```sql
-- 주문 테이블의 구조와 데이터를 주문_백업으로 복제
CREATE TABLE 주문_백업 AS SELECT * FROM 주문;
```

다만 Oracle의 CTAS는 대부분의 [[데이터베이스/SQL/제약조건.md|제약조건]]을 가져오지 않는다.

| 복제되는 것 | 복제되지 않는 것 |
|---|---|
| 테이블 구조, 데이터, 일부 명시적 NOT NULL 제약 | PK, FK, UNIQUE, CHECK, DEFAULT, 인덱스, 트리거 |

NOT NULL은 원본 컬럼을 식 없이 그대로 선택하는 등 조건을 충족하면 이어질 수 있다. 그 밖의 제약과 인덱스는 복제 후 필요한 만큼 따로 만들어야 한다.

## Oracle 객체 이름 규칙

Oracle에서 테이블·컬럼 같은 객체 이름을 따옴표 없이 쓰는 경우(비인용 식별자)에는 다음 규칙을 따른다.

- 문자로 시작해야 하며, 숫자로 시작할 수 없다.
- 예약어를 그대로 사용할 수 없다.

큰따옴표로 감싼 인용 식별자는 이 규칙에 예외가 있지만, 대소문자까지 구분되므로 일반적으로 지양한다.

```sql
CREATE TABLE 2024주문 (번호 NUMBER);    -- 오류: 숫자로 시작
CREATE TABLE 주문2024 (번호 NUMBER);    -- 가능
CREATE TABLE "2024주문" (번호 NUMBER);  -- 가능하지만, 이후에도 항상 "2024주문"으로 써야 한다
```
