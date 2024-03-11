import {BrowserRouter, Routes, Route, Outlet, Navigate} from "react-router-dom"; //for frontend routing
import Modify from "./Modify";
import Home from "./Home";
import Login from "./Login";
import Admin from "./Admin";
import Register from "./Register";
import AdminHome from "./AdminHome";
import React, { useContext, useEffect } from "react";
import Context from "./Context"

function Router(){
    
  const data = useContext(Context);
  const user = data.user;//user in App.js need to be declare/initialize as an object {}/null
  const isAdmin = value();

  function value(){
    if(user){
      if(user.admin){
        return (data.selectedItem.fname ? <Navigate to="/AdminHome"/> : <Admin />);
      } else {
        return <Home />;
      }
    } else {
      return (<Navigate to="/"/>);
    } 
  }

  function Layout(){
        return(
        <>
            <Outlet />
        </>
        );
    }
 
//////////////////////////////////////////////////////////////////
// console.log(`After: ${user}`);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path={`/`} element={<Layout />}>{/*Parent*/}
            <Route path={`/`} element={!user ? <Login /> : <Navigate to="/Home" />}/>{/*Outlet/Child*/}
            <Route path={`/Register`} element={<Register />}/>{/*Outlet/Child*/}
            {/* <Route path="/Home" element={user ? <Home /> : <Navigate to="/" />}/> Outlet/Child */}
            <Route path={`/Home`} element={isAdmin}/> {/*Outlet/Child*/}
            <Route path={`/Modify`} element={user ? <Modify /> : <Navigate to="/" />}/>{/*Outlet/Child*/}
            <Route path={`/AdminHome`} element={user ? <AdminHome /> : <Login />} />{/*Outlet/Child*/}
          </Route>
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default Router;