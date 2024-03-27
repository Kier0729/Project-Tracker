import React, {useContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Context from "../Context";
import axios from "axios";
import "./changePass.css"


function ResetPassword(){
    const data = useContext(Context);
    const navigate = useNavigate();

    const [listUser, setListUser] = useState("")
    const [selected, setSelected] = useState("")
    const [cred, setCred] = useState({adminPass:"", newPass:"", conPass:""})
    const[errMsg, setErrMsg] = useState({errMsg1:"", errMsg2:"", errMsg3:"", errMsg4:""})
    const[isError, setIsError] = useState({isError1:false, isError2:false, isError3:false, isError4:false})
    const[onNotif, setOnNotif] = useState(false)
    const[notif, setNotif] = useState("")

    async function fetchAll(){
        await axios.get(`${data.URL}/fetchAdmin`,{ withCredentials: true  }).then(
            res=>{
                setListUser(res.data.listUser)
            }
        );
    }

    useEffect(()=>{
        fetchAll();
    },[]);

    function handleChange(event){
        const name = event.target.name;
        if(name == "accounts"){
            setSelected(event.target.value)
            setIsError({...isError, isError3:false})
            setErrMsg({...errMsg, errMsg3:""})
            setNotif("")
        } 
        else if(name == "newPass"){
            setCred({...cred, newPass:event.target.value})
            setIsError({...isError, isError1:false, isError2:false})
            setErrMsg({...errMsg, errMsg1:"", errMsg2:""})
            setNotif("")
        }
        else if(name == "conPass"){
            setCred({...cred, conPass:event.target.value})
            setIsError({...isError, isError1:false, isError2:false})
            setErrMsg({...errMsg, errMsg1:"", errMsg2:""})
            setNotif("")
        } else if(name == "adminPass"){
            setCred({...cred, adminPass:event.target.value})
            setIsError({...isError, isError4:false})
            setErrMsg({...errMsg, errMsg4:""})
        }
    }

    function handleClick(){
        const confirm = selected && document.getElementsByName(selected)[0].id;
        if(!selected){setIsError({...isError, isError3:true}); setErrMsg({...errMsg, errMsg3:"Please select an account:"});}
        else if(!cred.newPass){setIsError({...isError, isError1:true}); setErrMsg({...errMsg, errMsg1:"Please fill out this field:"});}
        else if(!cred.conPass){setIsError({...isError, isError2:true}); setErrMsg({...errMsg, errMsg2:"Please fill out this field:"});}
        else if(cred.newPass != cred.conPass){
            setIsError({...isError, isError1:true, isError2:true}); setErrMsg({...errMsg, errMsg1:"Password mismatched:", errMsg2:"Password mismatched:"});
        } else if(confirm == "google" || confirm == "facebook"){
            setIsError({...isError, isError3:true}); setErrMsg({...errMsg, errMsg3:`This is a ${confirm} account:`});
        } else if(selected && cred.newPass && cred.conPass && cred.newPass == cred.conPass && confirm != "google" || confirm != "facebook"){
            setOnNotif(true)
        }
    }
    async function handleConfirm(){
        // setOnNotif(false)
        const confirm = selected && document.getElementsByName(selected)[0].innerHTML;
        if(cred.adminPass){
            
            if((confirm.toLowerCase()).replace(/\s/g, '') == (cred.adminPass.toLowerCase()).replace(/\s/g, '')){
                const result = await axios.post(`${data.URL}/ResetPassword`, {id:selected, password:cred.newPass}, {withCredentials:true})
                if(result.data == "Success"){
                    setNotif("Password updated!")
                    setOnNotif(false)
                } else {
                    setNotif("Updating password failed!")
                }
            } else {
                setIsError({...isError, isError4:true}); 
                setErrMsg({...errMsg, errMsg4:`Input mismatched. Please enter: ${confirm}`});
            }
        }
        else if(!cred.adminPass){
            setIsError({...isError, isError4:true}); 
            setErrMsg({...errMsg, errMsg4:`To confirm changes. Please enter: ${confirm}`});
        }
        
        // setNotif("Password saved.")
    }


    return(
        <div className="reset-password">
            <label>{notif}</label>
            <div>
            {console.log()}
            <div className="reset-password-inner">
            <label htmlFor="accounts">{errMsg.errMsg3 || "Account to modify:"}</label>
            <select className={isError.isError3 ? "error" : ""} name="accounts" id="accounts" value={selected || "default"} onChange={handleChange}>
            <option value="default" disabled hidden>List of accounts</option>
            {listUser && listUser.map((items, index)=>{
                return(
                !items.admin && <option key={index} id={items.user_pass} name={items.id} value={items.id}>{items.fname} {items.lname}</option>
                );
            })}
            </select>
            <label>{errMsg.errMsg1 || "New password:"}</label>
            <input className={isError.isError1 ? "error" : ""} name="newPass" value={cred.newPass} onChange={handleChange}></input>
            
            <label>{errMsg.errMsg2 || "Confirm password:"}</label>
            <input className={isError.isError2 ? "error" : ""} name="conPass" value={cred.conPass} onChange={handleChange}></input>
            </div>

            <div className="btn-container">
            <button onClick={handleClick}>Save Password</button>
            <button>Delete Account</button>
            <button onClick={()=>navigate("/Home")}>Back</button>
            </div>

            </div>
            {onNotif && <div className="notif">
                <div>
                <label htmlFor="password">{errMsg.errMsg4 || `To confirm the update, please re-type: ${selected && document.getElementsByName(selected)[0].innerHTML}`}</label>
                <input className={isError.isError4 ? "error" : ""} name="adminPass" value={cred.adminPass} onChange={handleChange}></input>
                <button onClick={handleConfirm}>Confirm</button>
                <button onClick={()=>setOnNotif(false)}>Back</button>
                </div>
            </div>}
        </div>
    );
}

export default ResetPassword;