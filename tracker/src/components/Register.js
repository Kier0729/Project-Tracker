import React from "react";
import { useNavigate } from "react-router-dom"; //for frontend routing//import useNavigate

function Register(){
    const navigate = useNavigate(); //creating a constant for useNavigate(cannot be called inside a callback)

return(<div className="register">
    <div>
        <input placeholder="Username"></input>
        <input placeholder="Password"></input>
        <input placeholder="Re-Enter Password"></input>
        <input placeholder="First Name"></input>
        <input placeholder="Last Name"></input>
    <div>
            <div></div>
            <div className="button">
                <button onClick={()=>{
                    navigate("/Home");
                }}>Register</button>
                <button onClick={()=>{
                    navigate("/");
                }}>Cancel</button>
            </div>        
        </div>
    </div>
</div>);
}

export default Register;