import React from 'react';
import { useState, useEffect } from 'react';
import { Board } from './components/Board.js';
import './components/Board.css';

function App() {

    function renderBoard() {
        return (
            <div>
                <Board />
            </div>
        )
    }

    return (
        <div className="container">
            {renderBoard()}
        </div>
    );
}

export default App;