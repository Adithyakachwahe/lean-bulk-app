from flask import Flask, request , jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask_bcrypt import Bcrypt

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

def db_init():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['Flask']
    users = db['users']
    return users


@app.route('/register',methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    print(email , password)

    if not email or not password:
        return jsonify({'error':'Enter valid email/password'})
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    try:
        users = db_init()
        user = users.find_one({'email':email})
        if user:
            return jsonify({'error':'User already exists!'})
        users.insert_one({'email':email, 'password':hashed_password})
        return jsonify({'success':'User Added'})
    except:
        return jsonify({'error':'database error'})
    

@app.route('/login',methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    print(email , password)

    if not email or not password:
        return jsonify({'error':'Enter valid email/password'})

    try:
        users = db_init()
        user = users.find_one({'email':email})
        if user:
            if(bcrypt.check_password_hash(user['password'], password)):
                return jsonify({'success':'Successfully Logged in!'})
            else:
                return jsonify({'error':'Invalid Password!'})
        else:
            return jsonify({'error':'User Does no exists!'})
    except:
        return jsonify({'error':'database error'})



    

if __name__ == '__main__':
    app.run(debug=True)