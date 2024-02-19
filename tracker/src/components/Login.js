import axios from "axios";
import React, {useState, useContext} from "react";
import { useNavigate, Link } from "react-router-dom"; //for frontend routing//import useNavigate
import Context from "./Context";

function Login(){
    const navigate = useNavigate(); //creating a constant for useNavigate(cannot be called inside a callback)
    const data = useContext(Context);

    const[cred, setCred] = useState({username:"", password:""});
    const[placeHold, setplaceHold] = useState(null);
    function handleChanged(event){
        const{name, value} = event.target;
        setCred((prev)=>{
            return(name==="username"?{username:value,password:prev.password}:{username:prev.username,password:value});
        });
    }
    
    async function handleClick(event){
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if(cred.username && cred.username.length && cred.username.match(isValidEmail)){
            event.preventDefault();
            // document.login.submit();
            // { withCredentials: true } is needed to set in axios, to be able send cookies back to server for deserialize
            await axios.post(`${process.env.REACT_APP_API_URL}Login`, cred,  { withCredentials: true })
                    .then(res=>{
                        const {user_email, password, notFound} = res.data;
                        // console.log(`data received:`);
                        // console.log(res.data);
                        if (user_email){ 
                            data.setUser(res.data);
                            data.axiosFetchData();
                            navigate("/Home");
                            console.log("Login Successful!");
                        } else if(password){
                            setCred((prev)=>{return{username:prev.username, password:""}});
                            setplaceHold("Password Incorrect!");
                            console.log("Password Incorrect!");
                        } if(notFound){
                            data.setUser(null);
                            setCred({username:"", password:""});
                            setplaceHold("");
                            console.log("User not exist!");
                            navigate("/Register");
                        }
                    });//
            // navigate("/Home");
        } else {
            console.log("Invalid Username!");
            setCred((prev)=>{return {username:"", password:prev.password}});
            navigate("/");
        }
    }

return(<form id="login" name="login" className="login" onSubmit={handleClick} >
    <div>
        <input type="email" name="username" placeholder="Username" value={cred.username} onChange={handleChanged} required></input>
        <input type="password" name="password" placeholder={placeHold || "Password"} value={cred.password} onChange={handleChanged} required></input>
        <div>
            <div></div>
            <div className="button">
                {/*formAction="ENDPOINT" attribute to set the endpoint the element will lead you to*/}
                <button form="login" type="submit">Login</button>
                <Link to="/Register"><button
                // onClick={()=>{  USE LINK insted of this onClick to removed form is not connected notification
                //     navigate("/Register");
                // }}
                >Register</button></Link>
            </div>        
        </div>
    </div>
</form>);
}

export default Login;