from flask import Blueprint, request, jsonify

centers_bp = Blueprint('centers', __name__)

CENTERS = [
    {
        "id": "center-1",
        "name": "GHMC Dry Waste Collection Center",
        "address": "Jubilee Hills Road No 36, Hyderabad, Telangana 500033",
        "latitude": 17.4338,
        "longitude": 78.4069,
        "accepted_waste": ["Plastic Waste", "Paper Waste", "Glass Waste", "Metal Waste"],
        "phone": "+91 40 2111 1111",
        "hours": "09:00 AM - 06:00 PM (Mon-Sat)",
        "distance_km": 2.3,
        "facility_type": "recycling",
        "color_code": "#10B981" # Emerald Green
    },
    {
        "id": "center-2",
        "name": "E-Parisaraa Recycling Center",
        "address": "Kukatpally Industrial Area, Hyderabad, Telangana 500072",
        "latitude": 17.4834,
        "longitude": 78.4084,
        "accepted_waste": ["E-waste", "Metal Waste", "Battery"],
        "phone": "+91 40 2333 4444",
        "hours": "10:00 AM - 05:00 PM (Mon-Fri)",
        "distance_km": 5.7,
        "facility_type": "ewaste",
        "color_code": "#8B5CF6" # Purple
    },
    {
        "id": "center-3",
        "name": "Swachha Organic Composting Yard",
        "address": "Gachibowli Stadium Road, Hyderabad, Telangana 500032",
        "latitude": 17.4437,
        "longitude": 78.3488,
        "accepted_waste": ["Organic Waste"],
        "phone": "+91 40 2555 6666",
        "hours": "08:00 AM - 04:00 PM (Mon-Sat)",
        "distance_km": 4.1,
        "facility_type": "organic",
        "color_code": "#F59E0B" # Amber/Orange
    },
    {
        "id": "center-4",
        "name": "Ramky Hazardous Waste Management Facility",
        "address": "Patancheru Industrial Area, Hyderabad, Telangana 502319",
        "latitude": 17.5256,
        "longitude": 78.2689,
        "accepted_waste": ["Hazardous Waste", "Battery", "Medicine Bottle", "Paint Can"],
        "phone": "+91 8455 244444",
        "hours": "09:00 AM - 05:00 PM (Mon-Sat)",
        "distance_km": 15.4,
        "facility_type": "hazardous",
        "color_code": "#EF4444" # Red
    },
    {
        "id": "center-5",
        "name": "Secunderabad Sorting Station",
        "address": "Secunderabad Cantonment, Hyderabad, Telangana 500003",
        "latitude": 17.4475,
        "longitude": 78.4983,
        "accepted_waste": ["General Waste", "Plastic Waste", "Paper Waste", "Metal Waste"],
        "phone": "+91 40 2777 8888",
        "hours": "09:00 AM - 06:00 PM (Mon-Sat)",
        "distance_km": 9.8,
        "facility_type": "recycling",
        "color_code": "#10B981"
    },
    {
        "id": "center-6",
        "name": "Hyderabad E-Waste Solutions",
        "address": "Begumpet Main Road, Hyderabad, Telangana 500016",
        "latitude": 17.4411,
        "longitude": 78.4735,
        "accepted_waste": ["E-waste", "Battery"],
        "phone": "+91 40 2888 9999",
        "hours": "10:00 AM - 06:00 PM (Mon-Sat)",
        "distance_km": 7.2,
        "facility_type": "ewaste",
        "color_code": "#8B5CF6"
    },
    {
        "id": "center-7",
        "name": "Amberpet Composting Center",
        "address": "Amberpet Compost Plant, Hyderabad, Telangana 500013",
        "latitude": 17.3872,
        "longitude": 78.5204,
        "accepted_waste": ["Organic Waste"],
        "phone": "+91 40 2999 0000",
        "hours": "08:00 AM - 05:00 PM (Mon-Sun)",
        "distance_km": 12.1,
        "facility_type": "organic",
        "color_code": "#F59E0B"
    }
]

@centers_bp.route('/get-centers', methods=['GET'])
def get_centers():
    waste_type = request.args.get('waste_type')
    
    filtered = []
    if waste_type:
        w_type_lower = waste_type.lower()
        for center in CENTERS:
            if center["facility_type"].lower() == w_type_lower:
                filtered.append(center)
                continue
            if any(w_type_lower in wt.lower() for wt in center["accepted_waste"]):
                filtered.append(center)
                continue
                
    if not filtered:
        filtered = CENTERS.copy()
        
    filtered.sort(key=lambda x: x["distance_km"])
    return jsonify(filtered)
