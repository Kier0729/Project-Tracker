import React, { useContext, useState } from "react";
import Context from "../Context";
import {useNavigate} from "react-router-dom";
import "./changePass.css"
import axios from "axios";

function ChangePass(){
    const data = useContext(Context);
    const[cred, setCred] = useState({password:"", newPassword:"", conPassword:""});
    const[errMsg, setErrMsg] = useState({errMsg1:"", errMsg2:"", errMsg3:""});
    const[isError , setIsError] = useState({isError1:false, isError2:false, isError3:false});

    const navigate = useNavigate();

    async function handleClick(){
        console.log(data)
        if(!cred.password) {
            setErrMsg({...errMsg, errMsg1:"Please fill out this field."})
            setIsError({...isError, isError1:true})
        } else if(cred.newPassword && cred.conPassword && cred.newPassword != cred.conPassword){
            setErrMsg({...errMsg, errMsg2:"Password mismatched.", errMsg3:"Password mismatched."});
            setIsError({...isError, isError2:true, isError3:true})
        } else if (cred.newPassword && cred.conPassword && cred.newPassword == cred.conPassword){
            if(cred.password){
                const response = await axios.post(`${data.URL}/ChangePass`, {password:cred.password, newPassword:cred.newPassword}, { withCredentials: true});
                if(response.data == "Pass"){
                    data.setPopup(`New password saved.`)
                    navigate("/Home")
                } else {
                    setErrMsg({...errMsg, errMsg1:"Old password mismatched."})
                    setIsError({...isError, isError1:true})
                }
            }
        } else if (!cred.newPassword) {
            setErrMsg({...errMsg, errMsg2:"Please fill out this field."})
            setIsError({...isError, isError2:true})
        } else if (!cred.conPassword){
            setErrMsg({...errMsg, errMsg3:"Please fill out this field."})
            setIsError({...isError, isError3:true})
        }
        
    }

    function handleChange(event){
        const {name, value} = event.target;
        if(name == "currPass"){ 
            setCred({...cred, password:value});
            setErrMsg({...errMsg, errMsg1:""});
            setIsError({...isError, isError1:false});
        }
        if(name == "newPass"){ 
            setCred({...cred, newPassword:value});
            setErrMsg({...errMsg, errMsg2:"", errMsg3:""});
            setIsError({...isError, isError2:false, isError3:false});
        }   
        if(name == "conPass"){
            setCred({...cred, conPassword:value});
            setErrMsg({...errMsg, errMsg2:"", errMsg3:""});
            setIsError({...isError, isError2:false, isError3:false});
        }
    }

    return(
        <div className="change-pass">
            <div className="change-pass-inner">

            <label htmlFor="currPass">Current Password</label>
            <input className={isError.isError1 ? "error" : ""} type="password" id="currPass" name="currPass" value={cred.password} onChange={handleChange}></input>
            {isError.isError1 ? <label className="loginLabel">{errMsg.errMsg1}</label> :""}

            <label htmlFor="newPass">New Password</label>
            <input className={isError.isError2 ? "error" : ""} type="password" id="newPass" name="newPass" value={cred.newPassword} onChange={handleChange}></input>
            {isError.isError2 ? <label className="loginLabel">{errMsg.errMsg2}</label> :""}
            
            <label htmlFor="conPass">Confirm Password</label>
            <input className={isError.isError3 ? "error" : ""} type="password" id="conPass" name="conPass" value={cred.conPassword} onChange={handleChange}></input>
            {isError.isError3 ? <label className="loginLabel">{errMsg.errMsg3}</label> :""}
            
            </div>
            <div className="btn-container">
                <button onClick={handleClick}>Save</button>
                <button onClick={()=>{navigate("/Home")}}>Back</button>
            </div>
        </div>
    );
}

export default ChangePass;