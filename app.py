import os, json
from dotenv import load_dotenv
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db

load_dotenv()

app = Flask(__name__, static_folder='./build/static')
app.config['SECRET_KEY'] = 'secret!'
cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

#Firebase 로딩
cred = credentials.Certificate(json.loads(os.getenv('FIREBASE_SERVICE_ACCOUNT_KEY')))
firebase_admin.initialize_app(cred, {
    'databaseURL': os.getenv('DATABASE_URL')
})

#DB에서 존재하는 Person 데이터셋 불러옴
ref = db.reference('/Person')
print(ref.get())

@app.route('/', defaults={"filename": "index.html"})

@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

@socketio.on('connect')
def on_connect():
    print("User Connected!")

socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=int(os.getenv('PORT', 8081)),
    debug=True
)