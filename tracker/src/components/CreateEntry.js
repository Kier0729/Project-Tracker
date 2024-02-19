import React, {useState} from "react";
//below imports is use to accept/received data from the parent components
import {useContext, useEffect} from "react";
import Context from "./Context"

function CreateEntry(){
    const date = new Date();
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    
    const [data, setData] = useState({entry_id: "", date:"", merchant:"", amount:""});
    const [currentDate, setCurrentDate] = useState(`${day}/${month}/${year}`);
    const [displayDate, setDisplayDate] = useState(`${month}/${day}/${year}`);
    const myContext = useContext(Context);
    // console.log(myContext.onAdd); Check Home.js for the value of Context that is being pass in CreateEntry.js
    useEffect(()=>{
        let process = true;
        fetchDate(process);//executing/calling fetchDate and passing the process as true
        return ()=>{//set the process to false after fetchDate was executed
            process = false;//to stop executing continuously
        }
    },[]);

    // setTimeout(() => {
        
    // }, 1000);

    function fetchDate(isTrue){//set the currentDate if "TRUE" month + 1 January value is = 0
//DD/MM/YY is the default formart of postgresql for date so we need to set the date to this format
        {isTrue && (setCurrentDate(`${day}/${month+1}/${year}`))}
//Display date will be set to MM/DD/YY        
        {isTrue && (setDisplayDate(`${month+1<10?`0${month+1}`:month+1}/${day<10?`0${day}`:day}/${year}`))}
        
        // {isTrue && myContext.setSelectedMonth(month+1)}
    }
    
    function handleChange(event){
        const{value, name} = event.target; //destructure the value of event{event is an object} and create a variable 
        //for (event.target.name and event.target.value)
        return(
            setData((prev)=>{//pass the prev value of data
                //return an object base below to be use in setData() above
                return (name === "merchant" ? 
                {entry_id:`${myContext.id}`, date:currentDate, merchant:value, amount:prev.amount}
                :{entry_id:`${myContext.id}`, date:currentDate, merchant:prev.merchant, amount:value});
            })
        );
    }
    return(
        <div className="createEntry">
            <label>Date</label>
            <label>Merchant</label>
            <label>Amount</label>
            <label>{displayDate}</label>
            <input type="text" name="merchant" placeholder="Merchant:" value={data.merchant} onChange={handleChange}></input>
            <input type="text" name="amount" placeholder="Amount" value={data.amount} onChange={handleChange}></input>
            {/*function received from parent should be put inside a function
            so it will only execute once a click/event was triggered onClick={()=>{myContext.onAdd("Data")}} */}
            <button type="submit" onClick={(event)=>{
                setData({entry_id: `${myContext.id}`, date:"", merchant:"", amount:""});
                myContext.onAdd(data);
            }}>Add</button>
            {/* <label>{months[myContext.selectedMonth-1]}</label> */}
        </div>
    );
}

export default CreateEntry;
