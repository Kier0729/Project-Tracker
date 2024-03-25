import {HashRouter, Routes, Route, Outlet, Navigate} from "react-router-dom"; //for frontend routing
//BrowserRouter
import Modify from "./Modify";
import Home from "./Home";
import Login from "./Login";
import Admin from "./Admin";
import Register from "./Register";
import AdminHome from "./AdminHome";
import React, { useContext, useEffect } from "react";
import Context from "./Context"
import Extract from "./extract/Extract";

function Router(){
  const data = useContext(Context);
  const user = data.user;//user in App.js need to be declare/initialize as an object {}/null
  const isAdmin = value();
  const isAdmin2 = value2();

  function value(){
    if(user){
      if(user.admin){
        return (data.toNavigate ? <AdminHome /> : <Admin />);
      } else {
        return <Home />;
      }
    } else {
      return <Navigate to="/"/>;
    } 
  }
  function value2(){
    if(data.toNavigate){
        return <AdminHome />;
    } else {
      return <Navigate to="/"/>;
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

  return (
    <div className="App">
      <HashRouter>
        <Routes>
            <Route path={`/`} element={<Layout />}>{/*Parent*/}
            <Route path={`/`} element={!user ? <Login /> : <Navigate to="/Home" />}/>{/*Outlet/Child*/}
            <Route path={`/Register`} element={<Register />}/>{/*Outlet/Child*/}
            {/* <Route path="/Home" element={user ? <Home /> : <Navigate to="/" />}/> Outlet/Child */}
            <Route path={`/Home`} element={isAdmin}/> {/*Outlet/Child*/}
            <Route path={`/Modify`} element={data.selectedItem && <Modify />}/>{/*Outlet/Child*/}
            <Route path={`/AdminHome`} element={isAdmin2} />{/*Outlet/Child*/}
          </Route>
        </Routes>
    </HashRouter>
    </div>
  );
}

export default Router;