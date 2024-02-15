import {BrowserRouter, Routes, Route, Outlet, Navigate} from "react-router-dom"; //for frontend routing
import Modify from "./Modify";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import React, { useContext, useEffect } from "react";
import Context from "./Context"
import axios from "axios";

function Router(){
  const data = useContext(Context);
  const user = data.user;//user in App.js need to be declare/initialize as an object {}
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
          <Route path="/" element={<Layout />}>{/*Parent*/}
            <Route path="/" element={!user ? <Login /> : <Navigate to="/Home" />}/>{/*Outlet/Child*/}
            <Route path="/Register" element={<Register />}/>{/*Outlet/Child*/}
            <Route path="/Home" element={user ? <Home /> : <Navigate to="/" />}/>Outlet/Child
            <Route path="/modify" element={user ? <Modify /> : <Navigate to="/" />}/>{/*Outlet/Child*/}
          </Route>
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default Router;