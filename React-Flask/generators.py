# generators are the function which produces a value one at a time 
def get_number(n):
    for i in range(1, n+1):
        yield i
    

gen = get_number(5)


print(next(gen))
print(next(gen))
print(next(gen))


# to save memory
# to read large files
# for paginations