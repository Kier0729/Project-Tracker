//"proxy":"https://project-tracker-server-h8ni.onrender.com"
//"proxy":"http://localhost:4000"
import React, {useState, useEffect} from "react"
import Context from "./Context"; //use for passing data to components/child using (Context.Provider)
import Router from "./Router";
import axios from "axios";
//react dont need to import dotenv package for env
//naming env content starts with REACT_APP_ and no "" for the values

function App(){
axios.defaults.withCredentials = true;
const URL = process.env.REACT_APP_API_URL;
//Data received from server/api
//////////////////////////////////////////////////////////////////
// const[data, setData] = useState("");

//////////////////////////////////////////////////////////////////
const [user, setUser] = useState(null);//SHOULD INITIALIZE/DECLARE TYPEOF DATA {Object} or null
const[total, setTotal] = useState(null);
const [toNavigate, setToNavigate] = useState(false);
//////////////////////////////////////////////////////////////////

////////////////Store Data received selected value//////////////////////
const[selectedItem, setSelectedItem]=useState("");
//This will received the value of the element that triggers the event(check Entry.js)
//////////////////////////////////////////////////////////////////

const date = new Date();
const [options, setOptions] = useState({cycle:null, selectedMonth:null, selectedYear:null})
const [popup, setPopup] = useState(null);
const [socPop, setSocPop] = useState(false);

async function fetchOption(){
    console.log("Fetch Option");
    await axios.get(`${process.env.REACT_APP_API_URL}/fetchOption`).then(
        async res=>{
            res.data.selectedItem && setSelectedItem(res.data.selectedItem.modify);
            if (res.data.clientOption.month && res.data.clientOption.year){
                const result = await axios.get(`${URL}/year`);
                const match = result.data.filter(items=>{
                    return items == res.data.clientOption.year;
                })
//condition to set setOptions if the previous options for navbar from server will be restore or set the year to the /year return data[0]
                match.length > 0 ? setOptions({cycle:res.data.clientOption.cycle, selectedMonth:res.data.clientOption.month, selectedYear:res.data.clientOption.year})
                : setOptions({cycle:res.data.clientOption.cycle, selectedMonth:res.data.clientOption.month, selectedYear:result.data[0]});
            }
            if(!res.data.clientOption.cycle && !res.data.clientOption.month && !res.data.clientOption.year){
                console.log("options set to default");
                const result = await axios.get(`${URL}/year`);
                setOptions({cycle:7, selectedMonth:date.getMonth()+1, selectedYear:result.data[0]});
            } else if (!res.data.clientOption.year){
                const result = await axios.get(`${URL}/year`);
                setOptions({cycle:res.data.clientOption.cycle, selectedMonth:res.data.clientOption.month, selectedYear:result.data[0]});
            }
        }
    )
}

//modification for deleted data
async function fetchAdminOption(){
    console.log("FetchAdminOption");
    await axios.get(`${URL}/fetchAdminOption`, { withCredentials: true  }).then(
        async res=>{
            console.log(res.data)
            // res.data.adminOption.toNavigate && setOptions({cycle:res.data.adminOption.cycle, selectedMonth:res.data.adminOption.month, selectedYear:res.data.adminOption.year});
            res.data.adminOption.toNavigate ? setToNavigate(res.data.adminOption.toNavigate) : setToNavigate(false);
            res.data.selectedItem && setSelectedItem(res.data.selectedItem.modify);
            if (res.data.adminOption.month && res.data.adminOption.year){
                const result = await axios.get(`${URL}/year`);
                const match = result.data.filter(items=>{
                    return items == res.data.adminOption.year;
                })
                match.length > 0 ? setOptions({cycle:res.data.adminOption.cycle, selectedMonth:res.data.adminOption.month, selectedYear:res.data.adminOption.year})
                : setOptions({cycle:res.data.adminOption.cycle, selectedMonth:res.data.adminOption.month, selectedYear:result.data[0].length > 0 ? result.data[0] : null});
                // console.log(`adminoption year:${res.data.adminOption.year}`);
                // console.log(`yearlist: ${result.data[0]}`);
                // console.log(`match: ${match}`);
            } else if (res.data.adminOption.year){
                const result = await axios.get(`${URL}/year`);
                setOptions({cycle:res.data.adminOption.cycle, selectedMonth:res.data.adminOption.month, selectedYear:result.data[0].length > 0 ? result.data[0] : null});
            }
        })
}

async function fetchUser(){
    console.log("fetchInitiate");
    await axios.get(`${URL}/SocPop`, { withCredentials: true  }).then(res=>{
        setSocPop(res.data);
    });
    try{
        // { withCredentials: true } is needed to set in axios, to be able send cookies back to server for deserialize
        await axios.get(`${URL}/IsLogIn`, { withCredentials: true  }/*, options*/) //for post/put/patch/delete request needs opstions
        //.then(res => res.json()) axios dont need to convert json
        .then(res => {
            const {admin, user_username, user_email, password, notFound} = res.data;//Need to initialize to be able to user in IF(statement)
            if(user_email || user_username){
                console.log("Userdata received!");
                setUser(res.data);//Update user after login success
                admin && fetchAdminOption();
                admin == null && fetchOption();
            } else if (password){
                setUser(null);
            } else if (notFound){
                setUser(null);
            }        
        })
    } catch(error){console.log(error.message);}
}

useEffect(()=>{
    fetchUser();
    //   let process = true;  
    //   if(process){
    // }
    //   return ()=>{
    //       process = false;//to stop executing continuously
    //   }
},[]);

function handleDoubleClick(event){
    const {date:val1, merchant:val2, amount:val3, fname:val4} = event.children;
    if(val4){
    setSelectedItem({
        id:event.id,
        date:val1.innerText,
        merchant:val2.innerText,
        amount:val3.innerText,
        fname:val4.innerText
    });
    } else {
    setSelectedItem({
        id:event.id,
        date:val1.innerText,
        merchant:val2.innerText,
        amount:val3.innerText,
        }); 
    }
}
//////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
    async function handleAdd(received){
        //if server is not present
        // setData((prev)=>{//using callback/function to pass previous value(prev) of data
        //     return([...prev, received]);//return the value to be use in setData (WHEN SERVER IS NOT YET PRESENT)
        // })
        
        var newDate = new Date(received.date);
        received = {
            entry_id: received.entry_id,
            date: `${newDate.getMonth()+1}/${newDate.getDate()}/${newDate.getFullYear()}`,
            merchant: received.merchant,
            amount: received.amount
        }
        //if server is present
        await axios.post(`${URL}/`, {...received, month:options.selectedMonth, cycle:options.cycle, year:options.selectedYear}, {withCredentials:true})//postData(hence use receieved) here is not updated when this is executed
        .then(res=>{
            console.log(res.data);
        })
        fetchOption();
    }
//////////////////////////////////////////////////////////////////
//insert the modified data received(from Modify.js) to the selected index(received.id) using SPLICE
//////////////////////////////////////////////////////////////////
    async function handleModify(received){
        //if server is not present
        // data.splice(received.id,1,{date: received.date, merchant: received.merchant, amount: received.amount})
        
        //if server is present
//setting the format of date below back to DD/MM/YYYY before sending to server, as the fetchData for date is MM/DD/YYYY
//to update the database. The default format for postgresql is DD/MM/YYYY
//adding + 1 to month below as the getMonth() value for January is 0 and for postgresql is 1
        var newDate = new Date(received.date);
        received = {
            id: received.id,
            // set to format month day year
            date: `${newDate.getMonth()+1}/${newDate.getDate()}/${newDate.getFullYear()}`,
            merchant: received.merchant,
            amount: received.amount
        }
        await axios.patch(`${URL}/update`, {...received, month:options.selectedMonth, cycle:options.cycle, year:options.selectedYear}, {withCredentials:true})
        .then(res=>{
            console.log(res.data);
        })
        !user.admin && fetchOption();
    }
//////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
    async function handleDelete(id){
        // Below if server is not present
        // setData(data.filter(function(item, index){
        //     // console.log(typeof index); index is a number
        //     // console.log(typeof id); id is a String
        //     return(index != id); //use single = to not include the typeof in comparing values    
        // })
        // );

        //if server is present pass the id/index
        const data = {id:id, month:options.selectedMonth, cycle:options.cycle, year:options.selectedYear};
        //for axios.delete if you set data axios wont send cookies even if you set withCredentials instead set "axios.defaults.withCredentials = true"
        await axios.delete(`${URL}/delete`, {data}, {withCredentials:true})//option here should be set as an object
        //for axios.delete option can have an optional {headers,data(always named as data)} where data holds the body or value to be pass
        .then(res=>{
            console.log(res.data);
        });
        !user.admin && fetchOption();
    }
//////////////////////////////////////////////////////////////////
    
    return (
    <div>
        <div className="container">
{/*passing value to Context.Provider (data/function as an OBJECT to all of the child)*/}
        <Context.Provider value={{user:user, selectedItem:selectedItem, total:total,
            options:options, toNavigate:toNavigate, URL:URL, popup:popup, socPop:socPop, setSocPop:setSocPop, setPopup:setPopup, fetchUser:fetchUser, setToNavigate:setToNavigate, setOptions:setOptions, setUser:setUser, setTotal:setTotal, onAdd:handleAdd, onModify:handleModify, onDoubleClick:handleDoubleClick,
            onDelete:handleDelete, setSelectedItem:setSelectedItem, fetchAdminOption:fetchAdminOption }}> {/*passing data to all of the child*/}

            <Router />
            
        </Context.Provider>
{/*//////////////////////////////////////////////////////////////////*/}
        </div>
     <footer className="prevent-select">{`©${date.getFullYear()} Kier Dalit. All rights reserved.`}</footer>       
    </div>
    );
}

export default App;