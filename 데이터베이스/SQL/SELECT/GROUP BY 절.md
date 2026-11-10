---
created: 2026-11-10
tags: [데이터베이스, sql, select, sqld]
publish: true
---

GROUP BY 절은 [[데이터베이스/SQL/SELECT/SELECT.md|SELECT]] 문에서 행들을 소그룹으로 묶는 절이고, HAVING 절은 그렇게 묶인 소그룹에 조건을 거는 절이다.

## 문법

```sql
SELECT [DISTINCT] 컬럼명 [ALIAS명]
FROM 테이블명
[WHERE 조건식]
[GROUP BY 컬럼이나 표현식]
[HAVING 그룹조건식];
```

## GROUP BY 절

GROUP BY 절을 통해 소그룹별 기준을 정한 후, SELECT 절에 [[데이터베이스/SQL/함수/집계 함수.md|집계 함수]]를 사용한다. 이때 집계 함수의 통계 정보는 [[데이터베이스/NULL.md|NULL]] 값을 가진 행을 제외하고 계산한다.

GROUP BY 절에서는 SELECT 절과 달리 ALIAS명을 사용할 수 없다.

## WHERE 절과 HAVING 절

[[데이터베이스/SQL/SELECT/WHERE 절.md|WHERE 절]]과 HAVING 절은 둘 다 조건을 거는 절이지만, 조건이 적용되는 시점과 대상이 다르다.

| 구분 | WHERE 절 | HAVING 절 |
|---|---|---|
| 적용 시점 | 전체 데이터를 그룹으로 나누기 전 | GROUP BY 절로 소그룹을 만든 후 |
| 조건 대상 | 개별 행 | GROUP BY 절의 기준 항목이나 소그룹의 집계 함수 |
| 집계 함수 | 사용할 수 없다 | 사용할 수 있다 |
| 위치 | FROM 절 다음 | 일반적으로 GROUP BY 절 뒤 |

WHERE 절은 전체 데이터를 그룹으로 나누기 전에 행들을 미리 제거한다. 집계 함수는 WHERE 절에 올 수 없는데, 집계 함수를 사용할 수 있는 GROUP BY 절보다 WHERE 절이 먼저 수행되기 때문이다.

반면 HAVING 절은 GROUP BY 절에 의해 소그룹별로 만들어진 집계 데이터 중, 제한 조건을 만족하는 내용만 출력한다.

```sql
SELECT 부서번호, AVG(급여) AS 평균급여
FROM 사원
WHERE 입사일 >= DATE '2020-01-01'  -- 그룹으로 나누기 전에 행을 거른다
GROUP BY 부서번호                   -- 여기서는 평균급여라는 ALIAS를 쓸 수 없다
HAVING AVG(급여) >= 3000;           -- 소그룹의 집계 결과에 조건을 건다
```
