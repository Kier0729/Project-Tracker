import React, { useContext } from "react";
import Context from "../Context";
import "./popup.css"

function Popup(){
    const data = useContext(Context);
    return (data.popup ?
        <div className="popupOuter">
            <div className="popupInner">
            <h5>{data.popup}</h5>
                <button onClick={()=>{
                    data.setPopup(null);
                    data.setSocPop(false);
                }}>
                    Close
                </button>
            </div>

        </div> 
    : "" );
}

export default Popup;