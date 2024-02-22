import React, {useState, useContext} from "react";
import CreateEntry from "./CreateEntry";
import Entry from "./Entry";
import Context from "./Context"; //use for passing data to components/child using (Context.Provider)
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Home(){
    const data = useContext(Context); //passing the data received to a const data
    const navigate = useNavigate();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "View all"];
    const date = new Date();
    const year = date.getFullYear();
    let sum = 0;

    async function handleLogout(){
        // data.setUser(null);//need to set to null for the Router.js condition in navigating
        await axios.get(`${process.env.REACT_APP_API_URL}Logout`, {withCredentials:true}).then((res)=>{
//waiting for api response .then to make sure that user is already logout.                
            data.setUser(res.data);
            navigate("/");
        });
    }

    async function handleChange(event){
        // console.log(months[event.target.value-1]);
        data.setSelectedMonth(event.target.value);
        data.setTotal(null);
//API request done here to avoid delay in sending and receiving request/respond
            try{//option should be declared as an object
                await axios.post(`${process.env.REACT_APP_API_URL}fetch`, {selectedMonth:event.target.value}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
                //.then(res => res.json()) axios dont need to convert json
                .then((res) => {
                    data.setData(res.data);
                    if(res.data){ res.data.map(items => {
                        sum = sum + items.amount;
                    });
                    data.setTotal(sum); } else {
                        data.setUser(res.data);
                        data.setSelectedMonth(res.data);
                    }
                })
            } catch(error){console.log(error.message);}
//////////////////////////////////////////////////////////////////////////////////
    }

    return(
        <div>
            <div className="navBar">
                <div>
                <h4>Total expenses: {<label>{data.total || "0.00"}</label>}</h4>
                </div>
                <label for="endCycle">End of cycle:</label>
                <input name="endCycle" id="endCycle"></input>
                <select value={data.selectedMonth || "default"} onChange={handleChange}>
                    <option value="default" disabled hidden>Select a Month</option>
                    {months.map((items, index)=>{
                        return(<option key={index} value={index+1}>{items}</option>);
                    })}
                </select>

                <select value={year || "default"} onChange={handleChange}>
                    <option value="default" disabled hidden>Select a Year</option>
                    
                    {data.selectedYear && data.selectedYear.map((items, index)=>{
                        return(<option key={index} value={items}>{items}</option>);
                    })}
                </select>
                <h4>Login under: {data.user.fname} {data.user.lname}</h4> 
                <button onClick={handleLogout}>Logout</button>
            </div>
            {/* select to ONLY pass the selected data/function for practice*/}
            <Context.Provider value={{id:data.user.id, onAdd:data.onAdd, axiosFetchData:data.axiosFetchData, selectedMonth:data.selectedMonth, setSelectedMonth:data.setSelectedMonth, fetchYear:data.fetchYear}}>
                <CreateEntry />
            </Context.Provider>

            {
            data.data && data.data.map((items, index)=>{ //map can also pass the index //check the value of data.data
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

export default Home;