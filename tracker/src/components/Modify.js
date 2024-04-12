import React, { useState, useContext, useEffect } from "react";
//below imports is use to accept/received data from the parent components
import Context from "./Context"
import { useNavigate } from "react-router-dom"; //for frontend routing//import useNavigate
import axios from "axios";

function Modify(){
    const data = useContext(Context); //passing the data received
    const navigate = useNavigate(); //creating a constant for useNavigate(cannot be called inside a callback)
    const[errMsg, setErrMsg] = useState({errMsg1:"", errMsg2:"", errMsg3:""});
    const[isError , setIsError] = useState({isError1:false, isError2:false, isError3:false});

    const [modify, setModify] = useState({
        id:data.selectedItem.id,
        date:data.selectedItem.date,
        merchant:data.selectedItem.merchant,
        amount:data.selectedItem.amount,
        fname:data.selectedItem.fname,
    });
    const isnumber = !isNaN(modify.amount.replace(/,/g,""));
    const noSpace = modify.merchant.replace(/\s/g, "");
    const dateFormat = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(modify.date);

    const myDate = modify.date.split("/");
    const myMonth = myDate[0];
    const myDay = myDate[1];
    const myYear = myDate[2];
    const isDate = createDate();
    function createDate() {
        var d = new Date(`${myMonth}/${myDay}/${myYear}`);
        if ( d.getMonth() != myMonth - 1
          || d.getDate() != myDay
          || d.getFullYear() != myYear) {
          return null;
        }
        return d;
      }

    async function postSelectedItem(receieved){
        const result = await axios.post(`${process.env.REACT_APP_API_URL}/postSelectedItem`, {receieved}, { withCredentials: true }/*, options*/);    
//IF THE APP PAUSE, MAYBE IT IS WAITING A RESPONSE FOR THE AWAIT. CHECK THE SERVER IF IT IS SENDING BACK A RESPONSE
    }

    useEffect(()=>{       
        axios.post(`${process.env.REACT_APP_API_URL}/postSelectedItem`, {modify}, { withCredentials: true }/*, options*/);    
    },[]);
    
    function handleChange(event){
        event.target.name==="date" && setIsError({...isError, isError1:false})
        event.target.name==="merchant" && setIsError({...isError, isError2:false})
        event.target.name==="amount" && setIsError({...isError, isError3:false})

        setModify((prev)=>{
            if(event.target.name==="date"){
                return({
                    id:prev.id,
                    fname:prev.fname,
                    date:event.target.value.trim(),
                    merchant:prev.merchant,
                    amount:prev.amount,
                });
            }
            if(event.target.name==="merchant"){
                return({
                    id:prev.id,
                    fname:prev.fname,
                    date:prev.date,
                    merchant:event.target.value,
                    amount:prev.amount,
                });
            }
            if(event.target.name==="amount"){
                return({
                    id:prev.id,
                    fname:prev.fname,
                    date:prev.date,
                    merchant:prev.merchant,
                    amount:event.target.value.trim(),
                });
            }
        }  
        )}

    return(
        <div className="modify" >
            <div style={modify.fname && {gridTemplateColumns: `repeat(4, 1fr)`}}>
            {modify.fname && <label name="fname" >{modify.fname}</label>}
            <label className={isError.isError1 && modify.date ? "errorPlaceholder" : ""}>{isError.isError1 && modify.date ? errMsg.errMsg1 : "Date"}</label>
            <label className={isError.isError2 && !noSpace && modify.merchant ? "errorPlaceholder" : ""}>{isError.isError2 && !noSpace && modify.merchant ? errMsg.errMsg2 : "Merchant"}</label>
            <label className={isError.isError3 && modify.amount ? "errorPlaceholder" : ""}>{isError.isError3 && modify.amount != "" ? errMsg.errMsg3 : "Amount"}</label>
            <input className={isError.isError1 ? "error errorPlaceholder" : ""} name="date" value={modify.date} placeholder={isError.isError1 ? errMsg.errMsg1 : "Date"} onChange={handleChange} style={modify.fname && {gridColumnStart: `2`, gridColumnEnd: `3`}} ></input>
            <input className={isError.isError2 ? "error errorPlaceholder" : ""} name="merchant" value={modify.merchant} placeholder={isError.isError2 ? errMsg.errMsg2 : "Merchant"} onChange={handleChange} ></input>
            <input className={isError.isError3 ? "error errorPlaceholder" : ""} name="amount" value={modify.amount} placeholder={isError.isError3 ? errMsg.errMsg3 : "Amount"} onChange={handleChange} ></input>
            </div>
            <div>
                <button onClick={()=>{
                    if(modify.date && modify.merchant && modify.amount.replace(/,/g,"") > 0 && modify.amount != 0 && isnumber && isDate && dateFormat && noSpace ){
                        data.onModify({...modify, amount: modify.amount.replace(/,/g,"")});
                        data.setSelectedItem("");
                        postSelectedItem();
                        modify.fname ? navigate("/AdminHome") : navigate("/Home");
                    } else if (!modify.date){
                        setIsError({...isError, isError1:true});
                        setErrMsg({...errMsg, errMsg1:"Please enter the date:"});
                    } else if (!isDate || !dateFormat){
                            setIsError({...isError, isError1:true});
                            setErrMsg({...errMsg, errMsg1:"Please enter a valid date/format: MM/DD/YYYY"});
                    } else if (!modify.merchant){
                        setIsError({...isError, isError2:true});
                        setErrMsg({...errMsg, errMsg2:"Please fill out this field:"});
                    } else if (!noSpace){
                        setIsError({...isError, isError2:true});
                        setErrMsg({...errMsg, errMsg2:"Please don't leave merchant field blank:"});
                    }  else if (modify.amount.replace(/,/g,"") <= 0){
                        setIsError({...isError, isError3:true});
                        setErrMsg({...errMsg, errMsg3:"Please enter a positive numeric amount:"});
                    } else if (!isnumber) {
                        setIsError({...isError, isError3:true});
                        setErrMsg({...errMsg, errMsg3:"Please enter a valid amount:"});
                    } 
                    }}>Save</button>
                <button onClick={()=>{
                    setTimeout(()=>{
                    data.onDelete(modify.id);
                    data.setSelectedItem("");
                    postSelectedItem();
                    modify.fname ? navigate("/AdminHome") : navigate("/Home");
                    }, 500);
                    }}>Delete</button>
                <button onClick={()=>{
                    setTimeout(()=>{
                    data.setSelectedItem("");
                    postSelectedItem();
                    modify.fname ? navigate("/AdminHome") : navigate("/Home");
                    }, 500);
                    }}>Back</button>
            </div>
        </div>
    );
}

export default Modify;