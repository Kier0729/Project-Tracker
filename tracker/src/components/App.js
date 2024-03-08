//facebook login uri// google redirect
//"proxy":"https://project-tracker-server-h8ni.onrender.com"
import React, {useState, useEffect} from "react"
import Context from "./Context"; //use for passing data to components/child using (Context.Provider)
import Router from "./Router";
import axios from "axios";
//react dont need to import dotenv package for env
//naming env content starts with REACT_APP_ and no "" for the values

function App(){
// const URL = process.env.REACT_APP_API_URL;
//Data received from server/api
//////////////////////////////////////////////////////////////////
const[data, setData] = useState([{entry_id: "", id: "", date: "", merchant: "", amount: ""}]);
//////////////////////////////////////////////////////////////////
const[adminData, setAdminData] = useState("");

const [user, setUser] = useState(null);//SHOULD INITIALIZE/DECLARE TYPEOF DATA {Object}/null

const[total, setTotal] = useState(null);

const [toNavigate, setToNavigate] = useState(false);

//////////////////////////////////////////////////////////////////

////////////////Store Data received selected value//////////////////////
const[selectedItem, setSelectedItem]=useState("");
//This will received the value of the element that triggers the event(check Entry.js)
//////////////////////////////////////////////////////////////////

const date = new Date();
const [options, setOptions] = useState({cycle:7, selectedMonth:date.getMonth()+1, selectedYear:date.getFullYear()})
const [yearList, setyearList] = useState(null);

//use for http request to api/server fetching data
//////////////////////////////////////////////////////////////////
async function axiosFetchData(){
    fetchYear();
    // if(isTrue){
        try{//option should be declared as an object // { withCredentials: true } to send back cookies to server
        await axios.post(`/fetch`, {month:options.selectedMonth, cycle:options.cycle, year:options.selectedYear}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
        //.then(res => res.json()) axios dont need to convert json
        .then((res) => { 
            setData(res.data);
            let sum = 0;
            if(res.data){ res.data.map(items => {
                sum = sum + items.amount;
            });
            setTotal(sum.toFixed(2)); } 
        })
    } catch(error){console.log(error.message);}
    // }
}
//////////////////////////////////////////////////////////////////

async function fetchYear(){
    await axios.get(`/year`).then(
        res => {
            setyearList(res.data);
            console.log("SetYearList")
            // console.log(res.data);
        }
    )
}

useEffect(()=>{
//   let process = true;
  async function fetchUser(){
    console.log("fetchInitiate");
//   if(process){
    try{
        // { withCredentials: true } is needed to set in axios, to be able send cookies back to server for deserialize
        await axios.get(`/IsLogIn`, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
        //.then(res => res.json()) axios dont need to convert json
        .then(res => {
            const {user_username, user_email, password, notFound} = res.data;//Need to initialize to be able to user in IF(statement)
            console.log(res.data);
            if(user_email || user_username){
                setUser(res.data);//Update user after login success
                axiosFetchData();//Then update data
            } else if (password){
                setUser(null);
            } else if (notFound){
                setUser(null);
            }        
        })

      } catch(error){console.log(error.message);}
    // }
  }
    fetchUser();
    

    // await axios.get(`fetch`, { withCredentials: true }/*, options*/)
//   return ()=>{
//       process = false;//to stop executing continuously
//   }
},[]);

function handleDoubleClick(event){
    const {date:val1, merchant:val2, amount:val3, fname:val4} = event.target.children;
    
    if(val4){
    setSelectedItem({
        id:event.target.id,
        date:val1.innerText,
        merchant:val2.innerText,
        amount:val3.innerText,
        fname:val4.innerText
    });} else {
        setSelectedItem({
            id:event.target.id,
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
        await axios.post("/", {...received, month:options.selectedMonth, cycle:options.cycle, year:options.selectedYear})//postData(hence use receieved) here is not updated when this is executed
        .then(res=>{
            setData(res.data);//Update the value of data
        })
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
        await axios.patch(`/update`, {...received, month:options.selectedMonth, cycle:options.cycle, year:options.selectedYear})
        .then(res=>{setData(res.data);})//Update the value of data
        fetchYear();
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
        await axios.delete(`/delete`, {data}, {withCredentials: true})//option here should be set as an object
        //for axios.delete option can have an optional {headers,data(always named as data)} where data holds the body or value to be pass
        .then(res=>{setData(res.data);})//Update the value of data
    }
//////////////////////////////////////////////////////////////////
    
    return (
    <div>
        <div className="container">
{/*passing value to Context.Provider (data/function as an OBJECT to all of the child)*/}
        <Context.Provider value={{user:user, data:data, yearList:yearList, selectedItem:selectedItem, total:total,
            options:options, adminData:adminData, toNavigate:toNavigate, setToNavigate:setToNavigate, setAdminData:setAdminData, setOptions:setOptions, setUser:setUser, setData:setData, setTotal:setTotal, onAdd:handleAdd, onModify:handleModify, onDoubleClick:handleDoubleClick,
            onDelete:handleDelete, axiosFetchData:axiosFetchData, fetchYear:fetchYear, setyearList:setyearList, setSelectedItem:setSelectedItem }}> {/*passing data to all of the child*/}

            <Router />
            
        </Context.Provider>
{/*//////////////////////////////////////////////////////////////////*/}
        </div>
     <footer>{`©${date.getFullYear()} Kier Dalit. All rights reserved.`}</footer>       
    </div>
    );
}

export default App;