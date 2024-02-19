import React, {useState, useContext} from "react";
import CreateEntry from "./CreateEntry";
import Entry from "./Entry";
import Context from "./Context"; //use for passing data to components/child using (Context.Provider)
import axios from "axios";
import {useNavigate, Link} from "react-router-dom";

function Home(){
    const data = useContext(Context); //passing the data received to a const data
    const navigate = useNavigate();

    async function handleLogout(){
        // data.setUser(null);//need to set to null for the Router.js condition in navigating
        await axios.get(`${process.env.REACT_APP_API_URL}Logout`, {withCredentials:true}).then((res)=>{
//waiting for api response .then to make sure that user is already logout.                
            data.setUser(res.data);
            navigate("/");
        });
    }

    async function handleChange(event){
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            console.log(months[event.target.value-1]);
            data.setSelectedMonth(event.target.value);
            
//API request done here to avoid delay in sending and receiving request/respond
            try{//option should be declared as an object
                await axios.post(`${process.env.REACT_APP_API_URL}fetch`, {selectedMonth:event.target.value}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
                //.then(res => res.json()) axios dont need to convert json
                .then((res) => {
                    data.setData(res.data);
                    // console.log("AxiosFetchData Executed!");
                })
            } catch(error){console.log(error.message);}
//////////////////////////////////////////////////////////////////////////////////

    }

    return(
        <div>
            <div className="navBar">
                <select onChange={handleChange}>
                    <option value="" disabled selected hidden>Select a Month</option>
                    <option value="1" >January</option>
                    <option value="2" >February</option>
                    <option value="3" >March</option>
                    <option value="4" >April</option>
                    <option value="5" >May</option>
                    <option value="6" >June</option>
                    <option value="7" >July</option>
                    <option value="8" >August</option>
                    <option value="9" >September</option>
                    <option value="10" >October</option>
                    <option value="11" >November</option>
                    <option value="12" >December</option>
                </select>
                <h4>Login under: {data.user.fname} {data.user.lname}</h4> 
                <button onClick={handleLogout}>Logout</button>
            </div>
            <Context.Provider value={{id:data.user.id, onAdd:data.onAdd, axiosFetchData:data.axiosFetchData, selectedMonth:data.selectedMonth, setSelectedMonth:data.setSelectedMonth}}>{/* select to ONLY pass the function onAdd check Apps.js*/}
                <CreateEntry />
            </Context.Provider>

            {data.data.map((items, index)=>{ //map can also pass the index //check the value of data.data
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
            }  
            )}
        </div>

    );
}

export default Home;