from flask import Flask, request, jsonify
from flask_cors import CORS   # 👈 पहले import

from PIL import Image
import numpy as np
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input

app = Flask(__name__)   # 👈 पहले app बनाओ
CORS(app)               # 👈 उसके बाद CORS लगाओ

model = MobileNetV2(weights="imagenet")

def preprocess(img):
    img = img.resize((224,224))
    img = np.array(img)
    img = preprocess_input(img)
    img = np.expand_dims(img, axis=0)
    return img

@app.route("/predict", methods=["GET","POST"])
def predict():

    if request.method == "GET":
        return "AI Running 🚀"

    if "image" not in request.files:
        return jsonify({"error": "No image"}), 400

    file = request.files["image"]

    try:
        print("FILE RECEIVED:", file.filename)

        img = Image.open(file.stream)
        img = preprocess(img)

        pred = model.predict(img)

        # demo logic
        import random
        if random.random() > 0.3:
            result = "Healthy 🌱"
        else:
            result = "Damaged ⚠️"

        return jsonify({"result": result})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5001)