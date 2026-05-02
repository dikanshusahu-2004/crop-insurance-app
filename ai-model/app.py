from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import io

app = Flask(__name__)

# 🔥 Lightweight logic (green color based)
def check_damage(file):
    image = Image.open(file).convert("RGB")
    image = image.resize((224, 224))
    img_array = np.array(image)

    # Green channel average निकालो
    green_avg = np.mean(img_array[:, :, 1])

    # Threshold (tune कर सकते हो)
    if green_avg > 100:
        return "Healthy"
    else:
        return "Damaged"

# Root (health check)
@app.route("/", methods=["GET"])
def home():
    return "AI API Running 🚀"

# Prediction API
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