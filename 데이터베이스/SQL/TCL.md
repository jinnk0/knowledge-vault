---
created: 2026-11-13
tags: [데이터베이스, sql, sqld]
publish: true
---

TCL(Transaction Control Language, 트랜잭션 제어어)은 [[데이터베이스/SQL/DML.md|DML]]로 조작한 결과를 트랜잭션 단위로 확정하거나 취소하는 [[데이터베이스/SQL/SQL.md|SQL]] 명령어다.

## 명령어

| 명령 | 하는 일 |
|---|---|
| COMMIT | 지금까지의 변경을 영구 확정한다 |
| ROLLBACK | 마지막 COMMIT 시점으로 되돌린다 |
| SAVEPOINT | 중간 저장점을 표시한다 (부분 롤백용) |

COMMIT, ROLLBACK, SAVEPOINT는 권한이 아니라 트랜잭션의 확정과 취소를 다루므로 TCL이다. 일부 교재는 이들을 DCL에 묶기도 하지만, SQLD에서는 권한을 다루는 [[데이터베이스/SQL/DCL.md|DCL]](GRANT, REVOKE)과 구분해 TCL로 분류한다.

## SAVEPOINT와 부분 롤백

SAVEPOINT는 트랜잭션 중간에 저장점을 표시해, `ROLLBACK TO SAVEPOINT 이름`으로 그 지점까지만 되돌리는 부분 롤백을 가능하게 한다. 저장점 자체는 아무것도 확정하지 않으며, 저장점 이후의 변경만 나중에 되돌릴 수 있다.

단, COMMIT을 하는 순간 그 이전의 SAVEPOINT는 모두 사라진다. 다음 흐름을 따라가 보자.

```sql
INSERT INTO TBL VALUES (1);

SAVEPOINT SP1;                  -- 저장점

INSERT INTO TBL VALUES (2);

ROLLBACK TO SAVEPOINT SP1;      -- (2)만 취소, (1)은 남는다 → 부분 롤백

COMMIT;                         -- (1)이 확정되고 SP1은 소멸한다

ROLLBACK TO SAVEPOINT SP1;      -- 오류: COMMIT 뒤라 SP1이 없다
```

`ROLLBACK TO SP1` 후에는 행 (1)만 남고, 이어지는 COMMIT으로 (1)이 확정되면서 SP1은 소멸한다. 롤백 방식에 따른 결과는 다음과 같다.

| 상황 | 결과 |
|---|---|
| `ROLLBACK TO SAVEPOINT 이름` | 그 저장점 이후의 변경만 취소한다 (이전 변경은 유지) |
| `ROLLBACK` (이름 없음) | 마지막 COMMIT 이후의 변경을 전체 취소한다 |
| COMMIT 이후 같은 이름으로 롤백 | 오류가 난다 (저장점이 이미 소멸) |

> "COMMIT 후에도 이전 SAVEPOINT로 롤백할 수 있다"고 보면 틀린다. COMMIT은 저장점을 지운다.

## Oracle DDL의 암시적 커밋

Oracle에서는 [[데이터베이스/SQL/DDL.md|DDL]](CREATE, ALTER, DROP, TRUNCATE)을 실행하기 전과 후에 암시적 COMMIT이 일어나, 직전에 실행한 DML의 변경도 함께 확정된다. 이 규칙은 Oracle의 동작이므로 다른 DBMS에 무조건 똑같이 적용하면 안 된다.

## 트랜잭션의 ACID

TCL이 제어하는 트랜잭션은 다음 네 가지 성질(ACID)을 갖는다.

| 성질 | 의미 |
|---|---|
| 원자성 (Atomicity) | 트랜잭션의 작업이 모두 수행되거나 모두 취소된다 (All or Nothing) |
| 일관성 (Consistency) | 트랜잭션 전후에 데이터가 일관된 상태를 유지한다 |
| 고립성 (Isolation) | 동시에 실행되는 트랜잭션의 중간 상태가 서로에게 미치는 영향을 제어한다 |
| 지속성 (Durability) | COMMIT한 결과는 영구히 보존된다 |

"전부 아니면 전무"는 원자성이고, 동시 실행되는 트랜잭션 사이의 중간 상태 노출을 제어하는 성질은 고립성이다. 둘을 바꿔 쓰지 않도록 주의한다.
