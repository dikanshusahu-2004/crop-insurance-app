from flask import Flask, request, jsonify
from PIL import Image
import numpy as np

app = Flask(__name__)

def check_damage(file):
    image = Image.open(file).convert("RGB")
    image = image.resize((224, 224))
    img = np.array(image)

    # 🔥 focus only bottom (crop area)
    img = img[120:224, :, :]

    # convert to HSV
    import cv2
    hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)

    # GREEN RANGE
    green_lower = np.array([35, 40, 40])
    green_upper = np.array([85, 255, 255])

    # BROWN / DRY RANGE
    brown_lower = np.array([10, 50, 50])
    brown_upper = np.array([30, 255, 200])

    green_mask = cv2.inRange(hsv, green_lower, green_upper)
    brown_mask = cv2.inRange(hsv, brown_lower, brown_upper)

    green_ratio = np.sum(green_mask > 0) / green_mask.size
    brown_ratio = np.sum(brown_mask > 0) / brown_mask.size

    print("Green:", green_ratio, "Brown:", brown_ratio)

    # 🔥 FINAL DECISION
    if brown_ratio > 0.20:
        return "Damaged"
    elif green_ratio > 0.25:
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