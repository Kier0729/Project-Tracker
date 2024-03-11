import React, {useContext, useState, useEffect} from "react";
import Entry from "./Entry";
import Context from "./Context"; 
import axios from "axios";
import NavBar from "./NavBar";

function AdminHome(){
    const data = useContext(Context);
    axios.defaults.withCredentials = true;
    const [adminData, setAdminData] = useState("");

    async function fetchAll(){
        await axios.get(`${data.URL}/fetchDataAdmin`,{ headers: data.myHeader, withCredentials: true  }).then(
            res=>{
//not sure why if setting data.setAdminData from Apps is modified here it results in an infinite loop   
                setAdminData(res.data);    
            }
        );
    }

    useEffect(()=>{
        fetchAll();
    },[]);
            
    return (
        <div className="adminHome">
            <NavBar />
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