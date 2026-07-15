import os
import json
import logging
from flask import Blueprint, request, jsonify
from groq import Groq

logger = logging.getLogger(__name__)
waste_bp = Blueprint('waste', __name__)

CATEGORIES = [
    "Organic Waste",
    "Plastic Waste",
    "Paper Waste",
    "Glass Waste",
    "Metal Waste",
    "E-waste",
    "Hazardous Waste",
    "General Waste"
]

MOCK_DATABASE = {
    "plastic bottle": {
        "item": "Plastic Bottle",
        "category": "Plastic Waste",
        "category_icon": "🥤",
        "is_recyclable": True,
        "is_hazardous": False,
        "is_reusable": True,
        "disposal_instructions": "Rinse the bottle to remove any leftover liquid. Flatten it to save space in the recycling bin, and screw the cap back on or recycle it separately depending on local guidelines.",
        "recycling_steps": [
            "Empty and rinse the bottle with water.",
            "Crush or flatten the bottle to reduce volume.",
            "Keep the cap on (standard in modern recycling).",
            "Place it in the designated dry recyclables bin."
        ],
        "hazard_warning": None,
        "eco_suggestions": [
            "Switch to a reusable stainless steel or glass water bottle.",
            "Repurpose the bottle for creative home gardening or crafts.",
            "Buy beverages in bulk or larger containers to reduce packaging waste."
        ],
        "accepted_at": ["Recycling Center", "Plastic Collection Point", "Material Recovery Facility"]
    },
    "battery": {
        "item": "Battery",
        "category": "Hazardous Waste",
        "category_icon": "🔋",
        "is_recyclable": True,
        "is_hazardous": True,
        "is_reusable": False,
        "disposal_instructions": "Batteries contain toxic chemicals and must never be thrown in the general trash. Tape the terminals to prevent short circuits and take them to a dedicated drop-off center.",
        "recycling_steps": [
            "Remove the battery carefully from the device.",
            "Place clear adhesive tape over the positive and negative terminals.",
            "Store in a dry, cool container away from heat.",
            "Drop off at a certified battery recycling kiosk or household hazardous waste center."
        ],
        "hazard_warning": "Contains heavy metals and corrosive materials. Can cause fires if terminals short-circuit.",
        "eco_suggestions": [
            "Invest in high-quality rechargeable batteries and a charger.",
            "Choose USB-rechargeable devices when purchasing electronics.",
            "Utilize solar-powered alternatives for outdoor appliances."
        ],
        "accepted_at": ["Hazardous Waste Facility", "Electronics Retailer Drop-off", "E-waste Collection Center"]
    },
    "newspaper": {
        "item": "Newspaper",
        "category": "Paper Waste",
        "category_icon": "📰",
        "is_recyclable": True,
        "is_hazardous": False,
        "is_reusable": True,
        "disposal_instructions": "Keep the newspaper dry and free of food stains or oils. Stack and bundle them or place directly in the paper recycling bin.",
        "recycling_steps": [
            "Gather all loose newspaper pages.",
            "Ensure they are dry and clean (no oil or grease).",
            "Fold or bundle them together (avoid plastic bags/wraps).",
            "Deposit in the paper recycling bin."
        ],
        "hazard_warning": None,
        "eco_suggestions": [
            "Subscribe to digital versions of newspapers and magazines.",
            "Use old newspapers as packing material for shipping or moving.",
            "Use newspaper sheets for cleaning windows/mirrors or composting."
        ],
        "accepted_at": ["Paper Recycling Plant", "Community Recycling Bin", "Scrap Dealer (Kabadiwala)"]
    },
    "banana peel": {
        "item": "Banana Peel",
        "category": "Organic Waste",
        "category_icon": "🍌",
        "is_recyclable": True,
        "is_hazardous": False,
        "is_reusable": True,
        "disposal_instructions": "Organic items like banana peels decompose naturally. Place them in your organic waste bin or home compost pile to enrich the soil.",
        "recycling_steps": [
            "Collect the banana peel from food prep area.",
            "Avoid mixing with plastics or metal ties.",
            "Add to your compost bin or wet waste collection.",
            "Mix with brown organic materials (leaves, paper) for optimal decomposition."
        ],
        "hazard_warning": None,
        "eco_suggestions": [
            "Start a home compost pile or vermicomposting bin.",
            "Use banana peel water (soaking peels in water) to fertilize indoor plants.",
            "Support local municipal composting programs."
        ],
        "accepted_at": ["Composting Facility", "Organic Waste Processing Plant", "Home Compost Pile"]
    },
    "old charger": {
        "item": "Old Charger",
        "category": "E-waste",
        "category_icon": "🔌",
        "is_recyclable": True,
        "is_hazardous": True,
        "is_reusable": False,
        "disposal_instructions": "Chargers contain copper cables and plastic housings. They must be processed as e-waste to recover precious metals and prevent pollution.",
        "recycling_steps": [
            "Coil the charger cable neatly to prevent tangling.",
            "Store in a dry box with other outdated cords.",
            "Do not mix with regular household waste or recycling.",
            "Drop off at a designated e-waste drop box or collection drive."
        ],
        "hazard_warning": "Contains heavy metals and plastics that do not decompose and can leach into landfills.",
        "eco_suggestions": [
            "Label and store cables properly to reuse them before buying new ones.",
            "Donate functional chargers to charity or electronics thrift stores.",
            "Purchase multi-port chargers to reduce the total number of chargers needed."
        ],
        "accepted_at": ["E-waste Recycling Center", "Electronics Retailer Drop-off", "Municipal E-waste Bin"]
    },
    "glass jar": {
        "item": "Glass Jar",
        "category": "Glass Waste",
        "category_icon": "🫙",
        "is_recyclable": True,
        "is_hazardous": False,
        "is_reusable": True,
        "disposal_instructions": "Glass is 100% recyclable infinitely. Wash out any food remains, remove the metal lid, and place both in their respective recycling bins.",
        "recycling_steps": [
            "Empty the jar and wash away all food residue.",
            "Remove the metal lid (recycle the lid with metals).",
            "Store glass safely to avoid breaking before disposal.",
            "Place in the color-separated or general glass recycling bin."
        ],
        "hazard_warning": None,
        "eco_suggestions": [
            "Wash and reuse glass jars for kitchen storage (spices, grains).",
            "Use them for DIY crafts, candle making, or organizers.",
            "Avoid single-use packaging by buying items sold in glass over plastic."
        ],
        "accepted_at": ["Glass Recycling Plant", "Material Recovery Facility", "Local Scrap Dealer"]
    },
    "medicine bottle": {
        "item": "Medicine Bottle",
        "category": "Hazardous Waste",
        "category_icon": "💊",
        "is_recyclable": True,
        "is_hazardous": True,
        "is_reusable": False,
        "disposal_instructions": "Empty medicine bottles may contain chemical residues. Dispose of unused medications through safe take-back programs, peel off personal info labels, and recycle the bottle accordingly.",
        "recycling_steps": [
            "Dispose of any remaining medicine via pharmacy take-back channels.",
            "Scrape off or black out personal details on the prescription label.",
            "Rinse the plastic or glass bottle thoroughly.",
            "Place in the hazardous waste/medical waste container or specialized plastic bin."
        ],
        "hazard_warning": "Contains pharmaceutical residues that can contaminate water systems if thrown in domestic trash.",
        "eco_suggestions": [
            "Return unused drugs to pharmacies with medication take-back drop boxes.",
            "Opt for paper-packaged packaging when buying supplements where available.",
            "Ask doctors to prescribe only the required amount to prevent leftover medicine."
        ],
        "accepted_at": ["Pharmacy Take-back Kiosk", "Hazardous Waste Collection Facility", "Medical Waste Processor"]
    },
    "aluminium can": {
        "item": "Aluminium Can",
        "category": "Metal Waste",
        "category_icon": "🥫",
        "is_recyclable": True,
        "is_hazardous": False,
        "is_reusable": False,
        "disposal_instructions": "Aluminium cans are highly recyclable. Empty the contents, rinse the inside, and toss into the metal recycling bin. Leave the tab attached.",
        "recycling_steps": [
            "Ensure the can is empty and rinse it.",
            "Keep the pull-tab attached to the can.",
            "Do not crush flat (sorting systems identify 3D shapes better).",
            "Deposit in the metal recycling bin."
        ],
        "hazard_warning": None,
        "eco_suggestions": [
            "Choose infinitely recyclable aluminum over plastic containers.",
            "Participate in local scrap deposit refund schemes if available.",
            "Support companies that utilize 100% recycled aluminum packaging."
        ],
        "accepted_at": ["Metal Recycling Facility", "Scrap Metal Dealer", "Dry Waste Collection Center"]
    },
    "cardboard box": {
        "item": "Cardboard Box",
        "category": "Paper Waste",
        "category_icon": "📦",
        "is_recyclable": True,
        "is_hazardous": False,
        "is_reusable": True,
        "disposal_instructions": "Flatten cardboard boxes to save space in transport. Remove plastic tape and shipping labels if possible, and keep the cardboard dry.",
        "recycling_steps": [
            "Empty the box of all plastic packaging or bubble wrap.",
            "Peel off heavy plastic tapes and shipping labels.",
            "Break down and flatten the box completely.",
            "Place in the cardboard/paper recycling container."
        ],
        "hazard_warning": None,
        "eco_suggestions": [
            "Keep clean boxes for storage, shipping, or moving.",
            "Shred cardboard to use as mulch or brown material in composting.",
            "Opt for minimal packaging options when shopping online."
        ],
        "accepted_at": ["Paper Recycling Plant", "Dry Waste Collection Center", "Kabadiwala / Scrap Vendor"]
    },
    "mobile phone": {
        "item": "Mobile Phone",
        "category": "E-waste",
        "category_icon": "📱",
        "is_recyclable": True,
        "is_hazardous": True,
        "is_reusable": True,
        "disposal_instructions": "Mobile phones contain lithium-ion batteries and complex circuitry. They must be recycled at specialized electronic waste centers to retrieve rare materials and prevent pollution.",
        "recycling_steps": [
            "Perform a factory reset to erase all personal data.",
            "Remove the SIM card and external memory cards.",
            "Do not attempt to puncture or open the internal battery.",
            "Take the phone to a certified electronics recycling center or brand trade-in kiosk."
        ],
        "hazard_warning": "Contains toxic heavy metals and a lithium battery that pose high fire and environmental risks.",
        "eco_suggestions": [
            "Sell or trade in old functional phones for refurbishment.",
            "Donate working phones to community organizations or schools.",
            "Repair existing phones to extend their lifespan before buying new ones."
        ],
        "accepted_at": ["E-waste Recycler", "Brand Retailer Trade-in Kiosk", "Hazardous Waste Drop-off"]
    },
    "paint can": {
        "item": "Paint Can",
        "category": "Hazardous Waste",
        "category_icon": "🪣",
        "is_recyclable": True,
        "is_hazardous": True,
        "is_reusable": False,
        "disposal_instructions": "Liquid paint is hazardous. Let leftovers dry out completely (mix with cat litter or paint hardener if needed). Empty metal cans are recyclable; otherwise, take them to hazardous waste disposal sites.",
        "recycling_steps": [
            "Ensure the paint inside is dry or hardened (do not pour down drains).",
            "If empty and dry, remove the lid to show it is empty.",
            "Separate the plastic or metal lid from the can.",
            "Drop off at a municipal hazardous waste collection center."
        ],
        "hazard_warning": "Contains chemicals, volatile organic compounds (VOCs), and heavy metals that pollute water systems.",
        "eco_suggestions": [
            "Buy only the amount of paint required for your project.",
            "Donate leftover paint to community projects, schools, or neighbors.",
            "Choose eco-friendly, low-VOC or natural paints."
        ],
        "accepted_at": ["Hazardous Waste Collection Site", "Paint Retailer Take-back", "Specialized Recycling Yard"]
    },
    "food wrapper": {
        "item": "Food Wrapper",
        "category": "General Waste",
        "category_icon": "🍬",
        "is_recyclable": False,
        "is_hazardous": False,
        "is_reusable": False,
        "disposal_instructions": "Most snack wrappers and chip bags are made of multi-layer plastics and foils that cannot be separated. Dispose of them in the general landfill bin.",
        "recycling_steps": [
            "Ensure the wrapper is empty of food crumbs.",
            "Do not mix with recyclable plastics or paper.",
            "Compress the wrapper to minimize volume.",
            "Dispose of in the general trash bin (landfill)."
        ],
        "hazard_warning": None,
        "eco_suggestions": [
            "Buy snacks in bulk to reduce the number of individual wrapper plastics.",
            "Choose snacks packaged in recyclable paper or cardboard.",
            "Support initiatives that convert soft plastics into plastic lumber or fuel."
        ],
        "accepted_at": ["Landfill Disposal Bin", "Waste-to-Energy Plant", "Municipal General Waste Collector"]
    }
}

def generate_default_guide(item_name):
    lower_name = item_name.lower()
    category = "General Waste"
    icon = "🗑️"
    is_rec = False
    is_haz = False
    is_reu = False
    warning = None
    accepted = ["Landfill Disposal Bin", "Municipal General Waste Collector", "Waste Transfer Station"]
    
    if any(k in lower_name for k in ["plastic", "bottle", "cup", "tub", "tray", "jug"]):
        category = "Plastic Waste"
        icon = "🥤"
        is_rec = True
        is_reu = True
        accepted = ["Recycling Center", "Plastic Collection Point", "Material Recovery Facility"]
    elif any(k in lower_name for k in ["paper", "cardboard", "box", "newspaper", "book", "magazine", "envelope"]):
        category = "Paper Waste"
        icon = "📦"
        is_rec = True
        is_reu = True
        accepted = ["Paper Recycling Plant", "Community Recycling Bin", "Scrap Dealer (Kabadiwala)"]
    elif any(k in lower_name for k in ["glass", "jar", "cup", "mug", "window", "mirror"]):
        category = "Glass Waste"
        icon = "🫙"
        is_rec = True
        is_reu = True
        accepted = ["Glass Recycling Plant", "Material Recovery Facility", "Local Scrap Dealer"]
    elif any(k in lower_name for k in ["metal", "can", "tin", "aluminium", "iron", "copper", "wire", "steel"]):
        category = "Metal Waste"
        icon = "🥫"
        is_rec = True
        accepted = ["Metal Recycling Facility", "Scrap Metal Dealer", "Dry Waste Collection Center"]
    elif any(k in lower_name for k in ["phone", "laptop", "charger", "cable", "computer", "battery", "tv", "electronic", "wire", "screen", "keyboard"]):
        category = "E-waste"
        icon = "🔌"
        is_rec = True
        is_haz = True
        warning = "Contains heavy metals, chemicals, or lithium batteries that pose high fire and environmental risks."
        accepted = ["E-waste Recycling Center", "Electronics Retailer Drop-off", "Municipal E-waste Bin"]
    elif any(k in lower_name for k in ["chemical", "paint", "poison", "toxic", "acid", "cleaner", "solvent", "spray", "aerosol", "medicine", "pill"]):
        category = "Hazardous Waste"
        icon = "⚠️"
        is_rec = False
        is_haz = True
        warning = "Contains chemicals or toxic residues. Handle with care and dispose of at a hazardous waste collection event."
        accepted = ["Hazardous Waste Facility", "Pharmacy/Chemical Take-back", "Specialized Collection Kiosk"]
    elif any(k in lower_name for k in ["food", "peel", "apple", "banana", "vegetable", "fruit", "leaf", "leaves", "grass", "organic", "scraps", "meat"]):
        category = "Organic Waste"
        icon = "🍌"
        is_rec = True
        is_reu = True
        accepted = ["Composting Facility", "Organic Waste Processing Plant", "Home Compost Pile"]

    return {
        "item": item_name.title(),
        "category": category,
        "category_icon": icon,
        "is_recyclable": is_rec,
        "is_hazardous": is_haz,
        "is_reusable": is_reu,
        "disposal_instructions": f"This item is classified as {category}. Please separate it and dispose of it at appropriate collection points to minimize environmental impact.",
        "recycling_steps": [
            f"Check if the {item_name} is clean and free of contamination.",
            f"Separate any secondary packaging or mixed materials.",
            f"Store safely in a dry location until disposal.",
            f"Place in the appropriate {category} receptacle or take to a local depot."
        ],
        "hazard_warning": warning,
        "eco_suggestions": [
            f"Seek reusable or zero-waste alternatives to avoid buying {item_name}.",
            "Share or donate if the item is still in functional condition.",
            "Participate in local civic cleanup and collection drives."
        ],
        "accepted_at": accepted
    }

@waste_bp.route('/analyze-waste', methods=['POST'])
def analyze_waste():
    data = request.json or {}
    raw_item = data.get('item', '')
    if not isinstance(raw_item, str):
        return jsonify({"error": "Invalid input format"}), 400
        
    item = raw_item.strip()
    if not item:
        return jsonify({"error": "Item name cannot be empty"}), 400
        
    api_key = os.environ.get("GROQ_API_KEY")
    
    if api_key:
        try:
            client = Groq(api_key=api_key)
            prompt = f"""
You are an expert civic AI assistant for WasteGuide AI.
Analyze the following waste item: "{item}"
Construct a response with disposal guidelines and classify it into exactly one of these categories:
{json.dumps(CATEGORIES)}

Provide your output as a single JSON object. Do not output any markdown code blocks, no ```json formatting, no introductory commentary, and no markdown formatting in the output. Output exactly this JSON structure:
{{
  "item": "{item}",
  "category": "One of the 8 categories",
  "category_icon": "A single relevant emoji representing the category",
  "is_recyclable": true/false,
  "is_hazardous": true/false,
  "is_reusable": true/false,
  "disposal_instructions": "2-3 sentences of clear, plain-language disposal guidance",
  "recycling_steps": [
    "Step 1 (clear, practical action)",
    "Step 2",
    "Step 3",
    "Step 4"
  ],
  "hazard_warning": "Warning message or null if not hazardous",
  "eco_suggestions": [
    "Eco suggestion 1",
    "Eco suggestion 2",
    "Eco suggestion 3"
  ],
  "accepted_at": [
    "Facility type 1",
    "Facility type 2",
    "Facility type 3"
  ]
}}
"""
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=800
            )
            
            raw_response = completion.choices[0].message.content.strip()
            
            # Clean markdown code fences if model output contains them
            if raw_response.startswith("```"):
                lines = raw_response.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines[-1].startswith("```"):
                    lines = lines[:-1]
                raw_response = "\n".join(lines).strip()
            
            raw_response = raw_response.replace("bytes", "").replace("```json", "").replace("```", "").strip()
            
            parsed = json.loads(raw_response)
            
            required_fields = ["item", "category", "category_icon", "is_recyclable", "is_hazardous", 
                               "is_reusable", "disposal_instructions", "recycling_steps", 
                               "hazard_warning", "eco_suggestions", "accepted_at"]
            
            if all(f in parsed for f in required_fields):
                if (isinstance(parsed["recycling_steps"], list) and len(parsed["recycling_steps"]) == 4 and
                    isinstance(parsed["eco_suggestions"], list) and len(parsed["eco_suggestions"]) == 3 and
                    isinstance(parsed["accepted_at"], list) and len(parsed["accepted_at"]) == 3):
                    
                    if parsed["category"] not in CATEGORIES:
                        parsed["category"] = next((cat for cat in CATEGORIES if cat.lower() in parsed["category"].lower()), "General Waste")
                        
                    return jsonify({
                        "result": parsed,
                        "source": "groq"
                    })
            logger.warning("Groq response validation failed, falling back to static database.")
        except Exception as e:
            logger.error(f"Error calling Groq API: {e}")
            
    db_item = item.lower()
    if db_item in MOCK_DATABASE:
        result = MOCK_DATABASE[db_item]
    else:
        result = generate_default_guide(item)
        
    return jsonify({
        "result": result,
        "source": "fallback"
    })
