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
        <div className="modify" >
            <div>
            <label>Date</label>
            <label>Merchant</label>
            <label>Amount</label>
            <input name="date" value={modify.date} onChange={handleChange} ></input>
            <input name="merchant" value={modify.merchant} onChange={handleChange} ></input>
            <input name="amount" value={modify.amount} onChange={handleChange} ></input>
            </div>
            <div>
                <button onClick={()=>{
                    navigate("/Home");
                    data.onModify(modify);
                    }}>Save</button>
                <button onClick={()=>{
                    navigate("/Home");
                    data.onDelete(modify.id);
                    }}>Delete</button>
                <button onClick={()=>{navigate("/Home")}}>Back</button>
            </div>
        </div>
    );
}

export default Modify;