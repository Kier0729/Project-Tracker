import axios from "axios";
import React, {useContext, useState, useEffect} from "react";
import Context from "./Context";
import {useNavigate} from "react-router-dom";


function NavBar(){
    // axios.defaults.withCredentials = true;
    const data = useContext(Context);
    const navigate = useNavigate();
    const date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "View all"];
    const days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    const [yearList, setyearList] = useState("");
    const [options, setOptions] = useState(data.options);

    async function fetchAdminOption(){
        console.log("FetchAdminOption");
        await axios.get(`${process.env.REACT_APP_API_URL}/fetchAdminOption`, { withCredentials: true  }).then(
            async res=>{
                if (res.data.adminOption.month && res.data.adminOption.year){
                    const result = await axios.get(`${data.URL}/year`);
                    let year;
                    result.data.length == 1 && (year = result.data[0]); // to remove year in ['2024'] outside the array with [0] 
                    result.data.length > 1 && (year = result.data);
                    const match = result.data.filter(items=>{
                        return items == res.data.adminOption.year;
                    })
                    if (match.length == 0){
                        setOptions({selectedMonth:res.data.adminOption.month, cycle:res.data.adminOption.cycle, selectedYear:year[0]});
                    } 
                    else if (match.length > 0){
                        setOptions({selectedMonth:res.data.adminOption.month, cycle:res.data.adminOption.cycle, selectedYear:res.data.adminOption.year});
                    }
                }
                else {
                    setOptions({selectedMonth:data.options.selectedMonth, cycle:data.options.cycle, selectedYear:data.options.selectedYear});
                }
            })
    }
    
    async function fetchYear(){
        console.log("FetchYear!");
        await axios.get(`${data.URL}/year`).then(
            res => {
                if(data.user.admin){
                    let year = [];
                        res.data.length == 1 && (year.push(res.data[0])); // to remove year in ['2024'] outside the array with [0] 
                        res.data.length > 1 && (year = res.data);
                        year && setyearList(year);
                        fetchAdminOption();
                } else {
                    setyearList(res.data);
                }    
            }
        )
    }
    useEffect(()=>{
        fetchYear();
    },[]);
    async function handleLogout(){
        await axios.get(`${data.URL}/Logout`, { withCredentials: true}).then((res)=>{
//waiting for api response .then to make sure that user is already logout.                
            data.setUser(res.data); //need to set to null for the Router.js condition in navigating (res.data here will be null)
            setyearList(null)
            data.setTotal(null);
            data.setOptions({cycle:null, selectedMonth:null, selectedYear:null});
            navigate("/");
        });
    }

    async function handleChange(event){
        if(event.target.name == "endCycle"){
            data.setOptions(prev=>{return{cycle:event.target.value, selectedMonth:prev.selectedMonth, selectedYear:prev.selectedYear}});
//API request done here to avoid delay in sending and receiving request/respond
            try{//option should be declared as an object
                await axios.post(`${data.URL}/fetch`, {month:data.options.selectedMonth, cycle:event.target.value, year:data.options.selectedYear, toNavigate:data.toNavigate}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
            } catch(error){console.log(error.message);}
        }
        else if (event.target.name == "months"){
            data.setOptions(prev=>{return{cycle:prev.cycle, selectedMonth:event.target.value, selectedYear:prev.selectedYear}});
//API request done here to avoid delay in sending and receiving request/respond
            try{//option should be declared as an object
                await axios.post(`${data.URL}/fetch`, {month:event.target.value, cycle:data.options.cycle , year:data.options.selectedYear, toNavigate:data.toNavigate}, { withCredentials: true }/*, options*/)
                 //for post/put/patch/delete request needs options
            } catch(error){console.log(error.message);}
        }
        else if (event.target.name == "year"){
            data.setOptions(prev=>{return{cycle:prev.cycle, selectedMonth:prev.selectedMonth, selectedYear:event.target.value}});
            // data.setTotal(null);
//API request done here to avoid delay in sending and receiving request/respond
            try{//option should be declared as an object
                await axios.post(`${data.URL}/fetch`, {month:data.options.selectedMonth, cycle:data.options.cycle, year:event.target.value, toNavigate:data.toNavigate}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
            } catch(error){console.log(error.message);}
        }
//////////////////////////////////////////////////////////////////////////////////
    }

    async function handleClick(event){
        setTimeout( async ()=>{
            fetchYear();
        const result2 = await axios.post(`${data.URL}/toNavigate`, {...data.options, id:data.listId}, { withCredentials: true });
            if(result2.data[0].length>0){
            data.setToNavigate(true);

        const result = await axios.post(`${data.URL}/postFetchAdminData&Option`, {...data.options, id:data.listId, toNavigate:true}, { withCredentials: true });
            result.data.forEach(items => {
            let sum = 0;
            if(result.data){ 
                result.data.map(items => {
                sum = sum + items.amount;
            });
            data.setTotal(sum.toFixed(2)); 
            }
            })
            navigate("/AdminHome");
        }
        else {
            navigate("/");
            data.setPopup(`Selected user doesn't have any saved data.`)
            data.setToNavigate(false);
        }
        },300);
    }

    async function handleBack(){
        setTimeout(async () => {
        await axios.post(`${data.URL}/postFetchAdminData&Option`, {}, { withCredentials: true });
        data.setTotal(null);
        data.setOptions({cycle:null, selectedMonth:null, selectedYear:null});
        setyearList(null);
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
                    <div>
                <label htmlFor="endCycle">Cycle date:</label>
                {/* <input name="endCycle" id="endCycle" value={data.options.cycle || 0} onChange={handleChange}></input> */}
                
                <select name="endCycle" id="endCycle" value={options.cycle || "default"} onChange={handleChange}>
                    <option value="default" disabled hidden>Day</option>
                    {days && days.map((items, index)=>{
                        return(<option key={index} value={items}>{items}</option>);
                    })}
                </select>
                    
                <select name="months" value={options.selectedMonth || "default"} onChange={handleChange}>
                    <option value="default" disabled hidden>Month</option>
                    {months.map((items, index)=>{
                        return(<option key={index} value={index+1}>{items}</option>);
                    })}
                </select>
                <select name="year" value={options.selectedYear || "default"} onChange={handleChange}>
                    <option value="default" disabled hidden>Year</option>
                    {yearList && yearList.map((items, index)=>{
                        return(<option key={index} value={items}>{items}</option>);
                    })}
                </select>
                {data.adminData || data.clientData ? <button onClick={()=>{
                    !data.user.admin && data.clientData && data.setClientExtract(true)
                    !data.user.admin && data.clientData.length == 0 && data.setPopup(`Nothing to export`)
                    data.user.admin && data.adminData.length > 0 && data.setAdminExtract(true)
                    data.user.admin && data.adminData.length == 0 && data.setPopup(`Nothing to export`)
                    // navigate("/Export");
                        }
                    }>Export</button> : ""}
                    {data.user.admin && <button onClick={()=>navigate("/ResetPassword")}>Modify Account</button>}
                                      
                {data.user.admin && (data.toNavigate == false && <button onClick={handleClick}>View Data</button>)}
                {data.user.admin && (data.toNavigate == true && <button onClick={handleBack}>Back</button>)}
                </div>
            {/* view after modify */}
                {data.user.user_pass != "facebook" && data.user.user_pass != "google" && <button className="change-pass-btn" onClick={()=>{navigate("/ChangePass")}}>Change Password</button>}
                </div>
            </div>
        </div>
        );
}

export default NavBar;