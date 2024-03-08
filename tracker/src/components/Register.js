import React, {useState, useContext} from "react";
import { Link, useNavigate } from "react-router-dom"; //for frontend routing//import useNavigate
import axios from "axios";
import Context from "./Context"

function Register(){
    const navigate = useNavigate(); //creating a constant for useNavigate(cannot be called inside a callback)
    const data = useContext(Context);

    const[cred, setCred] = useState({username:"", password:"", rePassword:"", fname:"", lname:""});
    const[placeHold, setplaceHold] = useState(null);
    
    function handleChanged(event){
        const{name, value} = event.target;

        setCred((prev)=>{
            if(name == "username"){
                return{
                    username: value,//set input to lowercase for email 
                    password: prev.password, 
                    rePassword: prev.rePassword, 
                    fname: prev.fname, 
                    lname: prev.lname 
                };
            } else if (name == "password"){
                return{
                    username: prev.username, 
                    password: value, 
                    rePassword: prev.rePassword, 
                    fname: prev.fname, 
                    lname: prev.lname 
                };
            } else if (name == "rePassword"){
                return{
                    username: prev.username, 
                    password: prev.password, 
                    rePassword: value, 
                    fname: prev.fname, 
                    lname: prev.lname 
                };
            } else if (name == "fname"){
                return{
                    username: prev.username, 
                    password: prev.password, 
                    rePassword: prev.rePassword, 
                    fname: value, 
                    lname: prev.lname 
                };
            } else if (name == "lname"){
                return{
                    username: prev.username, 
                    password: prev.password, 
                    rePassword: prev.rePassword, 
                    fname: prev.fname, 
                    lname: value 
                };
            }
        });
    }

    async function handleClick(event){
        const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
            if(cred.username && cred.username.length && cred.username.match(isValidEmail)){
                if(cred.password == cred.rePassword){
                    setplaceHold(null);
                    event.preventDefault();
                    // document.register.submit();
                    await axios.post(`${data.URL}/Register`, {...cred, username:cred.username.toLowerCase()}, {headers: data.myHeader})
                    .then(res=>{
                        data.setUser(res.data);
                        data.axiosFetchData();//Then update data
                        // console.log(res.data);
                        res.data ? navigate("/Home") : navigate("/");
                    });//
                } else {
                    setCred((prev)=>{
                        return {
                            username: prev.username, 
                            password: "", 
                            rePassword: "", 
                            fname: prev.fname, 
                            lname: prev.lname 
                        };
                    });
                    event.preventDefault();
                    setplaceHold("Password mismatched!");
                }
            } else {
                setCred((prev)=>{return {username:"", password:prev.password}});
                setplaceHold("Enter a valid email.")
                // navigate("/Register");
            }
        }

return(<div className="register">

    <form id="register" name="register" onSubmit={handleClick}>
        <input name="username" type="email" value={cred.username} placeholder="Username" onChange={handleChanged} required></input>
        <input name="password" type="password" value={cred.password} placeholder={placeHold || "Password"} onChange={handleChanged} required></input>
        <input name="rePassword" type="password" value={cred.rePassword} placeholder={placeHold || "Re-Enter Password"} onChange={handleChanged} required></input>
        <input name="fname" type="text" value={cred.fname} placeholder="First Name" onChange={handleChanged} required></input>
        <input name="lname" type="text" value={cred.lname} placeholder="Last Name" onChange={handleChanged} required></input>
    <div>
            <div></div>
            <div className="button">
                <button type="submit">Register</button>
                <Link to="/"><button>Cancel</button></Link>
            </div>        
        </div>
    </form>
</div>);
}

export default Register;