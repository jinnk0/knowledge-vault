---
created: 2026-11-06
tags: [데이터베이스, sql, sqld]
publish: true
---

NULL은 [[데이터베이스/데이터베이스.md|데이터베이스]]에서 모르는 값, 즉 값의 부재를 의미한다. 아직 정의되지 않은 값이라는 점에서 0이나 공백과는 다르다. 0은 숫자이고 공백은 하나의 문자이므로, 둘 다 엄연히 값이 들어 있는 상태다.

## NULL을 허용하는 컬럼

테이블을 생성할 때 NOT NULL 또는 PRIMARY KEY로 정의되지 않은 모든 데이터 유형은 NULL을 포함할 수 있다. 반대로 NOT NULL 컬럼이나 PRIMARY KEY로 정의된 [[데이터베이스/데이터 모델링/키.md|기본키]] 컬럼에는 NULL이 들어갈 수 없다.

```sql
CREATE TABLE 사원 (
    사원번호 NUMBER PRIMARY KEY,    -- NULL 불가
    이름     VARCHAR2(20) NOT NULL, -- NULL 불가
    보너스   NUMBER                 -- NULL 가능
);
```

## 연산과 비교

NULL이 포함된 연산의 결과는 NULL이다. 모르는 데이터에 숫자를 더하거나 빼도 결과는 여전히 모르는 데이터인 것과 같다.

비교도 마찬가지다. NULL과의 비교는 IS NULL, IS NOT NULL을 제외하면 모두 알 수 없음(Unknown)을 반환한다. NULL = NULL 역시 TRUE가 아니라 Unknown이며, WHERE 절에서는 참이 아닌 조건으로 처리되므로 FALSE와 마찬가지로 해당 행이 선택되지 않는다. 그래서 NULL 여부는 `=` 대신 IS NULL, IS NOT NULL로만 확인한다. (출처: Oracle SQL Language Reference)

| 식 | 결과 |
|---|---|
| `NULL + 100` | NULL |
| `NULL = NULL` | Unknown |
| `NULL <> 0` | Unknown |
| `NULL IS NULL` | TRUE |

```sql
-- 조건이 Unknown이 되어 보너스가 NULL인 사원을 찾지 못한다
SELECT * FROM 사원 WHERE 보너스 = NULL;

-- 보너스가 NULL인 사원을 찾는다
SELECT * FROM 사원 WHERE 보너스 IS NULL;
```

## NULL을 다른 값으로 바꾸기

결괏값으로 NULL이 아닌 다른 값을 얻고 싶을 때는 NVL(Oracle) 또는 ISNULL(SQL Server) 함수를 사용한다. 대상이 숫자 유형 데이터이면 주로 0으로 바꾸고, 문자 유형 데이터이면 공백보다는 'X'처럼 해당 시스템에서 의미 없는 문자로 바꾸는 경우가 많다. (출처: Oracle SQL Language Reference, Microsoft Learn)

```sql
SELECT 이름, NVL(보너스, 0) AS 보너스 FROM 사원;    -- Oracle
SELECT 이름, ISNULL(보너스, 0) AS 보너스 FROM 사원; -- SQL Server
```

## 집계 함수와 NULL

집계 함수를 계산할 때 NULL 값은 계산에서 제외된다. 단, `COUNT(*)`는 NULL 여부와 상관없이 전체 행의 수를 센다. (출처: Oracle SQL Language Reference)

```sql
-- 보너스가 100, 200, NULL인 세 행이 있을 때
SELECT COUNT(*), COUNT(보너스), SUM(보너스), AVG(보너스) FROM 사원;
-- 결과: 3, 2, 300, 150
```

`AVG(보너스)`가 100이 아니라 150인 것은 NULL인 행을 빼고 두 행의 평균을 구했기 때문이다.
