import React, {useState, useEffect} from "react"
import Context from "./Context"; //use for passing data to components/child using (Context.Provider)
import Router from "./Router";
import axios from "axios";
//react dont need to import dotenv package for env
//naming env content starts with REACT_APP_ and no "" for the values

function App(){
const URL = process.env.REACT_APP_API_URL;
//Data received from server/api
//////////////////////////////////////////////////////////////////
const[data, setData] = useState([{id: "", date: "", merchant: "", amount: ""}]);
//////////////////////////////////////////////////////////////////

const [user, setUser] = useState({});//SHOULD INITIALIZE/DECLARE TYPEOF DATA {Object}
//useEffect executes when the program starts
//////////////////////////////////////////////////////////////////

useEffect(()=>{
//   let process = true;
  async function fetchUser(){
    console.log("fetchInitiate");
//   if(process){
    // console.log(`Before: ${user}`);
      try{
        // { withCredentials: true } is needed to set in axios, to be able send cookies back to server for deserialize
        await axios.get(`${URL}IsLogIn`, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
        //.then(res => res.json()) axios dont need to convert json
        .then(res => {
          setUser(res.data);
        //   console.log(`data received: ${res.data}`);          
        })
      } catch(error){console.log(error.message);}
    // }
  }
  
  fetchUser();
//   console.log("UseEffect Initiated!");
//   return ()=>{
//       process = false;//to stop executing continuously
//   }
},[]);

//use for http request to api/server fetching data
//////////////////////////////////////////////////////////////////
    async function axiosFetchData(isTrue){
        
        if(isTrue){
            try{
            await axios.get(process.env.REACT_APP_API_URL/*, options*/) //for post/put/patch/delete request needs opstions
            //.then(res => res.json()) axios dont need to convert json
            .then(res => {
                setData(res.data);
                // console.log("AxiosFetchData Executed!");
            })
        } catch(error){console.log(error.message);}
        }
    }
//////////////////////////////////////////////////////////////////

//useEffect executes when the program starts
//////////////////////////////////////////////////////////////////
    useEffect(()=>{
        let process = true;
        axiosFetchData(process);
        return ()=>{
            process = false;//to stop executing continuously
        }
    },[]);
//////////////////////////////////////////////////////////////////

////////////////Store Data received selected value//////////////////////
    const[selectedItem, setSelectedItem]=useState({
        id:"",
        date:"",
        merchant:"",
        amount:"",
    });

//This will received the value of the element that triggers the event(check Entry.js)
//////////////////////////////////////////////////////////////////
function handleDoubleClick(event){
    const {date:val1, merchant:val2, amount:val3} = event.target.children;
    setSelectedItem({
        id:event.target.id,
        date:val1.innerText,
        merchant:val2.innerText,
        amount:val3.innerText
    });
    // console.log(selectedItem);
}
//////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
    async function handleAdd(received){
        //if server is not present
        // setData((prev)=>{//using callback/function to pass previous value(prev) of data
        //     return([...prev, received]);//return the value to be use in setData (WHEN SERVER IS NOT YET PRESENT)
        // })
        
        //if server is present
        await axios.post(process.env.REACT_APP_API_URL, received)//postData(hence use receieved) here is not updated when this is executed
        .then(res=>{setData(res.data);})//Update the value of data
        
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
        //console.log(received);
        var newDate = new Date(received.date);
        // console.log(newDate);
        received = {
            id: received.id,
            date: `${newDate.getDate()}/${newDate.getMonth()+1}/${newDate.getFullYear()}`,
            merchant: received.merchant,
            amount: received.amount
        }
        await axios.patch(`${process.env.REACT_APP_API_URL}update`, received)
        .then(res=>{setData(res.data);})//Update the value of data
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
        const data = {id:id};
        await axios.delete(`${process.env.REACT_APP_API_URL}delete`, {data})//option here should be set as an object
        //for axios.delete option can have an optional {headers,data(always named as data)} where data holds the body or value to be pass
        .then(res=>{setData(res.data);})//Update the value of data
    }
//////////////////////////////////////////////////////////////////
    
    return (
    <div>
{/*passing value to Context.Provider (data/function as an OBJECT to all of the child)*/}
        <Context.Provider value={{user:user, data:data, selectedItem:selectedItem, setUser:setUser, onAdd:handleAdd, 
            onModify:handleModify, onDoubleClick:handleDoubleClick, 
            onDelete:handleDelete, axiosFetchData:axiosFetchData}}> {/*passing data to all of the child*/}

            <Router />
            
        </Context.Provider>
{/*//////////////////////////////////////////////////////////////////*/}
            
    </div>
    );
}

export default App;