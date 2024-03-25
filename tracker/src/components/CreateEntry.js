import React, {useState} from "react";
//below imports is use to accept/received data from the parent components
import {useContext, useEffect} from "react";
import Context from "./Context"

function CreateEntry(){
    const date = new Date();
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    const myContext = useContext(Context);
    
    const [displayDate, setDisplayDate] = useState(`${month+1<10?`0${month+1}`:month+1}/${day<10?`0${day}`:day}/${year}`);
    // const [displayDate, setDisplayDate] = useState(`${year}/${month+1<10?`0${month+1}`:month+1}/${day<10?`0${day}`:day}`);
    const [data, setData] = useState({entry_id: myContext.id, date:displayDate, merchant:"", amount:""});
    const[errMsg, setErrMsg] = useState({errMsg1:"", errMsg2:"", errMsg3:""});
    const[isError , setIsError] = useState({isError1:false, isError2:false, isError3:false});

//Check Home.js for the value of Context that is being pass in CreateEntry.js
    useEffect(()=>{
        let process = true;
        fetchDate(process);//executing/calling fetchDate and passing the process as true
        return ()=>{//set the process to false after fetchDate was executed
            process = false;//to stop executing continuously
        }
    },[]);

/////////////////////////////////////////////////////////
const isnumber = !isNaN(data.amount.replace(/,/g,""));
const noSpace = data.merchant.replace(/\s/g, "");
const dateFormat = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(data.date);

    const myDate = data.date.split("/");
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
///////////////////////////////////////////

    function fetchDate(isTrue){//set the currentDate if "TRUE" month + 1 January value is = 0
//DD/MM/YY is the default formart of postgresql for date so we need to set the date to this format
        // {isTrue && (setCurrentDate(`${day}/${month+1}/${year}`))}
//Display date will be set to MM/DD/YY        
        {isTrue && (setDisplayDate(`${month+1<10?`0${month+1}`:month+1}/${day<10?`0${day}`:day}/${year}`))}
        // {isTrue && (setDisplayDate(`${year}/${month+1<10?`0${month+1}`:month+1}/${day<10?`0${day}`:day}`))}
    }
    
    function handleChange(event){
        const{value, name} = event.target; //destructure the value of event{event is an object} and create a variable 
        //for (event.target.name and event.target.value)
        name === "date" && setIsError({...isError, isError3:false});
        name === "merchant" && setIsError({...isError, isError1:false});
        name === "amount" && setIsError({...isError, isError2:false});
            setData((prev)=>{//pass the prev value of data
                //return an object base below to be use in setData() above
                if (name === "merchant"){return {entry_id:prev.entry_id, date:prev.date, merchant:value, amount:prev.amount}}
                else if (name === "amount"){return {entry_id:prev.entry_id, date:prev.date, merchant:prev.merchant, amount:value.trim()}}                    
                else if (name === "date"){return {entry_id:prev.entry_id, date:value.trim(), merchant:prev.merchant, amount:prev.amount}}
                //Here dont use the && for if statement                    
            });
    }
    return(
        <div className="createEntry">
            <label className={isError.isError3 && data.date ? "errorPlaceholder" : ""}>{isError.isError3 && data.date ? errMsg.errMsg3 : "Date"}</label>
            <label className={isError.isError1 && !noSpace && data.merchant ? "errorPlaceholder" : ""}>{isError.isError1 && !noSpace && data.merchant ? errMsg.errMsg1 : "Merchant"}</label>
            <label className={isError.isError2 && data.amount != "" ? "errorPlaceholder" : ""}>{isError.isError2 && data.amount != "" ? errMsg.errMsg2 : "Amount"}</label>
            <input className={isError.isError3 ? "error errorPlaceholder" : ""} type="text" name="date" placeholder={isError.isError3 && !data.date ? errMsg.errMsg3 : "Date"} value={data.date} onChange={handleChange} ></input>
            <input className={isError.isError1 ? "error errorPlaceholder" : ""} type="text" name="merchant" placeholder={isError.isError1 ? errMsg.errMsg1 : "Merchant"} value={data.merchant} onChange={handleChange} ></input>
            <input className={isError.isError2 ? "error errorPlaceholder" : ""} type="text" name="amount" placeholder={isError.isError2 ? errMsg.errMsg2 : "Amount"} value={data.amount} onChange={handleChange} ></input>
            {/*function received from parent should be put inside a function
            so it will only execute once a click/event was triggered onClick={()=>{myContext.onAdd("Data")}} */}
            <button type="button" onClick={(event)=>{
                event.preventDefault();
                if(data.amount.replace(/,/g,"") && data.date && data.merchant && isnumber && isDate && dateFormat && noSpace){
                    myContext.onAdd({...data, amount:data.amount.replace(/,/g,"")});
                    setData({entry_id: `${myContext.id}`, date:"", merchant:"", amount:""});
                } else if (!data.date){
                    setIsError({...isError, isError3:true})
                    setErrMsg({...errMsg, errMsg3:"Please enter the date: MM/DD/YYYY"})
                } else if (!isDate || !dateFormat){
                    setIsError({...isError, isError3:true})
                    setErrMsg({...errMsg, errMsg3:"Please enter a valid date/format: MM/DD/YYYY"})
                } else if (data.merchant == ""){
                    setIsError({...isError, isError1:true})
                    setErrMsg({...errMsg, errMsg1:"Please fill out this field:"})
                } else if (!noSpace){
                    setIsError({...isError, isError1:true});
                    setErrMsg({...errMsg, errMsg1:"Please don't leave merchant field blank:"});
                } else if (isnumber == false){
                    setIsError({...isError, isError2:true})
                    setErrMsg({...errMsg, errMsg2:"Please enter a valid amount:"})
                } else if (!data.amount.replace(/,/g,"")){
                    setIsError({...isError, isError2:true})
                    setErrMsg({...errMsg, errMsg2:"Please enter the amount:"})
                }
                //.replace(/,/g,"")

                // event.preventDefault();
            }}>Add</button>
        </div>
    );
}

export default CreateEntry;
