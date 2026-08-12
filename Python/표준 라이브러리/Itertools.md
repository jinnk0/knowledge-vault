---
created: 2026-08-12
tags: [python, 표준라이브러리, iterator]
publish: true
---

[[Python/표준 라이브러리/표준 라이브러리.md|표준 라이브러리]]에 속하는 모듈인 **Itertools**는 반복자(iterator)에 적용되어 복잡한 반복자를 생성하는 다양한 함수를 제공한다. 그 자체로 사용되거나 여러 함수를 조합해 반복자 대수(iterator algebra)를 구성하는, 빠르고 메모리 효율적인 도구로 쓰인다.

Itertools가 제공하는 반복자는 무한 반복자(Infinite Iterators), 조합 반복자(Combinatoric Iterators), 종결 반복자(Terminating Iterators) 세 가지로 나뉜다.

## 무한 반복자 (Infinite Iterators)

Python에서 반복자란 [[Python/반복문.md|for 반복문]]과 함께 사용할 수 있는 모든 타입을 뜻하며, [[Python/자료형/컬렉션/리스트.md|리스트]], [[Python/자료형/컬렉션/튜플.md|튜플]], [[Python/자료형/컬렉션/딕셔너리.md|딕셔너리]], [[Python/자료형/컬렉션/Set.md|Set]] 등이 내장 반복자의 예시다. 반복자 객체가 반드시 소진(종료)되어야 하는 것은 아니며 때로는 무한할 수도 있는데, 이런 반복자를 무한 반복자라 한다. Python은 세 가지 무한 반복자를 제공한다.

**`count(start, step)`**: `start` 숫자부터 시작해 무한히 값을 출력한다. `step`이 지정되면 그 값만큼 건너뛰며, 지정되지 않으면 기본 단계값은 1이다.

```python
import itertools

for i in itertools.count(5, 5):
    if i == 35:
        break
    else:
        print(i, end=" ")

# 출력 결과:
# 5 10 15 20 25 30
```

**`cycle(iterable)`**: 전달받은 컨테이너의 모든 값을 순서대로 출력하고, 모든 요소를 한 바퀴 순회한 뒤에는 다시 처음부터 반복한다.

```python
import itertools

count = 0
for i in itertools.cycle('AB'):
    if count > 7:
        break
    else:
        print(i, end=" ")
        count += 1

# 출력 결과:
# A B A B A B A B
```

**`repeat(val, num)`**: 전달된 값을 무한히 반복 출력한다. 선택적 키워드 인자 `num`이 지정되면 그 횟수만큼만 반복한다.

```python
import itertools

print(list(itertools.repeat(25, 4)))
# 출력: [25, 25, 25, 25]
```

## 조합 반복자 (Combinatoric Iterators)

순열, 조합, 데카르트 곱(Cartesian product)과 같은 조합론적 구조를 단순화하는 데 쓰이는 재귀적 제너레이터를 조합 반복자라 한다. Python은 네 가지 조합 반복자를 제공한다.

**`product(*iterables, repeat=1)`**: 입력받은 반복 가능 객체(iterable)들의 데카르트 곱을 계산한다. 반복 가능 객체 자신과의 곱을 계산할 때는 `repeat` 키워드 인자로 반복 횟수를 지정한다. 결과는 정렬된 순서의 튜플로 반환된다.

```python
from itertools import product

print(list(product([1, 2], repeat=2)))
# 출력: [(1, 1), (1, 2), (2, 1), (2, 2)]

print(list(product([1, 2], '2')))
# 출력: [(1, '2'), (2, '2')]

print(list(product('AB', [3, 4])))
# 출력: [('A', 3), ('A', 4), ('B', 3), ('B', 4)]
```

**`permutations(iterable, group_size)`**: 반복 가능 객체의 가능한 모든 순열을 생성한다. 모든 요소는 값이 아니라 위치를 기준으로 구별된다. `group_size`가 지정되지 않거나 `None`이면 반복 가능 객체의 길이가 기본값이 된다.

```python
from itertools import permutations

print(list(permutations([1, 'InterviewBit'], 2)))
# 출력: [(1, 'InterviewBit'), ('InterviewBit', 1)]

print(list(permutations('AB')))
# 출력: [('A', 'B'), ('B', 'A')]

print(list(permutations(range(3), 2)))
# 출력: [(0, 1), (0, 2), (1, 0), (1, 2), (2, 0), (2, 1)]
```

**`combinations(iterable, group_size)`**: 지정된 그룹 크기만큼, 중복 없이(without replacement) 가능한 모든 조합을 정렬된 순서로 반환한다.

```python
from itertools import combinations

print(list(combinations(['A', 2], 2)))
# 출력: [('A', 2)]

print(list(combinations('AB', 2)))
# 출력: [('A', 'B')]

print(list(combinations(range(2), 1)))
# 출력: [(0,), (1,)]
```

**`combinations_with_replacement(iterable, n)`**: 반복 가능 객체의 요소들로 길이가 `n`인 부분 수열을 반환한다. `combinations()`와 달리 개별 요소가 중복 선택될 수 있다(with replacement).

```python
from itertools import combinations_with_replacement

print(list(combinations_with_replacement("AB", 2)))
# 출력: [('A', 'A'), ('A', 'B'), ('B', 'B')]

print(list(combinations_with_replacement([1, 2], 2)))
# 출력: [(1, 1), (1, 2), (2, 2)]

print(list(combinations_with_replacement(range(2), 1)))
# 출력: [(0,), (1,)]
```

## 종결 반복자 (Terminating Iterators)

종결 반복자(Terminating Iterators)는 짧은 입력 시퀀스를 처리해, 사용된 메서드의 기능에 따라 출력을 생성하는 반복자다.

**`accumulate(iter, func)`**: 대상 이터러블과 각 값에 적용할 함수를 인자로 받아 누적 결과를 생성한다. 함수를 전달하지 않으면 기본으로 덧셈이 수행되며, 입력 이터러블이 비어 있으면 출력도 비어 있다.

```python
import itertools
import operator

my_arr = [1, 4, 5, 7]

# accumulate() 사용: 요소들의 연속적인 합계를 출력
print(list(itertools.accumulate(my_arr)))
# 출력: [1, 5, 10, 17]
```

**`chain(iter1, iter2, ...)`**: 인자로 전달한 여러 이터러블의 값을 순서대로 이어서 출력한다.

```python
import itertools

arr1 = [1, 4, 5, 7]
arr2 = [1, 6, 5, 9]
arr3 = [8, 10, 5, 4]

# chain()을 사용하여 리스트의 모든 요소 출력
print(list(itertools.chain(arr1, arr2, arr3)))
# 출력: [1, 4, 5, 7, 1, 6, 5, 9, 8, 10, 5, 4]
```

**`tee(iterator, count)`**: 하나의 이터레이터를 인자로 지정한 개수만큼의 독립된 이터레이터로 분할한다.

```python
import itertools

arr = [2, 4, 6, 7, 8, 10, 20]
iti = iter(arr)

# tee()를 사용하여 동일한 값을 가진 3개의 반복자 생성
it = itertools.tee(iti, 3)

for i in range(0, 3):
    print(list(it[i]))
# 출력:
# [2, 4, 6, 7, 8, 10, 20]
# [2, 4, 6, 7, 8, 10, 20]
# [2, 4, 6, 7, 8, 10, 20]
```
