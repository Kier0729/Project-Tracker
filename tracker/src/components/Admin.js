import axios from "axios";
import React, {useEffect, useContext, useState} from "react";
import Context from "./Context";
import NavBar from "./NavBar";
import Popup from "./popup/Popup";

function Admin(){
    const data = useContext(Context);
    // axios.defaults.withCredentials = true;
    
    //this two and fetchAll() should be declare here(Admin.js) for avoiding infinite loop if it was called in (Apps.js)
    const[listUser, setListUser] = useState("");
    const[listId, setListId]= useState("");

    function handleChange(event){
        if(event.target.checked){
            setListId(prev=>{
            return [...prev, event.target.value];
        })} else {
            setListId(listId.filter(item=>{
            return item != event.target.value
        }));
        }
    }
    async function fetchAll(){
        await axios.get(`${data.URL}/fetchAdmin`,{ withCredentials: true  }).then(
            res=>{
                setListUser(res.data.listUser);
            }
        );
    }

    useEffect(()=>{
        fetchAll();
        data.socPop && data.user.admin && data.setPopup(`Login Successful. \nWelcome ${data.user.fname}.`);
    },[]);

    return (
    <div>
        <Popup />
        <Context.Provider value={{...data, listId:listId, setListId:setListId}}>
        <NavBar />
        </Context.Provider>
        
        <div className="listUser">
        <h4>List of client accounts</h4>
            <div>
            {listUser && listUser.map((items, index)=>{
                return(
                !items.admin && <label key={items.id}><input key={items.id} id={index} value={items.id} type="checkbox" onChange={handleChange}></input>{items.fname} {items.lname}</label>
                );
            })}
            </div>
            
        </div>

    </div>
    );
}

export default Admin;