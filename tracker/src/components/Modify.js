import React, { useState, useContext } from "react";
//below imports is use to accept/received data from the parent components
import Context from "./Context"
import { useNavigate } from "react-router-dom"; //for frontend routing//import useNavigate

function Modify(){
    const data = useContext(Context); //passing the data received
    const navigate = useNavigate(); //creating a constant for useNavigate(cannot be called inside a callback)

    const [modify, setModify] = useState({
        id:data.selectedItem.id,
        date:data.selectedItem.date,
        merchant:data.selectedItem.merchant,
        amount:data.selectedItem.amount,
    });
    
    function handleChange(event){
        // console.log(event.target.value);
        setModify((prev)=>{
            if(event.target.name==="date"){
                return({
                    id:prev.id,
                    date:event.target.value,
                    merchant:prev.merchant,
                    amount:prev.amount,
                });
            }
            if(event.target.name==="merchant"){
                return({
                    id:prev.id,
                    date:prev.date,
                    merchant:event.target.value,
                    amount:prev.amount,
                });
            }
            if(event.target.name==="amount"){
                return({
                    id:prev.id,
                    date:prev.date,
                    merchant:prev.merchant,
                    amount:event.target.value,
                });
            }
        }  
        )}

    return(
        <div className="createEntry" >
            <input name="date" value={modify.date} onChange={handleChange} ></input>
            <input name="merchant" value={modify.merchant} onChange={handleChange} ></input>
            <input name="amount" value={modify.amount} onChange={handleChange} ></input>
            <div>
                <h1 onClick={()=>{
                    navigate("/");
                    data.onModify(modify);
                    }}>Save</h1>
                <h1 onClick={()=>{
                    navigate("/");
                    data.onDelete(modify.id);
                    }}>Delete</h1>
                <h1 onClick={()=>{navigate("/")}}>Back</h1>
            </div>
        </div>
    );
}

export default Modify;