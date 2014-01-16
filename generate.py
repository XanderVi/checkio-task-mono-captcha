DIGITS = [
    [
        [0, 1, 1, 0],
        [0, 1, 0, 1],
        [0, 1, 0, 1],
        [0, 1, 0, 1],
        [0, 0, 1, 1]
    ],
    [
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
    ],
    [
        [0, 1, 1, 1],
        [0, 0, 0, 1],
        [0, 0, 1, 1],
        [0, 1, 0, 0],
        [0, 1, 1, 1]
    ],
    [
        [0, 1, 1, 1],
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
        [0, 1, 1, 1]
    ],
    [
        [0, 1, 0, 1],
        [0, 1, 0, 1],
        [0, 1, 1, 1],
        [0, 0, 0, 1],
        [0, 0, 0, 1]
    ],

    [
        [0, 1, 1, 1],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 1],
        [0, 1, 1, 0]
    ],
    [
        [0, 0, 1, 1],
        [0, 1, 0, 0],
        [0, 1, 1, 1],
        [0, 1, 0, 1],
        [0, 0, 1, 1]
    ],
    [
        [0, 1, 1, 1],
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    [
        [0, 1, 1, 1],
        [0, 1, 0, 1],
        [0, 1, 1, 1],
        [0, 1, 0, 1],
        [0, 1, 1, 1]
    ],
    [
        [0, 0, 1, 1],
        [0, 1, 0, 1],
        [0, 1, 1, 1],
        [0, 0, 0, 1],
        [0, 1, 1, 0]
    ],

]

def draw(array):
    for row in array:
        print("".join("X" if x else "-" for x in row))

numbers = [
    123,
    456,
    789,
    1034,
    52678,
    911,
    777,
    21312,
    80808,
    1234567890
]

def generate_number(number, noise=False):
    res = []
    for n in str(number):
        d_zip = zip(*DIGITS[int(n)])
        res.extend(d_zip)
    res.append([0, 0, 0, 0, 0])
    return list(zip(*res))

for numb in numbers:
    #draw(generate_number(numb))
    #print()
    print('{{"input": {0},\n"answer": {1}}},\n'.format(generate_number(numb), numb))

draw(generate_number(1234567890))

for d in DIGITS:
    print(list(list(z) for z in zip(*d)))