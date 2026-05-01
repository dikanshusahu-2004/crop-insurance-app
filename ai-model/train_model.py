import os
import numpy as np
from PIL import Image
from sklearn.ensemble import RandomForestClassifier
import joblib

X = []
y = []

def load_images(folder, label):
    for file in os.listdir(folder):
        try:
            path = os.path.join(folder, file)

            img = Image.open(path).convert("RGB")   # ✅ force RGB
            img = img.resize((64, 64))              # ✅ same size
            img = np.array(img).flatten()           # ✅ same shape

            X.append(img)
            y.append(label)

        except Exception as e:
            print("Skipping:", file, e)

load_images("dataset/healthy", 0)
load_images("dataset/damaged", 1)

X = np.array(X)
y = np.array(y)

model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, "model.pkl")

print("Model saved ✅")