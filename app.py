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

userlist = {'X': None, "O": None, "spectators": []}

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

#새로운 유저 player assignment
def add_user_to_list(username, userlist):

    if userlist['X'] is None:
        userlist['X'] = username
    elif userlist['O'] is None:
        userlist['O'] = username
    else:
        userlist['spectators'].append(username)
    
    return userlist

def check_duplicate_user(name):
    if userlist['X'] == name or userlist['O'] == name:
        return True
    else:
        if name in userlist['spectators']:
            return True
    
    return False

#로그인한 유저가 Database에 존재 하는지 체크한다
def check_if_exists(username):
    db_users = users_ref.get() #JSON object를 Firebase에서 불러온다
    name_lower = username.lower()

    for each in db_users: 
        if(each.lower() == name_lower): return True

    return False

def add_user_to_db(username):
    users_ref.update({
    str(username): {
        'score': 100
    }
    })

@socketio.on('logging_in') 
def log_in(data): #여기서 data는 socket emit 할때 클라이언트가 보내는 갑
    
    global userlist

    name = data['username']
    duplicate_user = check_duplicate_user(name)
    if duplicate_user:
        print("User already logged in.")
        return

    userlist = add_user_to_list(name, userlist)

    exists = check_if_exists(name)
    if not exists:
        add_user_to_db(name)

    socketio.emit('logging_in', name, to=request.sid) #로그인한 게임유저 한테만 전송
    socketio.emit('userlist', userlist, include_self=True)

@socketio.on('click')
def on_click(data):
    #player가 보드눌를때마다 다른 client들한테 알린다
    socketio.emit('click', data, include_self=False)

socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=int(os.getenv('PORT', 8081)),
    debug=True
)