import React, { useEffect, useRef, useState } from 'react';
import Axios from 'axios'

import './Register.css';


function Register() {
    const [user, setUser] = useState({ email: "", username: "", password: "", passwordConfirm: ""});


    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        console.log(user);
        if(user.email && user.username && user.password && user.passwordConfirm) {
            Axios.post("http://127.0.0.1:8000/register", user).then(function(response) {
              console.log(response);
            //   localStorage.setItem("token", response.data.token);
            //   localStorage.setItem("username", user.username);
            //   loginNavHandler();
            //   navigate('../dashboard');
            }).catch(function (error) {
              if (error.response) {
                alert(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              }
            });
          }
          else {
            alert("Fill in all fields");
          }  
    }

    return(
        <div id="registerWrapper">
            <div id='formWrapper'>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tr>
                        <td><label>Email: </label></td>
                        <td><input className='formInput' id ="email" name = "email" type="text" autoComplete="off" onChange={e => setUser({...user, email: e.target.value})}></input></td>
                        </tr>
                        <tr>
                        <td><label>Username: </label></td>
                        <td><input className='formInput' id ="username" name = "username" type="text" autoComplete="off" onChange={e => setUser({...user, username: e.target.value})}></input></td>
                        </tr>
                        <tr>
                        <td><label>Password: </label></td>
                        <td><input className='formInput' id ="password" name = "password" type="text" autoComplete="off" onChange={e => setUser({...user, password: e.target.value})}></input></td>
                        </tr>
                        <tr>
                        <td><label>Confirm Password: </label></td>
                        <td><input className='formInput' id ="passwordConfirm" name = "passwordConfirm" type="text" autoComplete="off" onChange={e => setUser({...user, passwordConfirm: e.target.value})}></input></td>
                        </tr>
                    </table>
                    <button id="formSubmitButton" type="submit">Submit</button>
                </form>
            </div>
        </div>
    )

}

export default Register;
