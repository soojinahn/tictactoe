import os, json
from dotenv import load_dotenv
from flask import Flask, send_from_directory, json, request
from flask_socketio import SocketIO
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db

load_dotenv()

app = Flask(__name__, static_folder='./build/static')
app.config['SECRET_KEY'] = 'secret!'
cors = CORS(app, resources={r"/*": {"origins": "*"}})

users = []
userIDs = {}

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
users_ref = db.reference('/User')

@app.route('/', defaults={"filename": "index.html"})

@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

@socketio.on('connect')
def on_connect():
    print("User Connected!")

@socketio.on('disconnect')
def on_disconnect():
    if request.sid in userIDs.keys():
        delete = userIDs[str(request.sid)]
        del userIDs[str(request.sid)]
        users.remove(delete)
    
    socketio.emit('userlist', users, include_self=True)

@socketio.on('logging_in') 
def log_in(data): #여기서 data는 socket emit 할때 클라이언트가 보내는 갑
    
    name = data['userName']

    if name not in users:
        userIDs[str(request.sid)] = name
        users.append(name)

    userlist = users_ref.get() #JSON object를 Firebase에서 불러온다
    user_exists = False
    name_lower = name.lower()
    for user in userlist: #로그인한 유저가 Database에 존재 하는지 체크한다
        if(user.lower() == name_lower): user_exists = True

    if not user_exists: #새로운 유저는 Database에 새로 올려준다
        users_ref.update({
            str(name): {
                'score': 50
            }
        })

    socketio.emit('logging_in', name, to=request.sid) #로그인한 게임유저 한테만 전송
    socketio.emit('userlist', users, include_self=True) #모든 client한테 새로운 유저리스트 전송

socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=int(os.getenv('PORT', 8081)),
    debug=True
)