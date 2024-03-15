import React, { useState, useContext, useEffect } from "react";
//below imports is use to accept/received data from the parent components
import Context from "./Context"
import { useNavigate } from "react-router-dom"; //for frontend routing//import useNavigate
import axios from "axios";

function Modify(){
    const data = useContext(Context); //passing the data received
    const navigate = useNavigate(); //creating a constant for useNavigate(cannot be called inside a callback)

    const [modify, setModify] = useState({
        id:data.selectedItem.id,
        date:data.selectedItem.date,
        merchant:data.selectedItem.merchant,
        amount:data.selectedItem.amount,
        fname:data.selectedItem.fname,
    });

    function postSelectedItem(){
        axios.post(`${process.env.REACT_APP_API_URL}/postSelectedItem`, {}, { withCredentials: true }/*, options*/);    
    }

    useEffect(()=>{
        // setTimeout(()=>{
        console.log(modify);
        axios.post(`${process.env.REACT_APP_API_URL}/postSelectedItem`, {modify}, { withCredentials: true }/*, options*/);    

            // }, 500);
    },[]);
    
    function handleChange(event){
        setModify((prev)=>{
            if(event.target.name==="date"){
                return({
                    id:prev.id,
                    fname:prev.fname,
                    date:event.target.value,
                    merchant:prev.merchant,
                    amount:prev.amount,
                });
            }
            if(event.target.name==="merchant"){
                return({
                    id:prev.id,
                    fname:prev.fname,
                    date:prev.date,
                    merchant:event.target.value,
                    amount:prev.amount,
                });
            }
            if(event.target.name==="amount"){
                return({
                    id:prev.id,
                    fname:prev.fname,
                    date:prev.date,
                    merchant:prev.merchant,
                    amount:event.target.value,
                });
            }
        }  
        )}

    return(
        <div className="modify" >
            <div style={modify.fname && {gridTemplateColumns: `repeat(4, 1fr)`}}>
            {modify.fname && <label name="fname" >{modify.fname}</label>}
            <label>Date</label>
            <label>Merchant</label>
            <label>Amount</label>
            <input name="date" value={modify.date} placeholder="Please enter date:" onChange={handleChange} style={modify.fname && {gridColumnStart: `2`, gridColumnEnd: `3`}}></input>
            <input name="merchant" value={modify.merchant} placeholder="Please enter merchant:" onChange={handleChange} ></input>
            <input name="amount" value={modify.amount} placeholder="Please enter amount:" onChange={handleChange} ></input>
            </div>
            <div>
                <button onClick={()=>{
                    if(modify.merchant && modify.amount){
                        data.onModify(modify);
                        !data.user.admin && data.fetchUser();
                        data.user.admin && data.fetchAdminOption();
                        data.setSelectedItem("");
                        postSelectedItem();
                        modify.fname ? navigate("/AdminHome") : navigate("/Home");
                    }
                    }}>Save</button>
                <button onClick={()=>{
                    data.onDelete(modify.id);
                    !data.user.admin && data.fetchUser();
                    data.user.admin && data.fetchAdminOption();
                    data.setSelectedItem("");
                    postSelectedItem();
                    modify.fname ? navigate("/AdminHome") : navigate("/Home");
                    }}>Delete</button>
                <button onClick={()=>{
                    !data.user.admin && data.fetchUser();
                    data.setSelectedItem("");
                    postSelectedItem();
                    modify.fname ? navigate("/AdminHome") : navigate("/Home");
                    }}>Back</button>
            </div>
        </div>
    );
}

export default Modify;