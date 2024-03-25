import React, {useState, useContext} from "react";
import { Link, useNavigate } from "react-router-dom"; //for frontend routing//import useNavigate
import axios from "axios";
import Context from "./Context"
import Popup from "./popup/Popup";

function Register(){
    // axios.defaults.withCredentials = true;
    const navigate = useNavigate(); //creating a constant for useNavigate(cannot be called inside a callback)
    const data = useContext(Context);

    const[cred, setCred] = useState({username:"", password:"", rePassword:"", fname:"", lname:""});
    const[placeHold, setplaceHold] = useState(null);
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const[errMsg, setErrMsg] = useState({errMsg1:"", errMsg2:"", errMsg3:"", errMsg4:"", errMsg5:""});
    const[isError , setIsError] = useState({isError1:false, isError2:false, isError3:false, isError4:false, isError5:false});
    
    
    function handleChanged(event){
        const{name, value} = event.target;
        name == "username" && setIsError({...isError, isError1:false});
        name == "password" && setIsError({...isError, isError2:false});
        name == "rePassword" && setIsError({...isError, isError3:false});
        name == "fname" && setIsError({...isError, isError4:false});
        name == "lname" && setIsError({...isError, isError5:false});
        setCred((prev)=>{
            if(name == "username"){
                return{
                    username: value,//set input to lowercase for email 
                    password: prev.password, 
                    rePassword: prev.rePassword, 
                    fname: prev.fname, 
                    lname: prev.lname 
                };
            } else if (name == "password"){
                return{
                    username: prev.username, 
                    password: value, 
                    rePassword: prev.rePassword, 
                    fname: prev.fname, 
                    lname: prev.lname 
                };
            } else if (name == "rePassword"){
                return{
                    username: prev.username, 
                    password: prev.password, 
                    rePassword: value, 
                    fname: prev.fname, 
                    lname: prev.lname 
                };
            } else if (name == "fname"){
                return{
                    username: prev.username, 
                    password: prev.password, 
                    rePassword: prev.rePassword, 
                    fname: value, 
                    lname: prev.lname 
                };
            } else if (name == "lname"){
                return{
                    username: prev.username, 
                    password: prev.password, 
                    rePassword: prev.rePassword, 
                    fname: prev.fname, 
                    lname: value 
                };
            }
        });
    }

    async function handleClick(event){
        event.preventDefault();
            if(cred.username !="" && cred.username.match(isValidEmail) && cred.password !="" && cred.rePassword !="" && cred.fname !="" && cred.lname !=""){
                if(cred.password == cred.rePassword){
                    setplaceHold(null);
                    // document.register.submit();
                    await axios.post(`${data.URL}/Register`, {...cred, username:cred.username.toLowerCase()}, { withCredentials: true})
                    .then(res=>{
                        data.setUser(res.data);
                        res.data ? navigate("/Home") : navigate("/");
                        res.data ? data.setPopup(`Registration successful. Welcome ${res.data.fname}`) : data.setPopup(`Account already exist. Please try to log in.`)
                    });
                } else {
                    setCred((prev)=>{
                        return {
                            username: prev.username, 
                            password: "", 
                            rePassword: "", 
                            fname: prev.fname, 
                            lname: prev.lname 
                        };
                    });
                    event.preventDefault();
                    console.log("mismatch")
                    setErrMsg({...errMsg, errMsg2:"Password mismatched.", errMsg3:"Password mismatched."});
                    setIsError({...isError, isError2:true, isError3:true});
                }
            } else if (!cred.username.match(isValidEmail)){
                if (cred.username == ""){
                    setErrMsg({...errMsg, errMsg1:"Please enter your email."});
                    setIsError({...isError, isError1:true});
                } else {
                    setErrMsg({...errMsg, errMsg1:"Please enter a valid email."});
                    setIsError({...isError, isError1:true});
                }
            } else if (cred.password == "" && cred.rePassword == ""){
                console.log("pasok");
                setErrMsg({...errMsg, errMsg2:"Please enter a password.", errMsg3:"Please confirm your password."});
                setIsError({...isError, isError2:true, isError3:true});
            } else if (cred.password == ""){
                setErrMsg({...errMsg, errMsg2:"Please enter a password."});
                setIsError({...isError, isError2:true});
            } else if (cred.rePassword == ""){
                setErrMsg({...errMsg, errMsg3:"Please confirm your password."});
                setIsError({...isError, isError3:true});
            } else if (cred.fname == ""){
                setErrMsg({...errMsg, errMsg4:"Please enter your first name."});
                setIsError({...isError, isError4:true});
            } else if (cred.lname == ""){
                setErrMsg({...errMsg, errMsg5:"Please enter your last name."});
                setIsError({...isError, isError5:true});
            }
        }

return(
<div>
    <Popup />
<div className="register">
    <form id="register" name="register" onSubmit={handleClick}>
        <input className={isError.isError1 ? "error" : ""} name="username" type="text" value={cred.username} placeholder="Username" onChange={handleChanged}></input>
        {isError.isError1 ? <label className="loginLabel">{errMsg.errMsg1}</label> :""}
        <input className={isError.isError2 ? "error" : ""} name="password" type="password" value={cred.password} placeholder="Password" onChange={handleChanged}></input>
        {isError.isError2 ? <label className="loginLabel">{errMsg.errMsg2}</label> :""}
        <input className={isError.isError3 ? "error" : ""} name="rePassword" type="password" value={cred.rePassword} placeholder="Re-type password" onChange={handleChanged}></input>
        {isError.isError3 ? <label className="loginLabel">{errMsg.errMsg3}</label> :""}
        <input className={isError.isError4 ? "error" : ""} name="fname" type="text" value={cred.fname} placeholder="First Name" onChange={handleChanged}></input>
        {isError.isError4 ? <label className="loginLabel">{errMsg.errMsg4}</label> :""}
        <input className={isError.isError5 ? "error" : ""} name="lname" type="text" value={cred.lname} placeholder="Last Name" onChange={handleChanged}></input>
        {isError.isError5 ? <label className="loginLabel">{errMsg.errMsg5}</label> :""}
    <div>
            <div></div>
            <div className="button">
                <button type="submit">Register</button>
                <Link to="/"><button>Cancel</button></Link>
            </div>        
        </div>
    </form>
</div>
</div>);
}

export default Register;