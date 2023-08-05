from flask import Flask, redirect, render_template
import firebase_admin
from firebase_admin import db, credentials
# import os

cred_obj = credentials.Certificate('./ServiceAccountKey.json')

default_app = firebase_admin.initialize_app(cred_obj, {
    'databaseURL' : 'https://refineit-bc598-default-rtdb.europe-west1.firebasedatabase.app/'
    })

app = Flask(__name__, static_folder='./build/static', template_folder="./build" )

@app.route("/")
def hello_world():
    return redirect("/app")

@app.route("/app")
def homepage():
    return render_template("index.html")

@app.route('/<path:generatedKey>', methods=['GET'])
def fetch_from_firebase(generatedKey):
    ref = db.reference('/' + generatedKey)
    data = ref.get()
    print("data")
    print(data)
    print("/data")
    if not data:
        print("je proc 1")
        return '404 URL not found'
    else:
        print("proc 2")
        longURL = data['longURL']
        print(longURL)
        return redirect(longURL)