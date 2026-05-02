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

    # Green score
    green_score = np.mean(g - r)

    # Brown (dry)
    brown_mask = (r > 0.4) & (g > 0.2) & (g < 0.5)
    brown_score = np.mean(brown_mask)

    # 🔥 Water detection
    water_mask = (b > 0.4) & (g > 0.3) & (r < 0.3)
    water_score = np.mean(water_mask)

    print("Green:", green_score, "Brown:", brown_score, "Water:", water_score)

    # 🔥 FINAL LOGIC
    if water_score > 0.25:
        return "Water Damaged 🌊"

    elif green_score > 0.15 and brown_score < 0.2:
        return "Healthy"

    elif brown_score > 0.4:
        return "Damaged"

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