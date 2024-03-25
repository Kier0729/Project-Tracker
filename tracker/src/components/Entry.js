import React, {useContext} from "react"; 
//useContext import is use to accept/received data from the parent components for receiver of Context.Provider
import { useNavigate } from "react-router-dom"; //for frontend routing//import useNavigate
import Context from "./Context"

function Entry(){
    const data = useContext(Context); //passing the data received // Check in Home.js what is being pass or console.log
    const {fname, lname, date, merchant, amount} = data.items;//destructure the value of data.items
//useNavigate can only be use in a Route Components/Child
    const navigate = useNavigate(); //creating a constant for useNavigate(cannot be called inside a callback)

    return(
    //(THIS WAS BEFORE) Here z-index of label is set to -1 so when a user click a label it will click the div instead    
    //(THIS WAS BEFORE) the event trigger will be set to div istead of the label
        <div type="submit" className="entry" id={data.items.id} onDoubleClick={(event)=>{
{/* below/here calling onDoubleClick funtion from Apps.js and pass the element that triggers the event*/}        
                let myElement = document.getElementById(event.target.id);
                data.onDoubleClick(myElement);
                navigate("/Modify"); {/* ()=> {navigate("/modify")} call navigate when doubleclick*/}
            }} style={fname && {gridTemplateColumns: `repeat(4, 1fr)`}}>
            {fname && <label name={`fname`} id={data.items.id}>{fname} {lname}</label>}
            <label name={`date`} id={data.items.id}>{date}</label>
            <label name={`merchant`} id={data.items.id}>{merchant}</label>
            <label name={`amount`} id={data.items.id}>{amount}</label>
        </div>
    );
}

export default Entry;