import React from 'react';
import { Square } from './Square.js';
import { useState } from 'react';

export function Board(user){
    const [myBoard, setBoard] = useState(Array(9).fill(null));

    function renderSquare(index) {
        return <Square value={myBoard[index]} index={index}/>;
    }

    return (
        <div>
            <div class="board">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
}