---
created: 2026-08-07
tags: [python, 자료구조]
publish: true
---

[[Python/Python.md|Python]]의 Set. 순서가 없고 인덱스가 없는 컬렉션이며, 중복된 요소를 허용하지 않는다. 중괄호 `{}`로 작성한다.

```python
my_set = {'one', 'two', 'three'}
print(my_set)

# set() 함수 사용
my_set = set(['one', 'two', 'three'])
print(my_set)
```

Set은 순서가 없으므로 출력 순서가 보장되지 않는다.

## 요소 접근과 추가

Set의 요소는 인덱스나 키로 접근할 수 없다. `for`문으로 순회하거나 `in` 키워드로 존재 여부만 확인할 수 있다.

```python
my_set = {'one', 'two', 'three'}
for val in my_set:
    print(val)
```

Set은 생성 후 기존 항목을 직접 변경할 수 없지만, 새 항목을 추가할 수는 있다.

```python
my_set = {'one', 'two', 'three'}
my_set.add('four') # 단일 요소 추가
my_set.update(['four', 'five', 'six']) # 다른 시퀀스로 업데이트

print(my_set)
# 중복이 허용되지 않으므로 {'one', 'two', 'three', 'four', 'five', 'six'}
```

## 요소 제거

`remove()` 또는 `discard()`를 사용한다. 제거하려는 요소가 없을 때 `remove()`는 오류를 발생시키지만 `discard()`는 발생시키지 않는다.

```python
my_set = {'one', 'two', 'three', 'four'}
my_set.remove('one')    # 'one' 제거
my_set.discard('three') # 'three' 제거
my_set.remove('five')   # 오류 발생
my_set.discard('five')  # 오류 없음
```

## 집합 연산

### 합집합

`.union()`은 Set과 다른 반복 가능한(iterable) 객체의 합집합을 반환한다. Set끼리는 `|` 연산자도 쓸 수 있다. 두 방식 모두 기존 Set을 변경하지 않는다.

```python
s = set("Scaler")
print(s.union("Academy"))
# {'a', 'S', 'c', 'l', 'e', 'r', 'A', 'd', 'm', 'y'}
```

### 교집합

`.intersection()`은 교집합을 반환한다. Set끼리는 `&` 연산자도 쓸 수 있다.

```python
s = set("Scaler")
print(s.intersection("Academy"))
# {'c', 'a', 'e'}
```

### 차집합

`.difference()`는 다른 객체에는 없고 해당 Set에만 있는 요소를 반환한다. Set끼리는 `-` 연산자도 쓸 수 있다.

```python
s = set("Scaler")
print(s.difference("Academy"))
# {'r', 'l', 'S'}
```
