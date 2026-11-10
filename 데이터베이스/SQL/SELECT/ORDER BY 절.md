---
created: 2026-11-10
tags: [데이터베이스, sql, select, sqld]
publish: true
---

ORDER BY 절은 [[데이터베이스/SQL/SELECT/SELECT.md|SELECT]] 문으로 조회한 데이터를 정렬하는 절이다. SELECT 문의 실행 순서에서 가장 마지막에 수행된다.

## 문법

```sql
SELECT 컬럼명 [ALIAS명]
FROM 테이블명
[WHERE 조건식]
[GROUP BY 컬럼이나 표현식]
[HAVING 그룹조건식]
[ORDER BY 컬럼이나 표현식 [ASC | DESC]];
```

정렬 방향은 두 가지 중에서 고른다.

- **ASC(Ascending)**: 조회한 데이터를 오름차순으로 정렬한다. 기본값이므로 생략할 수 있다.
- **DESC(Descending)**: 조회한 데이터를 내림차순으로 정렬한다.

```sql
SELECT 이름, 입사일 FROM 사원 ORDER BY 입사일;       -- ASC 생략: 입사일이 이른 사원부터
SELECT 이름, 급여 FROM 사원 ORDER BY 급여 DESC;      -- 급여가 높은 사원부터
```

## 정렬 순서

기본적인 정렬 순서는 오름차순(ASC)이다. 오름차순으로 정렬했을 때 데이터 타입별로 다음 값이 먼저 출력된다.

- **숫자형**: 가장 작은 값부터 출력된다.
- **날짜형**: 날짜 값이 가장 이른 값이 먼저 출력된다.

[[데이터베이스/NULL.md|NULL]]의 위치는 DBMS마다 다르다.

| DBMS | NULL을 간주하는 방식 | 오름차순(ASC) | 내림차순(DESC) |
|---|---|---|---|
| Oracle | 가장 큰 값 | 가장 마지막 | 가장 먼저 |
| SQL Server | 가장 작은 값 | 가장 먼저 | 가장 마지막 |
