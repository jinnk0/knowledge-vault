---
created: 2026-11-10
tags: [데이터베이스, sql, sqld]
publish: true
---

SELECT는 데이터베이스에 들어 있는 데이터를 조회하는 [[데이터베이스/SQL/SQL.md|SQL]] 명령어로, DML(데이터 조작어)에 속한다.

## 기본 문법

가장 단순한 SELECT 문은 보고 싶은 컬럼과 그 컬럼이 들어 있는 테이블만 지정한다.

```sql
SELECT [ALL | DISTINCT] 컬럼명1, 컬럼명2, ...
FROM 테이블명;
```

컬럼명 앞에는 중복 데이터를 어떻게 처리할지 정하는 옵션을 붙일 수 있다.

- **ALL**: 중복된 데이터가 있어도 모두 출력한다. 기본(Default) 옵션이므로 별도로 표시하지 않아도 된다.
- **DISTINCT**: 중복된 데이터가 있는 경우 1건으로 처리해서 출력한다.

```sql
SELECT DISTINCT 부서번호 FROM 사원;  -- 부서번호가 겹치는 행은 한 번만 출력된다
```

## 전체 구조와 실행 순서

[[데이터베이스/SQL/SELECT/WHERE 절.md|WHERE 절]], [[데이터베이스/SQL/SELECT/GROUP BY 절.md|GROUP BY 절]], [[데이터베이스/SQL/SELECT/ORDER BY 절.md|ORDER BY 절]]까지 모두 쓴 SELECT 문은 다음과 같은 형태다.

```sql
SELECT [DISTINCT] 컬럼명 [ALIAS명]
FROM 테이블명
[WHERE 조건식]
[GROUP BY 컬럼이나 표현식]
[HAVING 그룹조건식]
[ORDER BY 컬럼이나 표현식 [ASC | DESC]];
```

작성 순서와 달리, 실제로는 다음 순서로 실행된다.

1. 발췌 대상 테이블을 참조한다. (FROM)
2. 발췌 대상 데이터가 아닌 것은 제거한다. (WHERE)
3. 행들을 소그룹화한다. (GROUP BY)
4. 그루핑된 값의 조건에 맞는 것만을 출력한다. (HAVING)
5. 데이터 값을 출력하거나 계산한다. (SELECT)
6. 데이터를 정렬한다. (ORDER BY)

WHERE 절에 집계 함수를 쓸 수 없는 이유도 이 순서에서 나온다. WHERE 절이 GROUP BY 절보다 먼저 실행되기 때문이다.

## DUAL 테이블

DUAL 테이블은 SELECT ~ FROM ~ 의 형식을 갖추기 위한 일종의 DUMMY 테이블이다. 특정 테이블의 데이터가 아니라 [[데이터베이스/SQL/함수/단일행 함수.md|단일행 함수]]의 결과나 상수 값만 보고 싶을 때도 FROM 절이 필요하므로, 이 테이블을 빌려 쓴다.

- 사용자 SYS가 소유하며, 모든 사용자가 액세스할 수 있다.
- DUMMY라는 문자열 유형의 컬럼에 'X'라는 값이 들어 있는 행을 1건 포함하고 있다.

```sql
SELECT SYSDATE FROM DUAL;  -- 행이 1건뿐이므로 결과도 1건 출력된다
```

## 하위 개념

- [[데이터베이스/SQL/SELECT/WHERE 절.md|WHERE 절]]
- [[데이터베이스/SQL/SELECT/GROUP BY 절.md|GROUP BY 절]]
- [[데이터베이스/SQL/SELECT/ORDER BY 절.md|ORDER BY 절]]
