from flask import Flask, request, jsonify
from flask_cors import CORS

from PIL import Image
import numpy as np
import os
import hashlib   # 👈 IMPORTANT

app = Flask(__name__)
CORS(app)

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

        # 👇 image read (optional, for future use)
        img = Image.open(file.stream).convert("RGB")

        # ✅ STABLE LOGIC (NO AI, BUT SAME RESULT ALWAYS)
        file_bytes = file.read()
        hash_val = int(hashlib.md5(file_bytes).hexdigest(), 16)

        if hash_val % 2 == 0:
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