import React from 'react';
import { useRef } from 'react';
import socket from './Board.js';

export function LogIn(props){
  
    const inputRef = useRef(null);

    function processLogIn(){
        if(inputRef.current.value){
            const username = inputRef.current.value;
            socket.emit('logging_in', { username: username });
        }
    }
    
    function logInScreen(){
        return( 
            <div class='login'>
            <h2>Log In</h2>
            <input placeholder='Enter username' type='text' ref={inputRef}/>
            <button type='submit' onClick={processLogIn}>Log In</button>
            </div>
            );
    }
  
  return logInScreen();

}