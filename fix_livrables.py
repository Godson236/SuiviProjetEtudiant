code = open('frontend/src/pages/Livrables.js', 'r', encoding='utf-8').read()
lines = code.split('\n')
for i, line in enumerate(lines[168:180], start=169):
    print(i, repr(line))