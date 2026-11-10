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
| 데이터 조작어 (DML, Data Manipulation Language) | SELECT, INSERT, UPDATE, DELETE |
| 데이터 정의어 (DDL, Data Definition Language) | CREATE, ALTER, DROP, RENAME |
| 데이터 제어어 (DCL, Data Control Language) | GRANT, REVOKE |
| 트랜잭션 제어어 (TCL, Transaction Control Language) | COMMIT, ROLLBACK |

- **DML**: 데이터를 다루는 명령어다. [[데이터베이스/SQL/SELECT/SELECT.md|SELECT]]는 데이터베이스에 들어 있는 데이터를 조회하거나 검색하는 명령어로, RETRIEVE라고도 한다. INSERT, UPDATE, DELETE는 테이블에 들어 있는 데이터에 변형을 가하는 명령어로, 테이블의 새로운 행에 데이터를 집어넣거나 원하지 않는 데이터를 삭제하거나 수정한다.
- **DDL**: 테이블과 같은 데이터 구조를 정의하는 명령어다. 그러한 구조를 생성(CREATE)하거나, 변경(ALTER)하거나, 삭제(DROP)하거나, 이름을 바꾸는(RENAME) 데 쓴다.
- **DCL**: 데이터베이스에 접근하고 객체들을 사용하도록 권한을 주고(GRANT) 회수하는(REVOKE) 명령어다.
- **TCL**: 논리적인 작업 단위를 묶어서, DML로 조작한 결과를 작업 단위(트랜잭션)별로 제어하는 명령어다.

## 순수 관계 연산자와 SQL

관계형 데이터베이스의 순수 관계 연산자는 SQL에서 다음과 같이 구현된다.

| 순수 관계 연산자 | SQL에서의 구현 |
|---|---|
| SELECT | WHERE 절 |
| PROJECT | SELECT 절 |
| (NATURAL) JOIN | 다양한 [[데이터베이스/SQL/조인.md|JOIN]] 기능 |
| DIVIDE | 현재 사용되지 않음 |

이름이 같아도 관계 연산자의 SELECT는 SQL의 SELECT 절이 아니라 WHERE 절에 대응하고, SQL의 SELECT 절에 대응하는 것은 PROJECT 연산이라는 점에 주의한다.

## 하위 개념

- [[데이터베이스/SQL/SELECT/SELECT.md|SELECT]]
- [[데이터베이스/SQL/조인.md|조인]]
- [[데이터베이스/SQL/함수/함수.md|함수]]
