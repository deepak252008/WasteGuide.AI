import datetime
from flask import Blueprint, request, jsonify
from firebase_config import db, FIREBASE_ENABLED
from firebase_admin import firestore

history_bp = Blueprint('history', __name__)

# Global in-memory list for Demo Mode
IN_MEMORY_LOGS = []

def get_user_id():
    user_id = request.headers.get('x-user-id')
    if not user_id:
        user_id = request.args.get('userId') or request.args.get('user_id')
    return user_id

@history_bp.route('/save-history', methods=['POST'])
def save_history():
    data = request.json or {}
    user_id = data.get('userId') or data.get('user_id') or get_user_id()
    scan_result = data.get('result') or data.get('scan')
    
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    if not scan_result:
        return jsonify({"error": "Scan result is required"}), 400

    item = scan_result.get('item', '')
    category = scan_result.get('category', 'General Waste')
    is_recyclable = scan_result.get('is_recyclable', False)
    is_hazardous = scan_result.get('is_hazardous', False)
    is_reusable = scan_result.get('is_reusable', False)
    
    now = datetime.datetime.utcnow()
    timestamp_str = now.isoformat()
    date_str = now.strftime('%Y-%m-%d')
    
    log_doc = {
        "userId": user_id,
        "item": item,
        "category": category,
        "is_recyclable": is_recyclable,
        "is_hazardous": is_hazardous,
        "is_reusable": is_reusable,
        "timestamp": timestamp_str,
        "date": date_str,
        "result": scan_result
    }
    
    if FIREBASE_ENABLED and db is not None:
        try:
            firestore_doc = log_doc.copy()
            firestore_doc["timestamp"] = now
            db.collection("waste_logs").add(firestore_doc)
            return jsonify({"status": "saved", "source": "firestore"})
        except Exception as e:
            log_doc["id"] = f"log_{len(IN_MEMORY_LOGS) + 1}"
            IN_MEMORY_LOGS.append(log_doc)
            return jsonify({"status": "saved", "source": "in-memory-fallback", "error": str(e)})
    else:
        log_doc["id"] = f"log_{len(IN_MEMORY_LOGS) + 1}"
        IN_MEMORY_LOGS.append(log_doc)
        return jsonify({"status": "saved", "source": "in-memory"})

@history_bp.route('/get-history', methods=['GET'])
def get_history():
    user_id = get_user_id()
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
        
    limit_val = int(request.args.get('limit', 50))
    
    if FIREBASE_ENABLED and db is not None:
        try:
            logs_ref = db.collection("waste_logs")
            query = logs_ref.where("userId", "==", user_id).order_by("timestamp", direction=firestore.Query.DESCENDING).limit(limit_val)
            docs = query.stream()
            
            history = []
            for doc in docs:
                data = doc.to_dict()
                if isinstance(data.get("timestamp"), datetime.datetime):
                    data["timestamp"] = data["timestamp"].isoformat()
                history.append(data)
            return jsonify(history)
        except Exception:
            pass
            
    user_logs = [log for log in IN_MEMORY_LOGS if log["userId"] == user_id]
    user_logs.sort(key=lambda x: x["timestamp"], reverse=True)
    return jsonify(user_logs[:limit_val])

@history_bp.route('/dashboard-data', methods=['GET'])
def get_dashboard_data():
    user_id = get_user_id()
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
        
    history_list = []
    
    if FIREBASE_ENABLED and db is not None:
        try:
            logs_ref = db.collection("waste_logs")
            query = logs_ref.where("userId", "==", user_id).order_by("timestamp", direction=firestore.Query.DESCENDING)
            docs = query.stream()
            for doc in docs:
                data = doc.to_dict()
                if isinstance(data.get("timestamp"), datetime.datetime):
                    data["timestamp"] = data["timestamp"].isoformat()
                history_list.append(data)
        except Exception:
            history_list = [log for log in IN_MEMORY_LOGS if log["userId"] == user_id]
    else:
        history_list = [log for log in IN_MEMORY_LOGS if log["userId"] == user_id]
        
    total_scans = len(history_list)
    recyclable_count = sum(1 for log in history_list if log.get("is_recyclable", False))
    hazardous_count = sum(1 for log in history_list if log.get("is_hazardous", False))
    recycle_rate = round((recyclable_count / total_scans * 100), 1) if total_scans > 0 else 0.0
    
    category_counts = {
        "Organic Waste": 0,
        "Plastic Waste": 0,
        "Paper Waste": 0,
        "Glass Waste": 0,
        "Metal Waste": 0,
        "E-waste": 0,
        "Hazardous Waste": 0,
        "General Waste": 0
    }
    for log in history_list:
        cat = log.get("category", "General Waste")
        if cat in category_counts:
            category_counts[cat] += 1
            
    today = datetime.date.today()
    trend_labels = []
    trend_data = []
    
    for i in range(6, -1, -1):
        day = today - datetime.timedelta(days=i)
        trend_labels.append(day.strftime("%b %d"))
        day_str = day.strftime("%Y-%m-%d")
        day_count = sum(1 for log in history_list if log.get("date") == day_str)
        trend_data.append(day_count)
        
    return jsonify({
        "stats": {
            "totalScans": total_scans,
            "recyclableCount": recyclable_count,
            "recycleRate": recycle_rate,
            "hazardousCount": hazardous_count
        },
        "categories": category_counts,
        "trend": {
            "labels": trend_labels,
            "data": trend_data
        }
    })
