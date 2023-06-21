import React from 'react';
import { Square } from './Square.js';
import { useState, useCallback } from 'react';

export function Board(){
    const [myBoard, setBoard] = useState(Array(9).fill(null));
    const [currentTurn, setCurrentTurn] = useState(1); //X starts game

    //If even, turn is O. If not, turn is X
    const currentTurnValue = currentTurn % 2 === 0 ? 'O':'X';

    function renderSquare(index) {
        return <Square value={myBoard[index]} onClick={() => clickSquare(index)} index={index}/>;
    }

    const clickSquare = useCallback((index) => {
        if(!myBoard[index]) { //if Square is empty, or NULL
            const newBoard = myBoard.slice();
            newBoard[index] = currentTurnValue;
            setBoard(newBoard);
            setCurrentTurn(prevTurn => prevTurn + 1);
        }
    }, [myBoard, setBoard]);


    return (
        <div>
            <div className="board">
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