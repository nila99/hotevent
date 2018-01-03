import os
import re
from flask import Flask, jsonify, render_template, request

# Configure application
app = Flask(__name__)

# leads to home page
@app.route("/")
def index():
    return render_template("index.html")

# leads to all events page and renders map
@app.route("/allevents")
def allevents():
    if not os.environ.get("API_KEY"):
        raise RuntimeError("API_KEY not set")
    return render_template("allevents.html", key=os.environ.get("API_KEY"))

# leads to user date page and renders map
@app.route("/dateevents")
def dateevents():
    if not os.environ.get("API_KEY"):
        raise RuntimeError("API_KEY not set")
    return render_template("dateevents.html", key=os.environ.get("API_KEY"))