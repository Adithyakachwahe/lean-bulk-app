from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from datetime import datetime
from seed_data import initial_plan, initial_foods

load_dotenv()

app = Flask(__name__)

# Basic CORS as backup
CORS(app)

mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/leanbulkdb')
client = MongoClient(mongo_uri)
db = client.leanbulkdb

# --- HELPER: Manually Add Headers ---
def build_cors_response(data, code=200):
    response = jsonify(data)
    response.status_code = code
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, DELETE'
    return response

# --- ERROR HANDLER: Catch Crashes & Add Headers ---
# This is crucial. If DB fails, this lets the error pass through to frontend.
@app.errorhandler(Exception)
def handle_exception(e):
    return build_cors_response({"error": str(e), "type": "Internal Server Error"}, 500)

# --- ROUTES ---

@app.route('/', methods=['GET'])
def home():
    return "Backend is Live"

@app.route('/api/seed', methods=['POST', 'OPTIONS'])
def seed_database():
    if request.method == 'OPTIONS': return build_cors_response({})
    
    db.profile.delete_many({})
    db.foods.delete_many({})
    db.profile.insert_one(initial_plan)
    db.foods.insert_many(initial_foods)
    return build_cors_response({"message": "Database seeded!"})

@app.route('/api/plan', methods=['GET', 'OPTIONS'])
def get_plan():
    if request.method == 'OPTIONS': return build_cors_response({})

    try:
        plan = db.profile.find_one({}, {'_id': 0})
        if not plan:
            # Auto-seed attempt
            db.profile.insert_one(initial_plan)
            db.foods.insert_many(initial_foods)
            plan = db.profile.find_one({}, {'_id': 0})
        return build_cors_response(plan)
    except Exception as e:
        return build_cors_response({"error": "Database Error", "details": str(e)}, 500)

@app.route('/api/plan/add_exercise', methods=['POST', 'OPTIONS'])
def add_exercise():
    if request.method == 'OPTIONS': return build_cors_response({})
    
    data = request.json
    day = data.get('day')
    exercise = data.get('exercise')
    db.profile.update_one(
        {"workouts.day": day},
        {"$push": {"workouts.$.exercises": exercise}}
    )
    return build_cors_response({"message": "Exercise added"})

@app.route('/api/plan/delete_exercise', methods=['POST', 'OPTIONS'])
def delete_exercise():
    if request.method == 'OPTIONS': return build_cors_response({})

    data = request.json
    day = data.get('day')
    ex_name = data.get('exerciseName')
    db.profile.update_one(
        {"workouts.day": day},
        {"$pull": {"workouts.$.exercises": {"name": ex_name}}}
    )
    return build_cors_response({"message": "Exercise deleted"})

@app.route('/api/foods', methods=['GET', 'POST', 'OPTIONS'])
def manage_foods():
    if request.method == 'OPTIONS': return build_cors_response({})

    if request.method == 'GET':
        foods = []
        for f in db.foods.find({}):
            f['_id'] = str(f['_id'])
            foods.append(f)
        return build_cors_response(foods)
    
    if request.method == 'POST':
        new_food = request.json
        if db.foods.find_one({"name": new_food['name']}):
            return build_cors_response({"error": "Food already exists"}, 400)
        db.foods.insert_one(new_food)
        return build_cors_response({"message": "Food added"})

@app.route('/api/foods/delete', methods=['POST', 'OPTIONS'])
def delete_food():
    if request.method == 'OPTIONS': return build_cors_response({})
    
    food_id = request.json.get('id')
    try:
        db.foods.delete_one({"_id": ObjectId(food_id)})
        return build_cors_response({"message": "Food deleted"})
    except:
        return build_cors_response({"error": "Invalid ID"}, 400)

@app.route('/api/log', methods=['GET', 'POST', 'OPTIONS'])
def daily_log():
    if request.method == 'OPTIONS': return build_cors_response({})
    
    today = datetime.now().strftime('%Y-%m-%d')
    if request.method == 'GET':
        log = db.daily_logs.find_one({"date": today}, {'_id': 0})
        if not log:
            return build_cors_response({"date": today, "items": [], "total_calories": 0, "total_protein": 0})
        return build_cors_response(log)

    if request.method == 'POST':
        data = request.json
        item = data.get('item')
        cals = int(item.get('calories', 0))
        prot = float(item.get('protein', 0))
        db.daily_logs.update_one(
            {"date": today},
            {
                "$push": {"items": item},
                "$inc": {"total_calories": cals, "total_protein": prot}
            },
            upsert=True
        )
        return build_cors_response({"message": "Logged successfully"})

@app.route('/api/log/delete', methods=['POST', 'OPTIONS'])
def delete_log_item():
    if request.method == 'OPTIONS': return build_cors_response({})

    today = datetime.now().strftime('%Y-%m-%d')
    index = request.json.get('index')
    log = db.daily_logs.find_one({"date": today})
    if log and 0 <= index < len(log['items']):
        item = log['items'][index]
        new_items = log['items']
        del new_items[index]
        db.daily_logs.update_one(
            {"date": today},
            {
                "$set": {"items": new_items},
                "$inc": {
                    "total_calories": -int(item.get('calories', 0)),
                    "total_protein": -float(item.get('protein', 0))
                }
            }
        )
        return build_cors_response({"message": "Item deleted"})
    return build_cors_response({"error": "Item not found"}, 400)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)