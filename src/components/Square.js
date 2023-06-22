import React from 'react';

//Props를 써서 필요할때만 배열(X 아님 O)을 읽는다
export function Square(props) {
    return <button className="square" onClick={() => {props.onClick(props.index)}}> {props.value} 
        </button>
}

export default Square;