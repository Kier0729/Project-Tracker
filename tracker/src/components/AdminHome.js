import React, {useContext, useState, useEffect} from "react";
import Entry from "./Entry";
import Context from "./Context"; 
import axios from "axios";
import NavBar from "./NavBar";
import Extract from "./extract/Extract";
import Popup from "./popup/Popup";

function AdminHome(){
    const data = useContext(Context);
    // axios.defaults.withCredentials = true;
    const [adminData, setAdminData] = useState();
    const [toNavigate, setToNavigate] = useState(data.toNavigate);
    const [adminExtract, setAdminExtract] = useState(false);
    
    //for AdminHome fetchAminOption is being called here instead in modify.js in every click(save/delete) unlike in Home for fetchclient option
    async function fetchAdminOption(){
            console.log("FetchAdminOption");
            await axios.get(`${process.env.REACT_APP_API_URL}/fetchAdminOption`, { withCredentials: true  }).then(
                async res=>{
                    res.data.adminOption.toNavigate && setToNavigate(res.data.adminOption.toNavigate);
                    if (res.data.adminOption.month && res.data.adminOption.year){
                        const result = await axios.get(`${data.URL}/year`);
                        let year;
                        result.data.length == 1 && (year = result.data[0]); // to remove year in ['2024'] outside the array with [0] 
                        result.data.length > 1 && (year = result.data);
                        const match = result.data.filter(items=>{
                            return items == res.data.adminOption.year;
                        })
                        if (match.length == 0){
                            const result2 = await axios.post(`${process.env.REACT_APP_API_URL}/fetch`, {month:res.data.adminOption.month, cycle:res.data.adminOption.cycle, year:year[0], toNavigate:toNavigate}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
                            setAdminData(result2.data);
                            let sum = 0;
                        if(result2.data){
                            result2.data.map(items => {
                            sum = sum + items.amount;
                        });
                            data.setTotal(sum.toFixed(2)); 
                            } else {data.setTotal(sum.toFixed(2));}
                        } 
                        else if (match.length > 0){
                            const result2 = await axios.post(`${process.env.REACT_APP_API_URL}/fetch`, {month:res.data.adminOption.month, cycle:res.data.adminOption.cycle, year:res.data.adminOption.year, toNavigate:toNavigate}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
                            setAdminData(result2.data);
                            let sum = 0;
                        if(result2.data){result2.data.map(items => {
                            sum = sum + items.amount;
                        });
                            data.setTotal(sum.toFixed(2)); 
                            } else {data.setTotal(sum.toFixed(2));}
                        }
                    }
                    else {
                        const result2 = await axios.post(`${process.env.REACT_APP_API_URL}/fetch`, {month:data.options.selectedMonth, cycle:data.options.cycle, year:data.options.selectedYear, toNavigate:toNavigate}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
                            setAdminData(result2.data);
                            let sum = 0;
                        if(result2.data){result2.data.map(items => {
                            sum = sum + items.amount;
                        });
                            data.setTotal(sum.toFixed(2)); 
                            } else {data.setTotal(sum.toFixed(2));}
                    }
                })
        }

    useEffect(()=>{
        // setTimeout(()=>{
        //   let process = true;  
        //   if(process){
        // }
        //   return ()=>{
        //       process = false;//to stop executing continuously
        //   }
        fetchAdminOption();
        // }, 500);
    },[]);
            
    return (
        <div className="adminHome">
            {<Context.Provider value={{adminData:adminData, adminExtract:adminExtract, setAdminExtract:setAdminExtract, ...data}}>
            <Popup />
            <Extract />
            {!adminExtract && <NavBar />}
            </Context.Provider>}
            {!adminExtract && adminData && adminData.length > 0 &&
            <div className="column-name">
                <label>Name</label>
                <label>Date</label>
                <label>Merchant</label>
                <label>Amount</label>
            </div>
            }
            {
            !adminExtract && adminData && adminData.map((items, index)=>{ //map can also pass the index
            //using Context.Provider below passing a key and value to the Entry (using spread operator ... 
            //to create a new array and include "id" inside the "items" )
            // items = {...items, id:items.id};//WHEN server is not present setting the value of items to include an index value
            //IF server is present no need to set id VALUE because server already provides the id
            return(
//value={OBJECT items:items+id OBJECT onModify function from the apps}                
            <Context.Provider key={index} value={{items:items, onDoubleClick:data.onDoubleClick, onModify:data.onModify}}>
                {!adminExtract && <Entry />}
            </Context.Provider>
            );
            })
            }
        </div>
    );
}

export default AdminHome;