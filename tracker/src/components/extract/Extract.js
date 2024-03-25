import React, { useContext } from "react";
import Context from "../Context";
import {useNavigate} from "react-router-dom";
import "./extract.css"

function Extract(){
    // const navigate = useNavigate();
    const data = useContext(Context);
    if (data.clientExtract || data.adminExtract){
        return (
        <div className="extract">
        <div className="extractOuter">
            
                <p>{data.adminData && "Name, " }Date, Merchant, Amount</p>
                {data.clientData && data.clientData.map(items =>{
                    return <p key={items.id}>{`${items.date},${items.merchant},${parseFloat(items.amount)}`}</p>;
                })}
                {data.adminData && data.adminData.map(items =>{
                    return <p key={items.id}>{`${items.fname},${items.date},${items.merchant},${parseFloat(items.amount)}`}</p>;
                })}
                <p>{`Total Amount:,${data.total}`}</p>
                <button className="prevent-select" onClick={()=>{
                    data.clientExtract && data.setClientExtract(false)
                    data.adminExtract && data.setAdminExtract(false)
                    // navigate("/Home");
                }}>
                    Close
                </button>
        </div>    
            </div>
            )
            };
}

export default Extract;