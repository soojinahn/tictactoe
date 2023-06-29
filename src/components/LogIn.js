import React from 'react';
import { useRef } from 'react';
import socket from './Board.js';

export function LogIn(){
  
    const inputRef = useRef(null);
    
    function processLogIn(){
        if(inputRef.current.value){
            const userName = inputRef.current.value;
            socket.emit('logging_in', { userName: userName });
        }
    }
    
    function logInScreen(){
        return( 
            <div class='login'>
            <h2>Log In</h2>
            <input type='text' ref={inputRef}/>
            <button type='submit' onClick={processLogIn}>Log In</button>
            </div>
            );
    }
  
  return logInScreen();

}