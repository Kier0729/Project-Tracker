import axios from "axios";
import React, {useEffect, useContext, useState} from "react";
import Context from "./Context";
import {useNavigate} from "react-router-dom";

function Admin(){
    const data = useContext(Context);
    const date = new Date();
    const navigate = useNavigate();

    const[listUser, setListUser] = useState("");
    const[listId, setListId]= useState("");

    async function handleLogout(){
        await axios.get(`/Logout`, {withCredentials:true}).then((res)=>{
//waiting for api response .then to make sure that user is already logout.                
            data.setUser(res.data); //need to set to null for the Router.js condition in navigating (res.data here will be null)
            data.setData(null);
            data.setOptions({cycle:7, selectedMonth:date.getMonth()+1, selectedYear:date.getFullYear()});
            navigate("/");
        });
    }

    function handleChange(event){
        if(event.target.checked){
            setListId(prev=>{
            return [...prev, event.target.value];
        })
        } else {
            setListId(listId.filter(item=>{return item != event.target.value}));
        }
    }

    function fetchAll(){
        axios.get("/fetchAdmin",{ withCredentials: true }).then(
            res=>{
                setListUser(res.data);
            }
        );
    }

    function handleClick(event){
        let myData=[];
        listId.map(items=>{
            axios.post("/fetchDataAdmin",{id:items}, { withCredentials: true })
        .then(
            res=>{
                res.data.forEach(items => {
                    myData = [...myData, items];
                    data.setAdminData(prev=>{
                        return [...prev, items];
                    });
                });
                });
                console.log(myData);
            });
            //trying to save admin data to server
            console.log(myData);
            axios.post("/updateDataAdmin", data.adminData, { withCredentials: true });
            navigate("/AdminHome");
    }

    useEffect(()=>{
        fetchAll();
    },[]);

    return (
    <div>
        
        <h1>Admin</h1>
        <button onClick={handleClick}>View</button>
        <button onClick={handleLogout}>Logout</button>
        <div className="listUser">
        <h4>List of users</h4>
            <div>
            {listUser && listUser.map((items, index)=>{
                return(
                <label key={items.id}><input key={items.id} id={index} value={items.id} type="checkbox" onChange={handleChange}></input>{items.fname} {items.lname}</label>
                );
            })}
            </div>
            
        </div>

    </div>
    );
}

export default Admin;