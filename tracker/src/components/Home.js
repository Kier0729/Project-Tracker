import React, {useContext, useEffect, useState} from "react";
import CreateEntry from "./CreateEntry";
import Entry from "./Entry";
import Context from "./Context"; //use for passing data to components/child using (Context.Provider)
import NavBar from "./NavBar";
import axios from "axios";

function Home(){
    const data = useContext(Context); //passing the data received to a const data
    const [clientData, setClientData] = useState(data.data);

    async function fetchClientData(){
        console.log("fetchClientData");
        try{//option should be declared as an object // { withCredentials: true } to send back cookies to server //headers: myHeader,
            await axios.post(`${process.env.REACT_APP_API_URL}/fetch`, {month:data.options.selectedMonth, cycle:data.options.cycle, year:data.options.selectedYear}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
            //.then(res => res.json()) axios dont need to convert json
            .then((res) => { 
                setClientData(res.data);
                let sum = 0;
                if(res.data){ res.data.map(items => {
                    sum = sum + items.amount;
                });
                data.setTotal(sum.toFixed(2)); } 
            })
        } catch(error){console.log(error.message);}
    }

    useEffect(()=>{
        !data.user.admin && fetchClientData();    
    },[]);

    return(
        <div>
            <NavBar />
            {/* select to ONLY pass the selected data/function for practice*/}
            <Context.Provider value={{id:data.user.id, onAdd:data.onAdd, axiosFetchData:data.axiosFetchData, fetchYear:data.fetchYear}}>
                <CreateEntry />
            </Context.Provider>

            {
            clientData && clientData.map((items, index)=>{ //map can also pass the index //check the value of data.data
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