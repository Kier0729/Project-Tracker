import React from "react";
//below imports is use to accept/received data from the parent components
import {useContext} from "react";
import Context from "./Context"

function Entry(){
    const data = useContext(Context); //passing the data received
    return(
        <div className="createEntry">
            <label>{data.date}</label>
            <label>{data.merchant}</label>
            <label>{data.amount}</label>
        </div>
    );
}

export default Entry;