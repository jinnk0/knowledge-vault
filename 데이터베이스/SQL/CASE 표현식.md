---
created: 2026-11-12
tags: [데이터베이스, sql, sqld]
publish: true
---

CASE 표현식은 [[데이터베이스/SQL/SQL.md|SQL]]에서 조건에 따라 서로 다른 값을 반환하는 표현식으로, 흔히 CASE문이라고도 부른다. 비교 방식에 따라 단순 CASE문과 검색 CASE문으로 나뉘고, Oracle에는 단순 CASE와 같은 일을 하는 DECODE 함수도 있다.

| 구분 | 비교 방식 | 사용 가능한 DBMS |
|---|---|---|
| 단순 CASE문 | 한 컬럼이 특정 값과 같은지(`=`)만 비교 | 표준 SQL |
| 검색 CASE문 | WHEN 뒤에 조건식을 자유롭게 사용 | 표준 SQL |
| DECODE 함수 | 단순 CASE와 같은 비교를 함수 형태로 수행 | Oracle 전용 |

조건에 맞는 값이 없을 때 CASE문은 ELSE의 값을, DECODE는 기본값을 반환한다. ELSE나 기본값을 생략했다면 NULL을 반환한다. (출처: Oracle SQL Language Reference)

## 단순 CASE문

단순 CASE문은 CASE 뒤에 비교할 컬럼을 하나 두고, 그 컬럼이 WHEN 뒤의 값과 같은지(`=`)만 비교한다.

```sql
SELECT 이름,
       CASE 부서번호
           WHEN 10 THEN '영업'
           WHEN 20 THEN '개발'
           ELSE '기타'
       END AS 부서명
FROM 사원;
```

## 검색 CASE문

검색 CASE문은 `CASE WHEN 조건` 형태로, WHEN 뒤에 조건식을 자유롭게 쓸 수 있다. 같은지 여부뿐 아니라 범위 비교나 여러 컬럼을 엮은 조건도 표현할 수 있다.

```sql
SELECT 이름,
       CASE
           WHEN 급여 >= 5000 THEN '고액'
           WHEN 급여 >= 3000 THEN '중간'
           ELSE '일반'
       END AS 급여구분
FROM 사원;
```

## DECODE 함수

DECODE 함수는 Oracle 전용 함수로, 단순 CASE문과 같은 일을 함수 형태로 수행한다. `DECODE(컬럼, 값, 결과, 기본값)` 형태로 쓰며, 컬럼이 값과 같으면 결과를, 다르면 기본값을 반환한다. 값과 결과의 쌍은 여러 번 이어서 쓸 수 있다. (출처: Oracle SQL Language Reference)

```sql
-- 위의 단순 CASE문 예시와 같은 결과
SELECT 이름,
       DECODE(부서번호, 10, '영업', 20, '개발', '기타') AS 부서명
FROM 사원;
```

> DECODE는 NULL과 NULL을 같은 값으로 보지만, CASE문은 NULL끼리의 비교를 같다고 보지 않는다. 그래서 `DECODE(보너스, NULL, '없음', '있음')`은 보너스가 NULL일 때 '없음'을 반환하지만, 단순 CASE문의 `WHEN NULL`은 일치하지 않는다. (출처: Oracle SQL Language Reference)

NULL 값을 다른 값으로 바꾸는 NVL, COALESCE 같은 함수는 [[데이터베이스/SQL/함수/단일행 함수.md|단일행 함수]]에서 다룬다.
