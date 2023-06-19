import React from 'react';

//passing data through props as parameters since displaying X/O is conditional
export function Square(props) {
    return <button className="square" onClick={() => {props.onClick(props.index)}}> {props.value} 
        </button>
}

export default Square;