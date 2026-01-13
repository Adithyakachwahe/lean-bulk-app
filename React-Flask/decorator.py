# decorators - is a function that modifies another functions behaviour without chaning its code

def my_dec(func):
    def wrapper():
        print('before')
        func()
        print('after')
    return wrapper

@my_dec
def myfun():
    print('in between')

myfun()

# in flask decorators are mainly used in authorization , authentication and logging

# @app.route('/api/data')
# @login_required
# def get_data():
#   return jsonify(data)


