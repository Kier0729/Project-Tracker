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
    
    const [currentDate, setCurrentDate] = useState(`${day}/${month}/${year}`);
    const [displayDate, setDisplayDate] = useState(`${month+1<10?`0${month+1}`:month+1}/${day<10?`0${day}`:day}/${year}`);
    const [data, setData] = useState({entry_id: myContext.id, date:displayDate, merchant:"", amount:""});
    
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
    }
    
    function handleChange(event){
        const{value, name} = event.target; //destructure the value of event{event is an object} and create a variable 
        //for (event.target.name and event.target.value)

            setData((prev)=>{//pass the prev value of data
                //return an object base below to be use in setData() above
                if (name === "merchant"){return {entry_id:prev.entry_id, date:prev.date, merchant:value, amount:prev.amount}}
                else if (name === "amount"){return {entry_id:prev.entry_id, date:prev.date, merchant:prev.merchant, amount:value}}                    
                else if (name === "date"){return {entry_id:prev.entry_id, date:value, merchant:prev.merchant, amount:prev.amount}}
                //Here dont use the && for if statement                    
            });
    }
    return(
        <div className="createEntry">
            <label>Current Date</label>
            <label>Merchant</label>
            <label>Amount</label>
            {/* <label>{displayDate}</label> */}
            <input type="text" name="date" value={data.date || displayDate} onChange={handleChange}></input>
            <input type="text" name="merchant" placeholder="Merchant:" value={data.merchant} onChange={handleChange}></input>
            <input type="text" name="amount" placeholder="Amount" value={data.amount} onChange={handleChange}></input>
            {/*function received from parent should be put inside a function
            so it will only execute once a click/event was triggered onClick={()=>{myContext.onAdd("Data")}} */}
            <button type="submit" onClick={(event)=>{
                myContext.fetchYear();
                myContext.onAdd(data);
                myContext.axiosFetchData();
                setData({entry_id: `${myContext.id}`, date:"", merchant:"", amount:""});
            }}>Add</button>
        </div>
    );
}

export default CreateEntry;
