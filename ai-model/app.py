from flask import Flask, request, jsonify
from PIL import Image
import numpy as np

app = Flask(__name__)

def check_damage(file):
    image = Image.open(file).convert("RGB")
    image = image.resize((224, 224))
    img = np.array(image)

    # RGB channels
    R = img[:, :, 0]
    G = img[:, :, 1]
    B = img[:, :, 2]

    # 🔥 Green detection
    green_mask = (G > R) & (G > B) & (G > 100)

    # 🔥 Brown / dry detection
    brown_mask = (R > 100) & (G < 120) & (B < 100)

    green_ratio = np.sum(green_mask) / (224 * 224)
    brown_ratio = np.sum(brown_mask) / (224 * 224)

    print("Green:", green_ratio, "Brown:", brown_ratio)

    # 🔥 Decision logic
    if green_ratio > 0.5:
        return "Healthy"
    elif brown_ratio > 0.3:
        return "Damaged"
    else:
        return "Partially Damaged"


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