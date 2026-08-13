---
created: 2026-08-12
tags: [python, 표준라이브러리, 자료구조]
publish: true
---

[[Python/표준 라이브러리/표준 라이브러리.md|표준 라이브러리]]에 속하는 모듈인 **Collections**는 튜플, 리스트, 딕셔너리 같은 기본 [[Python/자료형/컬렉션/컬렉션.md|컬렉션]]을 보완하는 다양한 컨테이너 타입을 제공한다.

## Counter

`Counter`는 요소를 딕셔너리의 키로, 그 요소의 개수를 값으로 저장하는 컨테이너다.

```python
from collections import Counter

my_list = [1, 1, 2, 3, 4, 5, 3, 2, 3, 4, 2, 1, 2, 3]

print(Counter(my_list))
# 출력: Counter({2: 4, 3: 4, 1: 3, 4: 2, 5: 1})

print(Counter(my_list).items())
# 출력: [(1, 3), (2, 4), (3, 4), (4, 2), (5, 1)]

print(Counter(my_list).keys())
# 출력: [1, 2, 3, 4, 5]

print(Counter(my_list).values())
# 출력: [3, 4, 4, 2, 1]
```

## defaultdict

일반 [[Python/자료형/컬렉션/딕셔너리.md|딕셔너리]]는 존재하지 않는 키에 접근하면 예외가 발생하므로, 키가 있는지 먼저 확인하고 없으면 원하는 값으로 설정해줘야 한다. `defaultdict`는 아직 설정되지 않은 키에 접근할 때 `default_factory`로 지정한 타입의 기본값을 자동으로 채워준다는 점이 다르다.

```python
from collections import defaultdict

# int를 default_factory로 전달하면 기본값이 0인 defaultdict가 생성된다.
d = defaultdict(int)

my_list = [1, 2, 3, 2, 4, 2, 4, 1, 2]

# 개수를 세기 위해 리스트 순회
for i in my_list:
    # 기본값이 0이므로 키를 먼저 생성할 필요가 없다.
    d[i] += 1

print(d)
# 출력: defaultdict(<class 'int'>, {1: 2, 2: 3, 3: 1, 4: 2})
```

## OrderedDict

`OrderedDict`는 키가 처음 삽입된 순서를 기억하는 딕셔너리다. 새 항목이 기존 항목의 값을 덮어써도 기존의 삽입 위치는 그대로 유지된다.

```python
from collections import OrderedDict

# 일반 딕셔너리
d = {}
d['b'] = 1
d['a'] = 2
d['c'] = 3
d['d'] = 4

for key, value in d.items():
    print(key, value)
# 무작위 순서로 출력될 수 있다.

# OrderedDict
od = OrderedDict()
od['b'] = 1
od['a'] = 2
od['c'] = 3
od['d'] = 4

for key, value in od.items():
    print(key, value)
# 키가 삽입된 순서대로 유지된다.
```

## ChainMap

`ChainMap`은 여러 딕셔너리를 하나의 단위로 묶어서 다룰 수 있게 해주는 컨테이너다.

```python
from collections import ChainMap

d1 = {'a': 1, 'b': 2}
d2 = {'c': 3, 'd': 4}
d3 = {'e': 5, 'f': 6}

c = ChainMap(d1, d2, d3)

print(c)
# 출력: ChainMap({'a': 1, 'b': 2}, {'c': 3, 'd': 4}, {'e': 5, 'f': 6})

# 키 이름을 사용하여 값에 접근
print(c['a'])
# 출력: 1

# values() 메서드를 사용하여 값들에 접근
print(c.values())
# 출력: ValuesView(ChainMap({'a': 1, 'b': 2}, {'c': 3, 'd': 4}, {'e': 5, 'f': 6}))

# keys() 메서드를 사용하여 키들에 접근
print(c.keys())
# 출력: KeysView(ChainMap({'a': 1, 'b': 2}, {'c': 3, 'd': 4}, {'e': 5, 'f': 6}))
```

## namedtuple

`namedtuple`은 만들기 쉬운 경량 객체 타입으로, [[Python/자료형/컬렉션/튜플.md|튜플]]을 정수 인덱스 대신 이름으로 멤버에 접근할 수 있는 컨테이너로 바꿔준다.

```python
from collections import namedtuple

Point = namedtuple('Point', 'x,y')
pt1 = Point(1, 2)
pt2 = Point(3, 4)

dot_product = (pt1.x * pt2.x) + (pt1.y * pt2.y)
print(dot_product)
# 출력: 11
```

## deque

`deque`(Doubly Ended Queue)는 컨테이너의 양쪽 끝에서 `append`, `pop` 연산을 빠르게 수행할 수 있도록 최적화된 자료구조다. [[Python/자료형/컬렉션/리스트.md|리스트]]는 오른쪽 끝에서의 추가·제거는 $O(1)$이지만 왼쪽 끝에서는 요소를 모두 옮겨야 해 $O(n)$이 걸리는 반면, `deque`는 양쪽 끝 모두에서 $O(1)$의 시간 복잡도를 제공한다. (출처: [Python 공식 문서 - collections.deque](https://docs.python.org/3/library/collections.html#collections.deque))

```python
from collections import deque

d = deque()
d.append(1)
print(d)
# 출력: deque([1])

d.appendleft(2)
print(d)
# 출력: deque([2, 1])

d.clear()  # deque 비우기

d.extend('1')
print(d)
# 출력: deque(['1'])

d.extendleft('234')
print(d)
# 출력: deque(['4', '3', '2', '1'])

print(d.count('1'))
# 출력: 1

print(d.pop())
# 출력: '1'

print(d)
# 출력: deque(['4', '3', '2'])

print(d.popleft())
# 출력: '4'

print(d)
# 출력: deque(['3', '2'])

d.extend('7896')
print(d)
# 출력: deque(['3', '2', '7', '8', '9', '6'])

d.remove('2')
print(d)
# 출력: deque(['3', '7', '8', '9', '6'])

d.reverse()
print(d)
# 출력: deque(['6', '9', '8', '7', '3'])

d.rotate(3)
print(d)
# 출력: deque(['8', '7', '3', '6', '9'])
```
