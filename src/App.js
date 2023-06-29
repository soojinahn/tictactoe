import React from 'react';
import { useState, useEffect } from 'react';
import { Board } from './components/Board.js';
import { LogIn } from './components/LogIn.js';
import './components/Board.css';
import socket from './components/Board.js';

function App() {

    const [isLoggedIn, setLogIn] = useState(false);

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

    useEffect(() => {
        socket.on('logging_in', (data) => {
            setLogIn(true);
        });
    }, []);

    return (
        <div className="container">
            {renderLogIn()}
            {renderBoard()}
            {logout()}
        </div>
    );
}

export default App;