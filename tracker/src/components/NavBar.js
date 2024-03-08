import axios from "axios";
import React, {useContext, useState, useEffect} from "react";
import Context from "./Context";
import {useNavigate} from "react-router-dom";


function NavBar(){
    const data = useContext(Context);
    const navigate = useNavigate();

    const date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "View all"];
    const days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    const [yearList, setyearList] = useState(data.yearList);
    
    // useEffect(()=>{
    //     fetchYear();
    // },[]);
    async function handleLogout(){
        await axios.get(`${data.URL}/Logout`, {withCredentials:true}).then((res)=>{
//waiting for api response .then to make sure that user is already logout.                
            data.setUser(res.data); //need to set to null for the Router.js condition in navigating (res.data here will be null)
            data.setData(null);
            data.setAdminData("");
            data.setyearList(null)
            data.setTotal(null);
            data.setOptions({cycle:7, selectedMonth:date.getMonth()+1, selectedYear:date.getFullYear()});
            navigate("/");
        });
    }

    async function handleChange(event){
        // data.fetchYear();
        if(event.target.name == "endCycle"){
            data.setOptions(prev=>{return{cycle:event.target.value, selectedMonth:prev.selectedMonth, selectedYear:prev.selectedYear}});
            data.setTotal(null);
//API request done here to avoid delay in sending and receiving request/respond
            try{//option should be declared as an object
                await axios.post(`${data.URL}/fetch`, {month:data.options.selectedMonth, cycle:event.target.value, year:data.options.selectedYear}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
                //.then(res => res.json()) axios dont need to convert json
                .then((res) => {
                    let sum = 0;
                    data.setData(res.data);
                    if(res.data){ res.data.map(items => {
                        sum = sum + items.amount;
                    });
                    data.setTotal(sum.toFixed(2)); } else {
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
                await axios.post(`${data.URL}/fetch`, {month:event.target.value, cycle:data.options.cycle , year:data.options.selectedYear}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
                //.then(res => res.json()) axios dont need to convert json
                .then((res) => {
                    let sum = 0;
                    data.setData(res.data);
                    if(res.data){ res.data.map(items => {
                        sum = sum + items.amount;
                    });
                    data.setTotal(sum.toFixed(2)); } else {
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
                await axios.post(`${data.URL}/fetch`, {month:data.options.selectedMonth, cycle:data.options.cycle, year:event.target.value}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
                //.then(res => res.json()) axios dont need to convert json
                .then((res) => {
                    let sum = 0;
                    data.setData(res.data);
                    if(res.data){ res.data.map(items => {
                        sum = sum + items.amount;
                    });
                    data.setTotal(sum.toFixed(2)); } else {
                        data.setUser(res.data);
                    }
                })
            } catch(error){console.log(error.message);}
        }
//////////////////////////////////////////////////////////////////////////////////
    }

    async function handleClick(event){
        setTimeout( async ()=>{
            data.fetchYear();
        //return Promise.all()
        const result = await axios.post(`${data.URL}/updateDataAdmin`, {...data.options, id:data.listId}, { withCredentials: true });
        result.data.forEach(items => {
            let sum = 0;
            if(result.data){ result.data.map(items => {
                sum = sum + items.amount;
            });
            data.setTotal(sum.toFixed(2)); }

                data.setAdminData(prev=>{
                    return [...prev, items];
                });
            })
            const result2 = await axios.post(`${data.URL}/toNavigate`, {...data.options, id:data.listId}, { withCredentials: true });
            if(result2.data[0].length>0){
            data.setToNavigate(true);
            navigate("/AdminHome");
        }
        else {
            navigate("/");
            data.setToNavigate(false);
        }
        },300);
    }

    async function handleBack(){
        setTimeout(async () => {
        await axios.post(`${data.URL}/updateDataAdmin`, {}, { withCredentials: true });
        data.setTotal(null);
        data.setAdminData("");
        data.setData("");
        data.setyearList(null);
        data.setToNavigate(false);
        navigate("/Home");
        }, 300);
    }

    return(
        <div>
            <div className="navBar">
                <div className="logout">
                <h4>Total expenses: {<label>{data.total || "0.00" }</label>}</h4>
                <div>
                <h4>Login under: {data.user.fname} {data.user.lname}</h4> 
                <button onClick={handleLogout}>Logout</button>
                </div>
                </div>
                <div className="options">
                <label htmlFor="endCycle">End of cycle:</label>
                {/* <input name="endCycle" id="endCycle" value={data.options.cycle || 0} onChange={handleChange}></input> */}
                
                <select name="endCycle" id="endCycle" value={data.options.cycle || 0} onChange={handleChange}>
                    <option value="default" disabled hidden>Select a Day</option>
                    
                    {days && days.map((items, index)=>{
                        return(<option key={index} value={items}>{items}</option>);
                    })}
                </select>
                <select name="months" value={data.options.selectedMonth || "default"} onChange={handleChange}>
                    <option value="default" disabled hidden>Select a Month</option>
                    {months.map((items, index)=>{
                        return(<option key={index} value={index+1}>{items}</option>);
                    })}
                </select>

                <select name="year" value={data.options.selectedYear || "default"} onChange={handleChange}>
                    <option value="default" disabled hidden>Select a Year</option>
                    
                    {yearList && yearList.map((items, index)=>{
                        return(<option key={index} value={items}>{items}</option>);
                    })}
                </select>
                {data.user.admin && (data.toNavigate == false && <button onClick={handleClick}>View</button>)}
                {data.user.admin && (data.toNavigate == true && <button onClick={handleBack}>Back</button>)}
            {/* view after modify */}
                
                </div>
            </div>
        </div>
        );
}

export default NavBar;