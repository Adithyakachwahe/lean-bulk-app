from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv
import os

# ------------------------
# ENV + APP SETUP
# ------------------------
load_dotenv()
app = Flask(__name__)

# ------------------------
# ✅ CORS (THIS IS THE KEY FIX)
# ------------------------
CORS(
    app,
    resources={r"/api/*": {"origins": "https://lean-bulk-app-tracker.vercel.app"}},
    supports_credentials=True
)

# ------------------------
# DATABASE
# ------------------------
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/leanbulkdb")
client = MongoClient(mongo_uri)
db = client.leanbulkdb

# ------------------------
# ROUTES
# ------------------------

@app.route("/", methods=["GET"])
def home():
    return "Backend is Live"

# ---------- PLAN ----------
@app.route("/api/plan", methods=["GET"])
def get_plan():
    plan = db.profile.find_one({}, {"_id": 0})
    if not plan:
        return jsonify({"message": "No plan found"}), 404
    return jsonify(plan)

# ---------- FOODS ----------
@app.route("/api/foods", methods=["GET", "POST"])
def foods():
    if request.method == "GET":
        foods = []
        for f in db.foods.find():
            f["_id"] = str(f["_id"])
            foods.append(f)
        return jsonify(foods)

    if request.method == "POST":
        data = request.json
        if not data or "name" not in data:
            return jsonify({"error": "Invalid data"}), 400

        if db.foods.find_one({"name": data["name"]}):
            return jsonify({"error": "Food already exists"}), 400

        db.foods.insert_one(data)
        return jsonify({"message": "Food added"}), 201

@app.route("/api/foods/delete", methods=["POST"])
def delete_food():
    food_id = request.json.get("id")
    try:
        db.foods.delete_one({"_id": ObjectId(food_id)})
        return jsonify({"message": "Food deleted"})
    except:
        return jsonify({"error": "Invalid ID"}), 400

# ---------- DAILY LOG ----------
@app.route("/api/log", methods=["GET", "POST"])
def daily_log():
    today = datetime.now().strftime("%Y-%m-%d")

    if request.method == "GET":
        log = db.daily_logs.find_one({"date": today}, {"_id": 0})
        if not log:
            return jsonify({
                "date": today,
                "items": [],
                "total_calories": 0,
                "total_protein": 0
            })
        return jsonify(log)

    if request.method == "POST":
        item = request.json.get("item")
        if not item:
            return jsonify({"error": "Invalid item"}), 400

        calories = int(item.get("calories", 0))
        protein = float(item.get("protein", 0))

        db.daily_logs.update_one(
            {"date": today},
            {
                "$push": {"items": item},
                "$inc": {
                    "total_calories": calories,
                    "total_protein": protein
                }
            },
            upsert=True
        )

        return jsonify({"message": "Logged successfully"})

@app.route("/api/log/delete", methods=["POST"])
def delete_log():
    today = datetime.now().strftime("%Y-%m-%d")
    index = request.json.get("index")

    log = db.daily_logs.find_one({"date": today})
    if not log or index is None or index >= len(log["items"]):
        return jsonify({"error": "Item not found"}), 400

    item = log["items"][index]
    log["items"].pop(index)

    db.daily_logs.update_one(
        {"date": today},
        {
            "$set": {"items": log["items"]},
            "$inc": {
                "total_calories": -int(item.get("calories", 0)),
                "total_protein": -float(item.get("protein", 0))
            }
        }
    )

    return jsonify({"message": "Item deleted"})

# ------------------------
# ENTRY POINT (LOCAL ONLY)
# ------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

# updated again
