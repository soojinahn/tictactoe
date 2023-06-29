import React from 'react';
import { useState, useEffect } from 'react';
import { Board } from './components/Board.js';
import { LogIn } from './components/LogIn.js';
import './components/Board.css';
import socket from './components/Board.js';

function App() {

    const [isLoggedIn, setLogIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [userList, setUserList] = useState([]);
    let playerX, playerO;
    let spectators = ""

    function renderBoard() {
        if(isLoggedIn) {
            return (
                <div>
                    <Board />
                </div>
            )
        }
    }

    function renderLogIn() {
        if (!isLoggedIn) {return (<LogIn />);}
        return
    }

    function logout() {
        if(isLoggedIn) {
            return (
                <div className="logout">
                <button onClick={() => setLogIn(false)}>Logout</button>
                </div>
            );
        }
    }
    
    function renderUserList() {
        if(isLoggedIn) {
            if(userList[0]) playerX = userList[0]
            if(userList[1]) playerO = userList[1]
            if(userList[2]) spectators = userList.slice(2).map(user => spectators + " " + user);

            return (
                <div class="userlist">
                    <h1>{userName}'s Tic Tac Toe</h1>
                    <h2>Player X: {playerX}</h2>
                    <h2>Player O: {playerO}</h2>
                    <h3>Spectators: {spectators}</h3>
                </div>
            )
        }
    }

    useEffect(() => {
        socket.on('logging_in', (data) => {
            setLogIn(true);
            setUserName(data);
        });
    }, []);

    useEffect(() => {
        socket.on('userlist', (data) => {
            setUserList(data);
        });
    }, []);

    return (
        <div className="container">
            {renderLogIn()}
            {renderUserList()}
            {renderBoard()}
            {logout()}
        </div>
    );
}

export default App;