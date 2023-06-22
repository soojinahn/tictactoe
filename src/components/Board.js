import React from 'react';
import { Square } from './Square.js';
import { useState, useCallback } from 'react';

export function Board(user){
    const [myBoard, setBoard] = useState(Array(9).fill(null));
    const [currentTurn, setCurrentTurn] = useState(1);
    const winner = calculateWinner(myBoard);

    //짝수일때 O의 차례. 아님 X차례
    const currentTurnValue = currentTurn % 2 === 0 ? 'O':'X';
    const gameHasWinner = winner != null;
    const isBoardFull = myBoard.every(cell => cell != null);

    function renderSquare(index) {
        return <Square value={myBoard[index]} onClick={() => clickSquare(index)} index={index}/>;
    }

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

    function getStatus() {
        if(winner) {
            if(winner === 'X') { return ("Winner is X"); }
            return ("Winner is O");
        }
        else if(isBoardFull) { return ("Draw");}
        else{ return ("Next Player: " + currentTurnValue);}
    }

    function resetBoard() {
        setBoard(Array(9).fill(null));
    }

    const clickSquare = useCallback((index) => {
        if(!myBoard[index] && !gameHasWinner && !isBoardFull) { //게임에 룰에 따라 click 허용
            const newBoard = myBoard.slice();
            newBoard[index] = currentTurnValue;
            setBoard(newBoard);
            setCurrentTurn(prevTurn => prevTurn + 1);
        }
    }, [myBoard, setBoard]);

    return (
        <div>
            <h2>{getStatus()}</h2>
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
            <button className="resetButton" onClick={resetBoard}>Reset Board</button>
        </div>
    );
}