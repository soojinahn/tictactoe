import React from 'react';
import { useState, useEffect } from 'react';
import socket from './Board.js';

export function Leaderboard(props) {
    const [showBoard, setShow] = useState(false);
    const {scorelist} = props;

    function renderLeaderboard() {
        if(showBoard) {
            console.log("i am in leaderboard")
            const users = scorelist[0]
            const scores = scorelist[1]
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

    return (
        <div>
            <button onClick={()=> setShow(!showBoard)}>Show/Hide Leaderboard</button>
            {renderLeaderboard()}
        </div>
    )

}