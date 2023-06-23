import React from 'react';
import { useRef } from 'react';

export function LogIn(){
  
    const inputRef = useRef(null);
    
    function userLogIn(){
      if(inputRef != null){
        const userName = inputRef.current.value;
      }
    }
    
    function logInScreen(){
      return( 
        <div class='login'>
          <h2>Log In</h2>
          <input ref={inputRef} type='text' />
          <button onClick={userLogIn}>Log In</button>
        </div>
        );
    }
  
  return logInScreen();

}