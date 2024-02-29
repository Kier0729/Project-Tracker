import React, {useContext, useState, useEffect} from "react";
import Entry from "./Entry";
import Context from "./Context"; 
import axios from "axios";

function AdminHome(){
    const data = useContext(Context);
    const [adminData, setAdminData] = useState(data.adminData);

    // useEffect(()=>{
    //     axios.post("/updateDataAdmin", data.adminData || null, { withCredentials: true })
    //     .then(
    //         res =>{
    //             console.log(res.data);
    //         }
    //     );  
    // },[]);
            
    return (
        <div>
            {
            adminData && adminData.map((items, index)=>{ //map can also pass the index //check the value of data.data
            //using Context.Provider below passing a key and value to the Entry (using spread operator ... 
            //to create a new array and include "id" inside the "items" )
            // items = {...items, id:items.id};//WHEN server is not present setting the value of items to include an index value
            //IF server is present no need to set id VALUE because server already provides the id
            return(
//value={OBJECT items:items+id OBJECT onModify function from the apps}                
            <Context.Provider key={index} value={{items:items, onDoubleClick:data.onDoubleClick, onModify:data.onModify}}>
                <Entry />
            </Context.Provider>
            );
            })
            }
        </div>
    );
}

export default AdminHome;