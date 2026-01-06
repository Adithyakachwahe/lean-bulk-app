from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv
import os

# Import your specific seed data
from seed_data import initial_plan, initial_foods

load_dotenv()
app = Flask(__name__)

# Allow CORS for your frontend
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Database Setup
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/leanbulkdb")
client = MongoClient(mongo_uri)
db = client.leanbulkdb

# =================================================================
# ⚠️ DEV MODE: DROP EVERYTHING ON STARTUP
# COMMENT OUT THE LINES BELOW WHEN YOU WANT TO KEEP DATA PERSISTENT
# =================================================================
# print("🔥 SYSTEM STARTUP: Dropping all collections for a clean slate...")
# db.profile.drop()
# db.foods.drop()
# db.daily_logs.drop()
# print("✅ DATABASE WIPED. It will re-seed on first request.")
# =================================================================


@app.route("/", methods=["GET"])
def home():
    return "Backend is Live"

# ------------------------
# MANUAL SEED TRIGGER
# ------------------------
@app.route("/api/seed", methods=["POST"])
def seed_database():
    """Manually resets DB to seed_data.py"""
    db.profile.drop()
    db.foods.drop()
    # db.daily_logs.drop() # Optional: decide if you want to wipe logs too
    
    db.profile.insert_one(initial_plan)
    db.foods.insert_many(initial_foods)
    
    return jsonify({"message": "Database seeded with custom plan and foods"})

# ------------------------
# PLAN ROUTES
# ------------------------
@app.route("/api/plan", methods=["GET"])
def get_plan():
    plan = db.profile.find_one({}, {"_id": 0})
    
    # Auto-seed if database is empty (which it will be on restart now)
    if not plan:
        print("🌱 Seeding Plan Data...")
        db.profile.insert_one(initial_plan)
        plan = db.profile.find_one({}, {"_id": 0})
        
    return jsonify(plan)

@app.route("/api/plan/add_exercise", methods=["POST"])
def add_exercise():
    data = request.json
    db.profile.update_one(
        {"workouts.day": data["day"]},
        {"$push": {"workouts.$.exercises": data["exercise"]}}
    )
    return jsonify({"message": "Added"})

@app.route("/api/plan/delete_exercise", methods=["POST"])
def delete_exercise():
    data = request.json
    db.profile.update_one(
        {"workouts.day": data["day"]},
        {"$pull": {"workouts.$.exercises": {"name": data["exerciseName"]}}}
    )
    return jsonify({"message": "Deleted"})

# ------------------------
# FOOD DATABASE
# ------------------------
@app.route("/api/foods", methods=["GET", "POST"])
def foods():
    if request.method == "GET":
        # Auto-seed foods if empty
        if db.foods.count_documents({}) == 0:
            print("🌱 Seeding Food Data...")
            db.foods.insert_many(initial_foods)

        foods = []
        for f in db.foods.find():
            f["_id"] = str(f["_id"])
            foods.append(f)
        return jsonify(foods)
    
    if request.method == "POST":
        data = request.json
        if db.foods.find_one({"name": data["name"]}):
            return jsonify({"error": "Exists"}), 400
        db.foods.insert_one(data)
        return jsonify({"message": "Created"}), 201

@app.route("/api/foods/delete", methods=["POST"])
def delete_food():
    db.foods.delete_one({"_id": ObjectId(request.json.get("id"))})
    return jsonify({"message": "Deleted"})

# ------------------------
# DAILY LOG
# ------------------------
@app.route("/api/log", methods=["GET"])
def get_daily_log():
    today = datetime.now().strftime("%Y-%m-%d")
    log = db.daily_logs.find_one({"date": today}, {"_id": 0})
    
    if not log:
        return jsonify({
            "date": today, 
            "items": [], 
            "completed_exercises": [], 
            "total_calories": 0, 
            "total_protein": 0
        })
    
    if "completed_exercises" not in log:
        log["completed_exercises"] = []
        
    return jsonify(log)

@app.route("/api/log/food", methods=["POST"])
def log_food():
    today = datetime.now().strftime("%Y-%m-%d")
    item = request.json.get("item")
    
    db.daily_logs.update_one(
        {"date": today},
        {
            "$push": {"items": item},
            "$inc": {
                "total_calories": int(item.get("calories", 0)),
                "total_protein": float(item.get("protein", 0))
            }
        },
        upsert=True
    )
    return jsonify({"message": "Food Logged"})

@app.route("/api/log/food/delete", methods=["POST"])
def delete_log_food():
    today = datetime.now().strftime("%Y-%m-%d")
    index = request.json.get("index")
    
    log = db.daily_logs.find_one({"date": today})
    if not log or index >= len(log["items"]): 
        return jsonify({"error": "Invalid"}), 400
        
    item = log["items"][index]
    
    new_items = log["items"]
    new_items.pop(index)
    
    db.daily_logs.update_one(
        {"date": today},
        {
            "$set": {"items": new_items},
            "$inc": {
                "total_calories": -int(item.get("calories", 0)),
                "total_protein": -float(item.get("protein", 0))
            }
        }
    )
    return jsonify({"message": "Food Deleted"})

@app.route("/api/log/exercise", methods=["POST"])
def toggle_exercise():
    today = datetime.now().strftime("%Y-%m-%d")
    data = request.json
    ex_name = data.get("exerciseName")
    day_label = data.get("dayLabel") 
    
    log = db.daily_logs.find_one({"date": today})
    
    exists = False
    if log and "completed_exercises" in log:
        for ex in log["completed_exercises"]:
            if ex["name"] == ex_name:
                exists = True
                break
                
    if exists:
        db.daily_logs.update_one(
            {"date": today},
            {"$pull": {"completed_exercises": {"name": ex_name}}}
        )
        return jsonify({"status": "removed"})
    else:
        db.daily_logs.update_one(
            {"date": today},
            {
                "$addToSet": {
                    "completed_exercises": {
                        "name": ex_name,
                        "day": day_label,
                        "timestamp": datetime.now().isoformat()
                    }
                }
            },
            upsert=True
        )
        return jsonify({"status": "added"})

# ------------------------
# HISTORY
# ------------------------
@app.route("/api/history", methods=["GET"])
def get_history():
    # Return last 30 days
    logs = list(db.daily_logs.find({}, {"_id": 0}).sort("date", -1).limit(30))
    return jsonify(logs)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)