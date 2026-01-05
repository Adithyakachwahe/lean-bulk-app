from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from datetime import datetime
from seed_data import initial_plan, initial_foods

load_dotenv()

app = Flask(__name__)

# 1. Basic CORS setup
CORS(app, resources={r"/*": {"origins": "*"}})

# 2. "Nuclear" Manual Header Injection
# This ensures CORS headers are sent even if there is an error
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/leanbulkdb')
client = MongoClient(mongo_uri)
db = client.leanbulkdb

# --- ROUTES ---

@app.route('/', methods=['GET'])
def home():
    return "Backend is Live!"

@app.route('/api/seed', methods=['POST'])
def seed_database():
    db.profile.delete_many({})
    db.foods.delete_many({})
    db.profile.insert_one(initial_plan)
    db.foods.insert_many(initial_foods)
    return jsonify({"message": "Database seeded!"})

@app.route('/api/plan', methods=['GET'])
def get_plan():
    plan = db.profile.find_one({}, {'_id': 0})
    if not plan:
        # Auto-seed if empty
        db.profile.insert_one(initial_plan)
        db.foods.insert_many(initial_foods)
        plan = db.profile.find_one({}, {'_id': 0})
    return jsonify(plan)

@app.route('/api/plan/add_exercise', methods=['POST'])
def add_exercise():
    data = request.json
    day = data.get('day')
    exercise = data.get('exercise')
    db.profile.update_one(
        {"workouts.day": day},
        {"$push": {"workouts.$.exercises": exercise}}
    )
    return jsonify({"message": "Exercise added"})

@app.route('/api/plan/delete_exercise', methods=['POST'])
def delete_exercise():
    data = request.json
    day = data.get('day')
    ex_name = data.get('exerciseName')
    db.profile.update_one(
        {"workouts.day": day},
        {"$pull": {"workouts.$.exercises": {"name": ex_name}}}
    )
    return jsonify({"message": "Exercise deleted"})

@app.route('/api/foods', methods=['GET', 'POST'])
def manage_foods():
    if request.method == 'GET':
        foods = []
        for f in db.foods.find({}):
            f['_id'] = str(f['_id'])
            foods.append(f)
        return jsonify(foods)
    
    if request.method == 'POST':
        new_food = request.json
        if db.foods.find_one({"name": new_food['name']}):
            return jsonify({"error": "Food already exists"}), 400
        db.foods.insert_one(new_food)
        return jsonify({"message": "Food added"})

@app.route('/api/foods/delete', methods=['POST'])
def delete_food():
    food_id = request.json.get('id')
    try:
        db.foods.delete_one({"_id": ObjectId(food_id)})
        return jsonify({"message": "Food deleted"})
    except:
        return jsonify({"error": "Invalid ID"}), 400

@app.route('/api/log', methods=['GET', 'POST'])
def daily_log():
    today = datetime.now().strftime('%Y-%m-%d')
    if request.method == 'GET':
        log = db.daily_logs.find_one({"date": today}, {'_id': 0})
        if not log:
            return jsonify({"date": today, "items": [], "total_calories": 0, "total_protein": 0})
        return jsonify(log)

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
        return jsonify({"message": "Logged successfully"})

@app.route('/api/log/delete', methods=['POST'])
def delete_log_item():
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
        return jsonify({"message": "Item deleted"})
    return jsonify({"error": "Item not found"}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)