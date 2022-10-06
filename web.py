import json

from flask import Flask, request, send_from_directory

from model import action_dict, predict


app = Flask(__name__)

@app.route("/")
def form():
    return send_from_directory(".", "index.html")


@app.route("/predict", methods=["POST"])
def predict_route():
    data = request.json
    action_code = predict(data["inr"], data["dose"], data["split"])
    action_text = action_dict[action_code]

    return json.dumps({"recommendation": action_text})
