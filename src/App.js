import React from 'react';
import { useState, useEffect } from 'react';
import { Board } from './components/Board.js';
import { LogIn } from './components/LogIn.js';
import './components/Board.css';
import socket from './components/Board.js';

function App() {

    const [isLoggedIn, setLogIn] = useState(false);
    const [username, setUsername] = useState("");
    const [userlist, setUserlist] = useState({"X":"", "O":"", "spectators": []});
    const [leaderboard, setLeaderboard] = useState(null);
    let playerX, playerO, isSpect;
    let spectators = "";

    function renderBoard() {
        if(isLoggedIn) {
            isSpect = userlist["spectators"].includes(username) ? true:false;
            return (
                <div>
                    <Board username={username} playerX={playerX} playerO={playerO} isSpect={isSpect}/>
                </div>
            )
        }
    }

    function renderLogIn() {
        if (!isLoggedIn) {
            return (<LogIn />);}
    }
    
    function renderUserList() {
        if(isLoggedIn) {
            playerX = userlist.X;
            playerO = userlist.O;
            spectators = userlist.spectators.map(each => spectators + " " + each);

            return (
                <div class="userlist">
                    <h1>{username}'s Tic Tac Toe</h1>
                    <h2>Player X: {playerX}</h2>
                    <h2>Player O: {playerO}</h2>
                    <h3>Spectators: {spectators}</h3>
                </div>
            )
        }
    }

    function renderLeaderboard() {
        if(isLoggedIn) {
            const users = leaderboard[0]
            const scores = leaderboard[1]
            const table_data = users.map((value, index) => {
                const score = scores[index]
                return (
                    <tr key={index}>
                        <td>{value}</td>
                        <td>{score}</td>            
                    </tr>
                )
            });
            return (
                <div>
                    <table class="leaderboard">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>{table_data}</tbody>
                    </table>
                </div>
            );
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
        socket.on('leaderboard', (data) => {
            setLeaderboard(data);
        });
    }, []);

    return (
        <div className="container">
            {renderLogIn()}
            {renderUserList()}
            {renderBoard()}
            {renderLeaderboard()}
        </div>
    );
}

export default App;