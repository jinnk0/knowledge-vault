---
created: 2026-11-13
tags: [데이터베이스, sql, sqld]
publish: true
---

DML(Data Manipulation Language, 데이터 조작어)은 테이블 안의 데이터를 조작하는 [[데이터베이스/SQL/SQL.md|SQL]] 명령어다. 데이터를 조회하는 [[데이터베이스/SQL/SELECT/SELECT.md|SELECT]]도 DML에 속하며, 이 노트에서는 데이터를 변경하는 INSERT, UPDATE, DELETE, MERGE를 다룬다.

## 기본형

| 명령 | 하는 일 | 기본형 |
|---|---|---|
| INSERT | 새 행을 삽입한다 | `INSERT INTO 사원 (사번, 이름) VALUES (101, '홍길동');` |
| UPDATE | 행의 값을 수정한다 | `UPDATE 사원 SET 부서 = '기획' WHERE 사번 = 101;` |
| DELETE | 행을 삭제한다 | `DELETE FROM 사원 WHERE 부서 = '영업';` |
| MERGE | 조건에 따라 수정 또는 삽입한다 | `MERGE INTO 대상 USING 원본 ON (조건) WHEN MATCHED THEN UPDATE ... WHEN NOT MATCHED THEN INSERT ...` |

## INSERT

INSERT는 VALUES로 값을 직접 넣는 방식 외에, `INSERT INTO ... SELECT ...` 구문으로 다른 테이블의 조회 결과를 넣을 수도 있다.

```sql
INSERT INTO 퇴사자 (사번, 이름)
SELECT 사번, 이름 FROM 사원 WHERE 퇴사일 IS NOT NULL;
```

컬럼 목록을 생략할 경우에는 테이블 정의 순서에 맞춰 모든 대상 컬럼의 값을 제공해야 한다.

## UPDATE와 DELETE

UPDATE나 DELETE에서 [[데이터베이스/SQL/SELECT/WHERE 절.md|WHERE 절]]을 누락하면 테이블의 모든 행에 적용된다.

```sql
-- WHERE가 없으므로 모든 사원의 급여가 0이 된다
UPDATE 사원 SET 급여 = 0;
```

자식 테이블이 참조하고 있는 부모 행을 DELETE할 때는 외래 키(FK)의 `ON DELETE CASCADE`, `ON DELETE SET NULL` 설정에 따라 처리되며, 이런 옵션이 없으면 삭제가 거부된다. 외래 키와 참조 무결성은 [[데이터베이스/SQL/제약조건.md|제약조건]] 노트에서 자세히 다룬다.

## MERGE

MERGE(병합)는 조건(ON)에 매칭되는지 여부에 따라 분기하여 처리한다. 매칭되면 UPDATE를, 매칭되지 않으면 INSERT를 수행한다.

```sql
MERGE INTO 사원 T
USING 입력 S
ON (T.사번 = S.사번)
WHEN MATCHED THEN
    UPDATE SET T.급여 = S.급여
WHEN NOT MATCHED THEN
    INSERT (사번, 급여) VALUES (S.사번, S.급여);
```

Oracle에서 MERGE로 행을 삭제할 때는 독립된 `WHEN MATCHED THEN DELETE` 형태가 아니라, `WHEN MATCHED THEN UPDATE ... DELETE WHERE ...`처럼 UPDATE 절 뒤에 DELETE WHERE를 붙이는 형태로 작성한다. 이 삭제는 갱신한 대상 행 중 삭제 조건을 만족한 행에 적용된다.

```sql
MERGE INTO 사원 T
USING 입력 S
ON (T.사번 = S.사번)
WHEN MATCHED THEN
    UPDATE SET T.급여 = S.급여
    DELETE WHERE T.퇴사여부 = 'Y';  -- 갱신된 행 중 퇴사자만 삭제
```

## DELETE, TRUNCATE, DROP 비교

세 명령은 모두 데이터를 지우지만, 분류와 대상, 롤백 가능 여부가 다르다.

| 구분 | DELETE | TRUNCATE | DROP |
|---|---|---|---|
| 분류 | DML | DDL | DDL |
| 대상 | 조건에 맞는 행 (WHERE가 없으면 전체 행) | 전체 행 | 테이블 자체 |
| Oracle에서 롤백 | 커밋 전 가능 | 불가 | 불가 |

세 명령 중 DELETE만 DML이므로, Oracle에서는 커밋(COMMIT) 전에 롤백(ROLLBACK)할 수 있다. TRUNCATE와 DROP은 [[데이터베이스/SQL/DDL.md|DDL]]이어서 실행하면 암시적 커밋(Implicit Commit)이 발생하므로 롤백할 수 없다.

> 클라이언트가 자동 커밋(Auto-commit)으로 설정된 상태라면, DML인 DELETE도 실행 즉시 커밋되므로 되돌릴 수 없다.
