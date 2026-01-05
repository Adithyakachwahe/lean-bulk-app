from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId  # Required for deleting by ID
import os
from dotenv import load_dotenv
from datetime import datetime
from seed_data import initial_plan, initial_foods

load_dotenv()

app = Flask(__name__)
# Allow specific origins or * for all
CORS(app, resources={r"/*": {"origins": "*"}})

mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/leanbulkdb')
client = MongoClient(mongo_uri)
db = client.leanbulkdb

# --- SEED ---
@app.route('/api/seed', methods=['POST'])
def seed_database():
    db.profile.delete_many({})
    db.foods.delete_many({})
    db.profile.insert_one(initial_plan)
    db.foods.insert_many(initial_foods)
    return jsonify({"message": "Database seeded!"})

# --- WORKOUTS ---
@app.route('/api/plan', methods=['GET'])
def get_plan():
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
    
    # Mongo $pull removes item from array matching the condition
    db.profile.update_one(
        {"workouts.day": day},
        {"$pull": {"workouts.$.exercises": {"name": ex_name}}}
    )
    return jsonify({"message": "Exercise deleted"})

# --- FOOD LIBRARY ---
@app.route('/api/foods', methods=['GET', 'POST'])
def manage_foods():
    if request.method == 'GET':
        # Convert ObjectId to string for frontend
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

# --- DAILY TRACKER ---
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
    # HOST='0.0.0.0' allows access from other devices (Phone) on same WiFi
    app.run(debug=True, host='0.0.0.0', port=5000)