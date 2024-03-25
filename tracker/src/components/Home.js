import React, {useContext, useEffect, useState} from "react";
import CreateEntry from "./CreateEntry";
import Entry from "./Entry";
import Context from "./Context"; //use for passing data to components/child using (Context.Provider)
import NavBar from "./NavBar";
import axios from "axios";
import Popup from "./popup/Popup";
import Extract from "./extract/Extract";

function Home(){
    const data = useContext(Context); //passing the data received to a const data
    const [clientData, setClientData] = useState("");
    const [clientExtract, setClientExtract] = useState(false);

    async function fetchOption(){
        console.log("Fetch Option");
        await axios.get(`${process.env.REACT_APP_API_URL}/fetchOption`).then(
            async res=>{
                if (res.data.clientOption.month && res.data.clientOption.year){
                    const result = await axios.get(`${process.env.REACT_APP_API_URL}/year`);
                    const match = result.data.filter(items=>{
                        return items == res.data.clientOption.year;
                    })
                    if(match.length == 0){
                        const result2 = await axios.post(`${process.env.REACT_APP_API_URL}/fetch`, {month:res.data.clientOption.month, cycle:res.data.clientOption.cycle, year:result.data[0]}, { withCredentials: true }/*, options*/); //for post/put/patch/delete request needs opstions
                        setClientData(result2.data);
                        let sum = 0;
                        if(result2.data){ result2.data.map(items => {
                            sum = sum + items.amount;
                        });
                        data.setTotal(sum.toFixed(2)); }
                    }
                    else if(match.length > 0){
                        const result2 = await axios.post(`${process.env.REACT_APP_API_URL}/fetch`, {month:res.data.clientOption.month, cycle:res.data.clientOption.cycle, year:res.data.clientOption.year}, { withCredentials: true }/*, options*/); //for post/put/patch/delete request needs opstions
                        setClientData(result2.data);
                        let sum = 0;
                        if(result2.data){ result2.data.map(items => {
                            sum = sum + items.amount;
                        });
                        data.setTotal(sum.toFixed(2)); }
                    }
                }
                else {
                    const result2 = await axios.post(`${process.env.REACT_APP_API_URL}/fetch`, {month:data.options.selectedMonth, cycle:data.options.cycle, year:data.options.selectedYear}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
                    setClientData(result2.data);
                        let sum = 0;
                    if(result2.data){result2.data.map(items => {
                        sum = sum + items.amount;
                    });
                        data.setTotal(sum.toFixed(2)); }
                }
            }
        )
    }

    useEffect(()=>{
        !data.user.admin && fetchOption();
        data.socPop && data.user && data.setPopup(`Login Successful. \nWelcome ${data.user.fname}.`);   
    },[]);

    return(
        <div>
            {   
                <Context.Provider value={{clientData:clientData, clientExtract:clientExtract, setClientExtract:setClientExtract, ...data}} >
                    <Extract />
                    {!clientExtract && <NavBar />}
                </Context.Provider>
            }

            {!clientExtract && <Popup />}
            {/* select to ONLY pass the selected data/function for practice*/}
            <Context.Provider value={{id:data.user.id, onAdd:data.onAdd, fetchYear:data.fetchYear}}>
                {!clientExtract && <CreateEntry />}
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
                {!clientExtract && <Entry />}
            </Context.Provider>
            );
            })
            }
        </div>
    );
}

export default Home;