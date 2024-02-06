import React, {useState} from "react";
import { useNavigate } from "react-router-dom"; //for frontend routing//import useNavigate

function Login(){
    const navigate = useNavigate(); //creating a constant for useNavigate(cannot be called inside a callback)

    const[cred, setCred] = useState({username:"", password:""});
    function handleChanged(event){
        const{name, value} = event.target;

        setCred((prev)=>{
            return(name==="username"?{username:value,password:prev.password}:{username:prev.username,password:value});
        });
        
    }
return(<div className="login">
    <div>
        <input name="username" placeholder="Username" value={cred.username} onChange={handleChanged}></input>
        <input name="password" placeholder="Password" value={cred.password} onChange={handleChanged}></input>
        <div>
            <div></div>
            <div className="button">
                <button onClick={()=>{
                    navigate("/Home");
                }}>Login</button>
                <button onClick={()=>{
                    navigate("/Register");
                }}>Register</button>
            </div>        
        </div>
    </div>
</div>);
}

export default Login;