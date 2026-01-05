from flask import Flask, jsonify, request
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
# DATABASE
# ------------------------
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/leanbulkdb")
client = MongoClient(mongo_uri)
db = client.leanbulkdb

# ------------------------
# CORS CONFIG (STRICT + SAFE)
# ------------------------
FRONTEND_URL = "https://lean-bulk-app-tracker.vercel.app"

def cors_response(data=None, status=200):
    response = jsonify(data) if data is not None else jsonify({})
    response.status_code = status
    response.headers["Access-Control-Allow-Origin"] = FRONTEND_URL
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, DELETE"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@app.after_request
def apply_cors(response):
    response.headers["Access-Control-Allow-Origin"] = FRONTEND_URL
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, DELETE"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

# ------------------------
# ERROR HANDLER
# ------------------------
@app.errorhandler(Exception)
def handle_error(e):
    return cors_response({"error": str(e)}, 500)

# ------------------------
# ROUTES
# ------------------------

@app.route("/", methods=["GET"])
def home():
    return "Backend is Live"

# ---------- PLAN ----------
@app.route("/api/plan", methods=["GET", "OPTIONS"])
def get_plan():
    if request.method == "OPTIONS":
        return cors_response()

    plan = db.profile.find_one({}, {"_id": 0})
    if not plan:
        return cors_response({"message": "No plan found"}, 404)
    return cors_response(plan)

# ---------- FOODS ----------
@app.route("/api/foods", methods=["GET", "POST", "OPTIONS"])
def foods():
    if request.method == "OPTIONS":
        return cors_response()

    if request.method == "GET":
        foods = []
        for f in db.foods.find():
            f["_id"] = str(f["_id"])
            foods.append(f)
        return cors_response(foods)

    if request.method == "POST":
        data = request.json
        if not data or "name" not in data:
            return cors_response({"error": "Invalid data"}, 400)

        if db.foods.find_one({"name": data["name"]}):
            return cors_response({"error": "Food already exists"}, 400)

        db.foods.insert_one(data)
        return cors_response({"message": "Food added"}, 201)

@app.route("/api/foods/delete", methods=["POST", "OPTIONS"])
def delete_food():
    if request.method == "OPTIONS":
        return cors_response()

    food_id = request.json.get("id")
    try:
        db.foods.delete_one({"_id": ObjectId(food_id)})
        return cors_response({"message": "Food deleted"})
    except:
        return cors_response({"error": "Invalid ID"}, 400)

# ---------- DAILY LOG ----------
@app.route("/api/log", methods=["GET", "POST", "OPTIONS"])
def daily_log():
    if request.method == "OPTIONS":
        return cors_response()

    today = datetime.now().strftime("%Y-%m-%d")

    if request.method == "GET":
        log = db.daily_logs.find_one({"date": today}, {"_id": 0})
        if not log:
            return cors_response({
                "date": today,
                "items": [],
                "total_calories": 0,
                "total_protein": 0
            })
        return cors_response(log)

    if request.method == "POST":
        item = request.json.get("item")
        if not item:
            return cors_response({"error": "Invalid item"}, 400)

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

        return cors_response({"message": "Logged successfully"})

@app.route("/api/log/delete", methods=["POST", "OPTIONS"])
def delete_log():
    if request.method == "OPTIONS":
        return cors_response()

    today = datetime.now().strftime("%Y-%m-%d")
    index = request.json.get("index")

    log = db.daily_logs.find_one({"date": today})
    if not log or index is None or index >= len(log["items"]):
        return cors_response({"error": "Item not found"}, 400)

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

    return cors_response({"message": "Item deleted"})

# ------------------------
# ENTRY POINT (LOCAL ONLY)
# ------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
