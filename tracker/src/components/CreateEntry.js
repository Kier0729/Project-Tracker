import React, {useState} from "react";
//below imports is use to accept/received data from the parent components
import {useContext, useEffect} from "react";
import Context from "./Context"

function CreateEntry(){
    const date = new Date();
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    
    const [data, setData] = useState({date:"", merchant:"", amount:""});
    const [currentDate, setCurrentDate] = useState(`${month}/${day}/${year}`);

    const onAdd = useContext(Context);
    // console.log(onAdd); Check Home.js for the value of Context that is being pass in CreateEntry.js
    useEffect(()=>{
        let process = true;
        fetchDate(process);//executing/calling fetchDate and passing the process as true
        return ()=>{//set the process to false after fetchDate was executed
            process = false;//to stop executing continuously
        }
    },[]);

    function fetchDate(isTrue){//set the currentDate if "TRUE" month + 1 January value is = 0
        {isTrue && (setCurrentDate(`${month+1}/${day}/${year}`))}//
    }
    
    function handleChange(event){
        const{value, name} = event.target; //destructure the value of event{event is an object} and create a variable 
        //for (event.target.name and event.target.value)
        return(
            setData((prev)=>{//pass the prev value of data
                //return an object base below to be use in setData() above
                return (name === "merchant" ? 
                {date:currentDate, merchant:value, amount:prev.amount}
                :{date:currentDate, merchant:prev.merchant, amount:value});
            })
        );
    }

    return(
        <div className="createEntry">
            <label>{currentDate}</label>
            <input type="text" name="merchant" placeholder="Merchant:" value={data.merchant} onChange={handleChange}></input>
            <input type="text" name="amount" placeholder="Amount" value={data.amount} onChange={handleChange}></input>
            {/*function received from parent should be put inside a function
            so it will only execute once a click/event was triggered onClick={()=>{onAdd("Data")}} */}
            <button type="submit" onClick={(event)=>{
                onAdd(data);
                event.preventDefault();
                setData({date:"", merchant:"", amount:""});
            }}>Add</button>
        </div>
    );
}

export default CreateEntry;
