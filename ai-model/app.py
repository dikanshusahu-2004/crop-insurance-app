from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np

app = Flask(__name__)
CORS(app)  # 🔥 FIX

def check_damage(file):

    image = Image.open(file).convert("RGB")
    image = image.resize((224, 224))
    img = np.array(image) / 255.0

    r = img[:, :, 0]
    g = img[:, :, 1]
    b = img[:, :, 2]

    ndvi = np.mean((g - r) / (g + r + 0.01))
    green_score = np.mean(g - r)

    brown_mask = (r > 0.4) & (g > 0.2) & (g < 0.6)
    brown_score = np.mean(brown_mask)

    water_mask = (b > 0.4) & (g > 0.3) & (r < 0.3)
    water_score = np.mean(water_mask)

    # 🔥 NEW: yellow (mature crop detection)
    yellow_mask = (r > 0.5) & (g > 0.5) & (b < 0.3)
    yellow_score = np.mean(yellow_mask)

    print("NDVI:", ndvi, "Green:", green_score, "Brown:", brown_score, "Yellow:", yellow_score)

    # 🌊 Water damage
    if water_score > 0.25:
        return "Water Damaged 🌊"

    # 🌿 Healthy
    elif ndvi > 0.1:
        return "Healthy"

    # 🌾 Mature (IMPORTANT FIX)
    elif yellow_score > 0.3:
        return "Mature 🌾"

    # ❌ Damaged
    elif brown_score > 0.4:
        return "Damaged"

    # ⚠️ Moderate
    else:
        return "Moderately Damaged"
    
@app.route("/", methods=["GET"])
def home():
    return "AI API Running 🚀"


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    try:
        result = check_damage(file)
        return jsonify({"prediction": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)