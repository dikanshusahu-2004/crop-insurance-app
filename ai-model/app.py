from flask import Flask, request, jsonify
from PIL import Image
import numpy as np

app = Flask(__name__)

def check_damage(file):
    image = Image.open(file).convert("RGB")
    image = image.resize((224, 224))
    img = np.array(image)

    # 🔥 ONLY LOWER AREA (crop focus)
    img = img[120:224, :, :]

    R = img[:, :, 0]
    G = img[:, :, 1]
    B = img[:, :, 2]

    green_mask = (G > R) & (G > B) & (G > 100)
    brown_mask = (R > 100) & (G < 130) & (B < 100)

    green_ratio = np.sum(green_mask) / img.size
    brown_ratio = np.sum(brown_mask) / img.size

    print("Green:", green_ratio, "Brown:", brown_ratio)

    # 🔥 UPDATED LOGIC (important)
    if brown_ratio > 0.12:
        return "Damaged"
    elif green_ratio > 0.3:
        return "Healthy"
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