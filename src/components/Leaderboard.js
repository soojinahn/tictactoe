import React from 'react';
import { useState } from 'react';

export function Leaderboard(props) {
    const [showBoard, setShow] = useState(false);
    const {scorelist} = props;

    function renderLeaderboard() {
        if(showBoard) {
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
                    <table className="leaderboard_table">
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
            <div className="button-container">
                <button className="leaderboard-button" onClick={()=> setShow(!showBoard)}>Show/Hide Leaderboard</button>
            </div>
            {renderLeaderboard()}
        </div>
    )

}