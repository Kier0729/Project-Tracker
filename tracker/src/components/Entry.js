import React from "react";
//below imports is use to accept/received data from the parent components
import {useContext, useState} from "react";//for receiver of Context.Provider
import Context from "./Context"
import { useNavigate } from "react-router-dom"; //for frontend routing//import useNavigate

function Entry(){
const [modifyData, setModifyData] = useState({date:"", merchant:"", amount:""});
    const data = useContext(Context); //passing the data received // Check in Home.js what is being pass or console.log
    // console.log(data);

    const {date, merchant, amount} = data.items;//destructure the value of data.items

    const navigate = useNavigate(); //creating a constant for useNavigate(cannot be called inside a callback)

    function handleDoubleClick(event){
        console.log(event.target.value);
        data.onModify(event.target.id);
        navigate("/modify");
    }
    return(
        <div type="submit" className="createEntry" id={data.items.id} onDoubleClick={handleDoubleClick}> {/* ()=> {navigate("/modify")} call navigate when doubleclick*/}
            <label value={date}>{date}</label>
            <label value={merchant}>{merchant}</label>
            <label value={amount}>{amount}</label>
            <label>{data.value}</label>
        </div>
    );
}

export default Entry;
//Try to use body.parser to get the value