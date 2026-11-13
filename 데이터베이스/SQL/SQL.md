---
created: 2026-11-10
tags: [데이터베이스, sql, sqld]
publish: true
---

SQL(Structured Query Language)은 관계형 [[데이터베이스/데이터베이스.md|데이터베이스]]에서 데이터 구조를 정의하고, 데이터를 조회·조작하고, 권한과 트랜잭션을 제어하는 데 쓰는 언어다.

## SQL 문장 종류

SQL 문장은 하는 일에 따라 네 가지로 나뉜다.

| 종류 | 명령어 |
|---|---|
| 데이터 조작어 (DML, Data Manipulation Language) | SELECT, INSERT, UPDATE, DELETE, MERGE |
| 데이터 정의어 (DDL, Data Definition Language) | CREATE, ALTER, DROP, TRUNCATE, RENAME |
| 데이터 제어어 (DCL, Data Control Language) | GRANT, REVOKE |
| 트랜잭션 제어어 (TCL, Transaction Control Language) | COMMIT, ROLLBACK, SAVEPOINT |

- **[[데이터베이스/SQL/DML.md|DML]]**: 데이터를 다루는 명령어다. [[데이터베이스/SQL/SELECT/SELECT.md|SELECT]]는 데이터베이스에 들어 있는 데이터를 조회하거나 검색하는 명령어로, RETRIEVE라고도 한다. INSERT, UPDATE, DELETE는 테이블에 들어 있는 데이터에 변형을 가하는 명령어로, 테이블의 새로운 행에 데이터를 집어넣거나 원하지 않는 데이터를 삭제하거나 수정한다.
- **[[데이터베이스/SQL/DDL.md|DDL]]**: 테이블과 같은 데이터 구조를 정의하는 명령어다. 그러한 구조를 생성(CREATE)하거나, 변경(ALTER)하거나, 삭제(DROP)하거나, 전체 행을 비우거나(TRUNCATE), 이름을 바꾸는(RENAME) 데 쓴다.
- **[[데이터베이스/SQL/DCL.md|DCL]]**: 데이터베이스에 접근하고 객체들을 사용하도록 권한을 주고(GRANT) 회수하는(REVOKE) 명령어다.
- **[[데이터베이스/SQL/TCL.md|TCL]]**: 논리적인 작업 단위를 묶어서, DML로 조작한 결과를 작업 단위(트랜잭션)별로 제어하는 명령어다.

데이터를 조회만 하는 SELECT를 DML에서 분리해 DQL(Data Query Language, 데이터 질의어)로 따로 분류하기도 한다. 이 경우 SQL 문장은 DDL, DML, DQL, DCL, TCL의 다섯 가지가 된다.

## 관계 대수와 SQL

SQL의 여러 기능은 [[데이터베이스/SQL/관계 대수/관계 대수.md|관계 대수]]의 연산자를 구현한 것이다. [[데이터베이스/SQL/관계 대수/순수 관계 연산자.md|순수 관계 연산자]](SELECT, PROJECT, JOIN, DIVIDE)는 SQL에서 각각 WHERE 절, SELECT 절, 다양한 JOIN 기능으로 구현되며, DIVIDE는 현재 사용되지 않는다. [[데이터베이스/SQL/관계 대수/일반 집합 연산자.md|일반 집합 연산자]](UNION, INTERSECTION, DIFFERENCE, PRODUCT)는 SQL의 집합 연산자와 CROSS JOIN으로 구현되었다.

## 하위 개념

- [[데이터베이스/SQL/SELECT/SELECT.md|SELECT]]
- [[데이터베이스/SQL/DML.md|DML]]
- [[데이터베이스/SQL/DDL.md|DDL]]
- [[데이터베이스/SQL/DCL.md|DCL]]
- [[데이터베이스/SQL/TCL.md|TCL]]
- [[데이터베이스/SQL/제약조건.md|제약조건]]
- [[데이터베이스/SQL/조인.md|조인]]
- [[데이터베이스/SQL/서브쿼리.md|서브쿼리]]
- [[데이터베이스/SQL/집합 연산자.md|집합 연산자]]
- [[데이터베이스/SQL/계층형 질의.md|계층형 질의]]
- [[데이터베이스/SQL/함수/함수.md|함수]]
- [[데이터베이스/SQL/CASE 표현식.md|CASE 표현식]]
- [[데이터베이스/SQL/관계 대수/관계 대수.md|관계 대수]]
