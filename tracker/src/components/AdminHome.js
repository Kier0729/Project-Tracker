import React, {useContext, useState, useEffect} from "react";
import Entry from "./Entry";
import Context from "./Context"; 
import axios from "axios";
import NavBar from "./NavBar";

function AdminHome(){
    const data = useContext(Context);
    // axios.defaults.withCredentials = true;
    const [adminData, setAdminData] = useState("");

    //MODIFY/ADMIN HOME hypo fetchadminoption should be called when adminhome render then fetch data
    //remove fetchadminoption in modify.js for save button
    
    // async function fetchAdminOption(){
    //     console.log("FetchAdminOption");
    //     await axios.get(`${data.URL}/fetchAdminOption`, { withCredentials: true  }).then(
    //         async res=>{
    //             // res.data.adminOption.toNavigate && setOptions({cycle:res.data.adminOption.cycle, selectedMonth:res.data.adminOption.month, selectedYear:res.data.adminOption.year});
    //             res.data.adminOption.toNavigate && setToNavigate(res.data.adminOption.toNavigate);
    //             res.data.selectedItem && setSelectedItem(res.data.selectedItem.modify);
    //             if (res.data.adminOption.month && res.data.adminOption.year){
    //                 const result = await axios.get(`${data.URL}/year`);
    //                 const match = result.data.filter(items=>{
    //                     return items == res.data.adminOption.year;
    //                 })
                    
    //                 res.data.adminOption.toNavigate && match.length > 0 ? setOptions({cycle:res.data.adminOption.cycle, selectedMonth:res.data.adminOption.month, selectedYear:res.data.adminOption.year})
    //                 : setOptions({cycle:res.data.adminOption.cycle, selectedMonth:res.data.adminOption.month, selectedYear:result.data[0]});
    //                 // console.log(`adminoption year:${res.data.adminOption.year}`);
    //                 // console.log(`yearlist: ${result.data[0]}`);
    //                 // console.log(`match: ${match}`);
    //             }
    //         })
    // }

    async function fetchAll(){
        console.log("fetchAdminHome");
        try{//option should be declared as an object // { withCredentials: true } to send back cookies to server //headers: myHeader,
            const result = await axios.post(`${process.env.REACT_APP_API_URL}/fetch`, {month:data.options.selectedMonth, cycle:data.options.cycle, year:data.options.selectedYear, toNavigate:data.toNavigate}, { withCredentials: true }/*, options*/) //for post/put/patch/delete request needs opstions
                setAdminData(result.data);
                console.log(result.data);
                let sum = 0;
                if(result.data){result.data.map(items => {
                    sum = sum + items.amount;
                });
                data.setTotal(sum.toFixed(2)); }
        } catch(error){console.log(error.message);}
    }

    useEffect(()=>{
        // setTimeout(()=>{
        fetchAll();
        // }, 500);
    },[]);
            
    return (
        <div className="adminHome">
            <NavBar />
            {
            adminData && adminData.map((items, index)=>{ //map can also pass the index
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

export default AdminHome;