---
created: 2026-11-13
tags: [데이터베이스, sql, sqld]
publish: true
---

DCL(Data Control Language, 데이터 제어어)은 데이터에 대한 권한, 즉 접근 제어를 다루는 [[데이터베이스/SQL/SQL.md|SQL]] 명령어다. 권한을 부여하는 GRANT와 회수하는 REVOKE가 있다. GRANT·REVOKE는 데이터가 아니라 권한을 다루므로 DML이 아니라 DCL이며, 트랜잭션을 제어하는 COMMIT·ROLLBACK은 DCL이 아니라 [[데이터베이스/SQL/TCL.md|TCL]]이다.

## GRANT와 REVOKE

| 명령·객체 | 하는 일 |
|---|---|
| GRANT | 사용자나 ROLE에 권한 또는 ROLE을 부여한다 |
| REVOKE | 직접 부여한 권한 또는 ROLE을 회수한다 |
| ROLE | 여러 권한을 묶는 객체다 (`CREATE ROLE`로 생성) |

객체 권한은 `GRANT 권한 ON 객체 TO 사용자`로 부여하고, `REVOKE 권한 ON 객체 FROM 사용자`로 회수한다.

```sql
GRANT SELECT, INSERT ON 사원 TO user1;
REVOKE INSERT ON 사원 FROM user1;
```

## ROLE

ROLE은 여러 권한을 묶는 객체다. 사용자마다 권한을 하나씩 주는 대신, 권한을 ROLE에 모아 두고 ROLE을 사용자에게 부여해 권한 관리를 단순화한다.

ROLE을 만들고 없애는 것과, ROLE에 권한을 넣고 배정하는 것은 서로 다른 명령으로 한다.

- **생성과 삭제**: ROLE 자체는 `CREATE ROLE`로 만들고 `DROP ROLE`로 삭제한다.
- **권한 배정**: ROLE에 권한을 넣거나, 사용자 또는 다른 ROLE에 ROLE을 부여·회수할 때는 GRANT·REVOKE를 사용한다.

```sql
CREATE ROLE clerk_role;
GRANT SELECT, INSERT ON 사원 TO clerk_role;  -- ROLE에 권한을 넣는다
GRANT clerk_role TO user1;                   -- 사용자에게 ROLE을 부여한다
REVOKE clerk_role FROM user1;                -- 사용자에게서 ROLE을 회수한다
DROP ROLE clerk_role;
```

## 재부여 옵션과 연쇄 회수

받은 권한을 다른 사용자에게 다시 부여할 수 있게 하려면 부여할 때 옵션을 붙인다. 권한의 종류에 따라 옵션이 다르다.

| 권한 종류 | 재부여 옵션 |
|---|---|
| 객체 권한 | `WITH GRANT OPTION` |
| 시스템 권한, ROLE | `WITH ADMIN OPTION` |

```sql
GRANT SELECT ON 사원 TO user2 WITH GRANT OPTION;  -- user2가 다른 사용자에게 다시 부여할 수 있다
```

객체 권한을 `WITH GRANT OPTION`으로 부여하면 사용자 사슬을 따라 재부여할 수 있다. 이때 원 권한을 회수하면 그 사용자에게서 파생된 객체 권한도 연쇄적으로 회수된다.

```text
DBA → U1 (객체 권한 WITH GRANT OPTION) → U2 → U3
DBA가 U1의 객체 권한을 REVOKE → U1의 부여에 의존한 U2·U3의 권한도 연쇄 회수
```

반면 Oracle에서 시스템 권한을 회수할 때는, 그 사용자가 다른 사용자에게 부여한 같은 시스템 권한까지 연쇄 회수하지 않는다. 따라서 연쇄 회수 설명은 객체 권한의 부여 사슬에만 적용하고 시스템 권한과 섞지 않는다.
