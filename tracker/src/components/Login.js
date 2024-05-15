import axios from "axios";
import React, {useState, useContext} from "react";
import { useNavigate, Link } from "react-router-dom"; //for frontend routing//import useNavigate
import Context from "./Context";
import Popup from "./popup/Popup";

function Login(){
    // axios.defaults.withCredentials = true;
    const navigate = useNavigate(); //creating a constant for useNavigate(cannot be called inside a callback)
    const data = useContext(Context);
    const[cred, setCred] = useState({username:"", password:""});
    const[errMsg, setErrMsg] = useState(null);
    const[errMsg2, setErrMsg2] = useState(null);
    const[isError , setIsError] = useState(false);
    const[isError2 , setIsError2] = useState(false);
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    function handleChanged(event){
        const{name, value} = event.target;
        // name ==="username" && value.match(isValidEmail) ? setIsError(false) : setIsError(true);
        name==="username" && setIsError(false);
        name==="password" && setIsError2(false);
        setCred((prev)=>{
            return(name==="username"?{username:value,password:prev.password}:{username:prev.username,password:value});
        });
    }

    function handleSocialLog(){
        axios.post(`${data.URL}/SocPop`, {socPop:true}, { withCredentials: true, });
    }

    async function handleClick(event){
        event.preventDefault();
            if(cred.username && cred.password && cred.username.length && cred.username.match(isValidEmail)){
                // document.login.submit();
                // { withCredentials: true } is needed to set in axios, to be able send cookies back to server for deserialize
                await axios.post(`${data.URL}/Login`, {username:cred.username.toLowerCase(), password:cred.password},  { withCredentials: true, })
                        .then(res=>{
                            const {user_email, password, notFound} = res.data;
                            if (user_email){ 
                                data.setUser(res.data);
                                data.fetchUser();//to make some update after login
                                navigate("/Home");
                                data.setPopup(`Login Successful. \nWelcome ${res.data.fname}.`);
                            } else if(password){
                                setCred((prev)=>{return{username:prev.username, password:""}});
                                setErrMsg2("Password Incorrect!");
                                setIsError2(true);
                                // data.setPopup(`Your password entry appears to be incorrect. \nPlease try again.`);
                            } if(notFound){
                                data.setUser(null);
                                setCred({username:"", password:""});
                                setErrMsg("");
                                data.setPopup(`User does not exist. \nTo log in, you have to register first.`);
                                navigate("/Register");
                            }
                        });
            } else if (cred.username == ""){
                setErrMsg("Please enter email.");
                setIsError(true);
                setCred((prev)=>{return {username:"", password:prev.password}});
                if(cred.password == ""){
                    setErrMsg2("Enter your password.");
                    setIsError2(true);
                }
            } else if (!cred.username.match(isValidEmail)){
                setErrMsg("Enter a valid email.");
                setIsError(true);
            } else if (cred.password == ""){
                setErrMsg2("Enter your password.");
                setIsError2(true);
                if(cred.username == ""){
                    setErrMsg("Please enter email.");
                    setIsError(true);
                }
            }
    }

return(
    <div>
        <Popup />
        <h5 className="myh5">Please attempt to log in repeatedly until the database and server load.</h5>
        <h5 className="myh5">(It takes an average of 15-30secs due to free account used)</h5>
    <div className="login">
    <form id="login" name="login" className="login" onSubmit={handleClick} >
    <div>
        <input type="text" className={isError ? "error" : ""} name="username" placeholder="Username" value={cred.username} onChange={handleChanged}></input>
        {isError ? <label className="loginLabel">{errMsg}</label> :""}
        <input type="password" className={isError2 ? "error" : ""} name="password" placeholder="Password" value={cred.password} onChange={handleChanged}></input>
        {isError2 ? <label className="loginLabel">{errMsg2}</label> :""}
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
</form>
        <span className="vr"><label>or</label></span>
    <div>
        <form className="socialLogin">
    <Link to={`${process.env.REACT_APP_API_URL}/auth/google`}>
    <button name="google" className="btn btn-lg btn-block btn-primary" style={{backgroundColor: "#dd4b39"}}
    type="button" onClick={handleSocialLog}><i className="fab fa-google me-2"></i>Sign in with google</button>
    </Link>
    <Link to={`${process.env.REACT_APP_API_URL}/auth/facebook`}>
    <button name="facebook" className="btn btn-lg btn-block btn-primary mb-2" style={{backgroundColor: "#3b5998"}}
    type="button" onClick={handleSocialLog}><i className="fab fa-facebook-f me-2"></i>Sign in with facebook</button>
    </Link>
        </form>
    </div>  
</div>
</div>
);
}

export default Login;