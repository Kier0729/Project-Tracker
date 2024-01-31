import React, { useState, useContext } from "react";
//below imports is use to accept/received data from the parent components
import Context from "./Context"
import { useNavigate } from "react-router-dom"; //for frontend routing//import useNavigate

function Modify(){
    const data = useContext(Context); //passing the data received
    const [modify, setModify] = useState();
    const navigate = useNavigate(); //creating a constant for useNavigate(cannot be called inside a callback)

    function handleClick(){
        setModify(data.value);
        // data.onModify(modify);
        console.log(data.value);
    }
    
    return(
        <div className="createEntry" >
            <h1 onClick={handleClick}>Modify</h1>
            <h1>{modify}</h1>
            <h1 onClick={()=>{navigate("/")}}>Go Back</h1>
        </div>
    );
}

export default Modify;