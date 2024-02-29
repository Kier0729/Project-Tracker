import React, {useState, useContext} from "react";
import CreateEntry from "./CreateEntry";
import Entry from "./Entry";
import Context from "./Context"; //use for passing data to components/child using (Context.Provider)
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Home(){
    const data = useContext(Context); //passing the data received to a const data
    const navigate = useNavigate();

    const date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "View all"];
    
    async function handleLogout(){
        await axios.get(`/Logout`, {withCredentials:true}).then((res)=>{
//waiting for api response .then to make sure that user is already logout.                
            data.setUser(res.data); //need to set to null for the Router.js condition in navigating (res.data here will be null)
            data.setData(null);
            data.setOptions({cycle:7, selectedMonth:date.getMonth()+1, selectedYear:date.getFullYear()});
            navigate("/");
        });
    }

    async function handleChange(event){
        if(event.target.name == "endCycle"){
            data.setOptions(prev=>{return{cycle:event.target.value, selectedMonth:prev.selectedMonth, selectedYear:prev.selectedYear}});
            data.setTotal(null);
//API request done here to avoid delay in sending and receiving request/respond
            try{//option should be declared as an object
                await axios.post(`/fetch`, {month:data.options.selectedMonth, cycle:event.target.value, year:data.options.selectedYear}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
                //.then(res => res.json()) axios dont need to convert json
                .then((res) => {
                    let sum = 0;
                    data.setData(res.data);
                    if(res.data){ res.data.map(items => {
                        sum = sum + items.amount;
                    });
                    data.setTotal(sum); } else {
                        data.setUser(res.data);
                    }
                })
            } catch(error){console.log(error.message);}
        }
        
        else if (event.target.name == "months"){
            data.setOptions(prev=>{return{cycle:prev.cycle, selectedMonth:event.target.value, selectedYear:prev.selectedYear}});
            data.setTotal(null);
//API request done here to avoid delay in sending and receiving request/respond
            try{//option should be declared as an object
                await axios.post(`/fetch`, {month:event.target.value, cycle:data.options.cycle , year:data.options.selectedYear}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
                //.then(res => res.json()) axios dont need to convert json
                .then((res) => {
                    let sum = 0;
                    data.setData(res.data);
                    if(res.data){ res.data.map(items => {
                        sum = sum + items.amount;
                    });
                    data.setTotal(sum); } else {
                        data.setUser(res.data);
                    }
                })
            } catch(error){console.log(error.message);}
        }
        else if (event.target.name == "year"){
            data.setOptions(prev=>{return{cycle:prev.cycle, selectedMonth:prev.selectedMonth, selectedYear:event.target.value}});
            data.setTotal(null);
//API request done here to avoid delay in sending and receiving request/respond
            try{//option should be declared as an object
                await axios.post(`/fetch`, {month:data.options.selectedMonth, cycle:data.options.cycle, year:event.target.value}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
                //.then(res => res.json()) axios dont need to convert json
                .then((res) => {
                    let sum = 0;
                    data.setData(res.data);
                    if(res.data){ res.data.map(items => {
                        sum = sum + items.amount;
                    });
                    data.setTotal(sum); } else {
                        data.setUser(res.data);
                    }
                })
            } catch(error){console.log(error.message);}
        }
//////////////////////////////////////////////////////////////////////////////////
    }

    return(
        <div>
            <div className="navBar">
                <div className="logout">
                <h4>Total expenses: {<label>{data.total || "0.00"}</label>}</h4>
                <div>
                <h4>Login under: {data.user.fname} {data.user.lname}</h4> 
                <button onClick={handleLogout}>Logout</button>
                </div>
                </div>
                <div className="options">
                <label htmlFor="endCycle">End of cycle:</label>
                <input name="endCycle" id="endCycle" value={data.options.cycle} onChange={handleChange}></input>
                <select name="months" value={data.options.selectedMonth || "default"} onChange={handleChange}>
                    <option value="default" disabled hidden>Select a Month</option>
                    {months.map((items, index)=>{
                        return(<option key={index} value={index+1}>{items}</option>);
                    })}
                </select>

                <select name="year" value={data.options.selectedYear || "default"} onChange={handleChange}>
                    <option value="default" disabled hidden>Select a Year</option>
                    
                    {data.yearList && data.yearList.map((items, index)=>{
                        return(<option key={index} value={items}>{items}</option>);
                    })}
                </select>
                </div>
            </div>
            {/* select to ONLY pass the selected data/function for practice*/}
            <Context.Provider value={{id:data.user.id, onAdd:data.onAdd, axiosFetchData:data.axiosFetchData, fetchYear:data.fetchYear}}>
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