import React from 'react';
import { useState, useEffect } from 'react';
import { Board } from './components/Board.js';
import { LogIn } from './components/LogIn.js';
import { Leaderboard } from './components/Leaderboard.js';
import socket from './components/Board.js';
import './assets/Board.css';
import './assets/Leaderboard.css';

function App() {

    const [isLoggedIn, setLogIn] = useState(false);
    const [username, setUsername] = useState("");
    const [userlist, setUserlist] = useState({"X":"", "O":"", "spectators": []});
    const [scorelist, setScorelist] = useState([]);
    let playerX, playerO, isSpect;
    let spectators = "";

    function renderLogIn() {
        if (!isLoggedIn) {
            return (<LogIn />);
        }
    }

    function renderUserList() {
        if(isLoggedIn) {
            playerX = userlist.X;
            playerO = userlist.O;
            spectators = userlist.spectators.map(each => spectators + " " + each);

            return (
                <div className="userlist">
                    <h1>{username}'s Tic Tac Toe</h1>
                    <h3>Player X: {playerX}</h3>
                    <h3>Player O: {playerO}</h3>
                    <h4>Spectators: {spectators}</h4>
                </div>
            )
        }
    }

    function renderBoard() {
        if(isLoggedIn) {
            isSpect = userlist["spectators"].includes(username) ? true:false;
            return (
                <div>
                    <Board username={username} playerX={playerX} isSpect={isSpect}/>
                </div>
            )
        }
    }

    function renderLeaderboard() {
        if(isLoggedIn) {
            return (<Leaderboard scorelist={scorelist}/>);
        }
    }

    useEffect(() => {
        socket.on('logging_in', (data) => {
            setLogIn(true);
            setUsername(data);
        });
    }, []);

    useEffect(() => {
        socket.on('userlist', (data) => {
            setUserlist(data);
        });
    }, []);

    useEffect(() => {
        socket.on('scores', (data) => {
            setScorelist(data);
        });
    }, []);

    return (
        <div className="app">
            <div className="game_container">
                {renderLogIn()}
                {renderUserList()}
                {renderBoard()}
            </div>
            <div className="leaderboard">
                {renderLeaderboard()}
            </div>
        </div>

    );
}

export default App;