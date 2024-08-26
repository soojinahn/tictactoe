
<div align="center">
<img width="220" alt="tictactoe" src="https://github.com/soojinahn/tictactoe/blob/main/src/assets/tictactoe.png">
<br>
<br>

[![Flask and React](https://skillicons.dev/icons?i=firebase,flask,py,react)](https://skillicons.dev)
</div>

# TicTacToe
틱택토는 오목과 유사한 보드게임입니다.

## 사용 기술 📚
**개요:** 백엔드에는 Python와 Flask를, 프론트엔드에는 ReactJS를 사용하여 웹 애플리케이션을 구축하였으며, Socket.io로 연결하였습니다.

**Frontend:** ReactJS, socket.io\
**Backend:** Python, Flask, FlaskSocketIO\
**Database:** Firebase Realtime Database\
**Tools:** VS Code, Git, GitHub

## 기능 ✨
- Login: 유저 로그인 때 DB에 있는 계정 확인
- User Authentication: 로그인 후 게임 플레이, 관람 하용
- Game Play: 게임 룰 따라 turn-taking, click 허용
- Score: 게임 승자, 패자 판결. 게임 후 DB에 점수 업데이트
- Leaderboard: 실시간 리더보드/점수 디스플레이
- Game Reset: Player O 또는 Player X는 게임 리셋 가능

### 유저 스토리 (User/Purpose/Action)

1. 다중 유저가 틱택토 라이브 게임을 플레이하거나 관전할 수 있도록 서버 접속을 허용합니다.

2. 유저는 게임 접속을 위해 이름을 입력하고 로그인 버튼을 눌러야 합니다. 버튼을 누르면 로그인 상태로 틱택토 게임을 불러올 수 있습니다.
    - 처음 접속하는 유저는 Player X (차례가 첫 번째)로 배정됩니다. 두 번째로 접속하는 유저는 Player O로 배정됩니다. 그 이후에 로그인한 유저들은 Spectator (관람자)로 배정됩니다. 관람자는 게임을 단지 구경만 할 수 있습니다.

        *게임 시작 전에 모든 사용자가 접속한 것으로 간주되며, 게임 중에는 아무도 게임에서 나가지 않습니다.*

3. 유저들이 게임 선수와 관람자를 구분할 수 있도록 다음과 같이 표시됩니다:

    - Player X: 유저이름
    - Player O: 유저이름
    - Spectator(s): 유저이름(들)

4. 유저들은 턴을 교대로 진행하면서 게임을 진행합니다.

    - Player X가 X를 놓으면 Player O의 보드에 X가 놓인 새로운 보드로 업데이트됩니다. 반대로도 동일하게 적용됩니다.
    - Spectator (관람자)는 보드 클릭이 허용되지 않습니다.
5. 게임이 끝나면 게임 상태(status) 알림과 승자 이름 알림이 제공됩니다.

6. 유저들은 모든 사용자의 점수를 볼 수 있으며 버튼을 누르면 리더보드가 표시됩니다. 다시 버튼을 누르면 리더보드를 숨길 수도 있습니다.
    - 리더보드는 두 개의 열로 구성되어 있습니다: 유저이름, 점수.
    - 유저들은 100점부터 시작합니다. 게임이 끝나면 승자는 +10점, 패자는 -10점이 부여됩니다. 동점인 경우 점수는 변동이 없습니다.
    - 게임이 끝난 후 Player X와 Player O의 새로운 점수가 자동으로 업데이트되어 리더보드에 반영됩니다.

7. Player X 또는 Player O는 보드 리셋 버튼을 눌러 게임을 새로 시작할 수 있습니다. 버튼을 누르면 보드는 원상태로 돌아갑니다.

## 데이터베이스 (Firebase Realtime Database) 💿
- NoSQL 데이터베이스로 Firebase Realtime Database는 클라우드에서 작동합니다. 틱텍토라는 게임은 유저들 이름과 점수들을 저장해야 되는데 관계형 데이터베이스보다 쉽고 간편한 JSON 파일로 데이터를 불러 올 수 있어서 사용하게 되었습니다.
- User라는 JSON tree에 유저들을 저장 합니다. 다음은 현제 데이터베이스에 있는 User들입니다.


<div align="center">
<img width="230" alt="gameover" src="https://github.com/soojinahn/tictactoe/blob/main/src/assets/database.png">

*Figure 1. User table in database*
</div>


## 코드 Snippets 👾

### 1. 로그인: client-side (ReactJS)

~~~javascript
export function LogIn(props){
  
    const inputRef = useRef(null);

    function processLogIn(){
        if(inputRef.current.value){
            const username = inputRef.current.value;
            socket.emit('logging_in', { username: username });
        }
    }
    
    function logInScreen(){
        return( 
            <div class='login'>
            <h2>Log In</h2>
            <input placeholder='Enter username' type='text' ref={inputRef}/>
            <button type='submit' onClick={processLogIn}>Log In</button>
            </div>
            );
    }
  
  return logInScreen();
}
~~~

- 로그인 페이지에서 username이라는 갑을 서버 사이드로 socket.emit을 통해 전송

### 2. 로그인: server-side (Flask/Python)

~~~python
@socketio.on('logging_in') 
def log_in(data): #여기서 data는 socket emit 할때 클라이언트가 보내는 갑
    
    global userlist

    name = data['username']
    duplicate_user = check_duplicate_user(name)
    if duplicate_user: #로그인 되있는 게임유저
        return

    userlist = add_user_to_list(name, userlist)

    exists = check_if_exists(name)
    if not exists:
        add_user_to_db(name)

    users = users_ref.get()
    scores = (list_users_scores(users))

    socketio.emit('logging_in', name, to=request.sid) #로그인한 게임유저 한테만 전송
    socketio.emit('scores', scores, include_self=True)
    socketio.emit('userlist', userlist, include_self=True) #새로운 유저 로그인할때 userlist 업데이트
~~~

- 클라이언트와 서버 상호작용에 Socket.io 사용

### 3. Board.js: client-side (ReactJS)

~~~javascript
function clickSquare(index) {
        if(!myBoard[index] && !gameHasWinner && !isSpect && whichPlayer===currentTurnValue) { //게임에 룰에 따라 click 허용
            const newBoard = myBoard.slice();
            newBoard[index] = currentTurnValue;
            setBoard(newBoard);
            setCurrentTurn(prevTurn => prevTurn + 1);
            socket.emit('click', { index, myBoard, whichPlayer }); 
        }
    }
~~~

~~~javascript
function calculateWinner(myBoard){
        //게임 이길수있는 가로, 세로, 대각선 인덱스
        const lines = [    
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
          ];
          
          for(let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            //인덱스에 갑 (X 혹 O)을 확인 
            if (myBoard[a] && myBoard[a] === myBoard[b] && myBoard[a] === myBoard[c]) { 
                return myBoard[a];
            }
          }
          return null;
    }
~~~
- clickSquare(): Player X 또는 Player O가 보드의 Square 컴포넌트를 클릭했을때 불리는 함수

- calculateWinner(): 가로, 세로, 대각선을 확인하여 X또는 O중에 승자가 있는지 알림


# Screenshots

<div align="center">
<img width="1512" alt="gameover" src="https://github.com/soojinahn/tictactoe2/assets/68924449/d8aa72bc-713c-4ebf-b296-6078436c659a">
  
*Figure 2. Live game from two different browsers*
  
</div>
