import React, {useContext, useState, useEffect} from "react";
import Entry from "./Entry";
import Context from "./Context"; 
import axios from "axios";
import NavBar from "./NavBar";

function AdminHome(){
    const data = useContext(Context);
    // axios.defaults.withCredentials = true;
    const [adminData, setAdminData] = useState("");
    console.log(data.options);
    async function fetchAll(){
        try{//option should be declared as an object // { withCredentials: true } to send back cookies to server //headers: myHeader,
            await axios.post(`${process.env.REACT_APP_API_URL}/fetch`, {month:data.options.selectedMonth, cycle:data.options.cycle, year:data.options.selectedYear, toNavigate:data.toNavigate}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
            //.then(res => res.json()) axios dont need to convert json
            .then((res) => { 
                console.log(res.data);
                setAdminData(res.data);
                let sum = 0;
                if(res.data){ res.data.map(items => {
                    sum = sum + items.amount;
                });
                data.setTotal(sum.toFixed(2)); } 
            })
        } catch(error){console.log(error.message);}
    }

    useEffect(()=>{
        data.user.admin && fetchAll();
    },[]);
            
    return (
        <div className="adminHome">
            <NavBar />
            {
            adminData && adminData.map((items, index)=>{ //map can also pass the index
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