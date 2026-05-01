from flask import Flask, request, jsonify
from flask_cors import CORS   # ✅ FIX

from PIL import Image
import numpy as np
import os
import joblib   # ✅ model load

app = Flask(__name__)
CORS(app)

# ✅ Load trained model
model = joblib.load("model.pkl")

# ✅ Route
@app.route("/predict", methods=["GET", "POST"])
def predict():

    # health check
    if request.method == "GET":
        return "AI Running 🚀"

    # file check
    if "image" not in request.files:
        return jsonify({"error": "No image"}), 400

    file = request.files["image"]

    try:
        print("FILE RECEIVED:", file.filename)

        # ✅ preprocess image
        img = Image.open(file.stream).convert("RGB")
        img = img.resize((64, 64))
        img = np.array(img).flatten().reshape(1, -1)

        # ✅ prediction
        pred = model.predict(img)[0]

        if pred == 0:
            result = "Healthy 🌱"
        else:
            result = "Damaged ⚠️"

        return jsonify({"result": result})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500


# ✅ IMPORTANT for Render
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)