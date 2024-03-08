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
    async function handleFB(){
        await axios.get(`${data.URL}/auth/facebook`, { headers: data.myHeader })
    }
    async function handleClick(event){
        const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
            if(cred.username && cred.username.length && cred.username.match(isValidEmail)){
                event.preventDefault();
                // document.login.submit();
                // { withCredentials: true } is needed to set in axios, to be able send cookies back to server for deserialize
                await axios.post(`${data.URL}/Login`, {username:cred.username.toLowerCase(), password:cred.password},  { headers: data.myHeader })
                        .then(res=>{
                            const {user_email, password, notFound} = res.data;
                            // console.log(`data received:`);
                            // console.log(res.data);
                            if (user_email){ 
                                data.fetchYear();//Get the year record in database before setting user a value(before granting access/navigating to home)
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

return(
    <div className="login">
    <form id="login" name="login" className="login" onSubmit={handleClick} >
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
</form>
        <span className="vr"><label>or</label></span>
    <div>
        <form>
    {/* <a href={`${process.env.REACT_APP_API_URL}auth/google`} ></a> */}
    <button name="google" className="btn btn-lg btn-block btn-primary" style={{backgroundColor: "#dd4b39"}}
        // type="submit" formMethod="get" formAction="http://localhost:4000/auth/google"><i className="fab fa-google me-2"></i>Sign in with google</button>
        // type="button"><i className="fab fa-google me-2"></i><a href="http://localhost:4000/auth/google">Sign in with google</a></button>
        type="button"><i className="fab fa-google me-2"></i><a href="https://project-tracker-server-h8ni.onrender.com/auth/google">Sign in with google</a></button>
    <button name="facebook" className="btn btn-lg btn-block btn-primary mb-2" style={{backgroundColor: "#3b5998"}}
        // type="submit" formMethod="get" formAction="http://localhost:4000/auth/facebook"><i className="fab fa-facebook-f me-2"></i>Sign in with facebook</button>
        // type="button"><i className="fab fa-google me-2"></i><a href="http://localhost:4000/auth/facebook">Sign in with facebook</a></button>
        type="button"><i className="fab fa-facebook-f me-2"></i><a href="https://project-tracker-server-h8ni.onrender.com/auth/facebook">Sign in with facebook</a></button>
        </form>
    </div>  
</div>
);
}

export default Login;