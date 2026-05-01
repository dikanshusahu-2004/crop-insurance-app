from flask import Flask, request, jsonify
from flask_cors import CORS

from PIL import Image
import numpy as np
import os



app = Flask(__name__)
CORS(app)





# ✅ Preprocess function
def preprocess(img):
    img = img.resize((224, 224))
    img = np.array(img)
    img = preprocess_input(img)
    img = np.expand_dims(img, axis=0)
    return img


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

        img = Image.open(file.stream).convert("RGB")
        img = preprocess(img)

        

        # ⚠️ अभी demo logic (real AI नहीं)
        import random
        if random.random() > 0.3:
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