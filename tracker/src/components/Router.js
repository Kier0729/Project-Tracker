import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom"; //for frontend routing
import Modify from "./Modify";
import Home from "./Home";

function Router(){
    function Layout(){
        return(
        <>
            <Outlet />
        </>
        );
    }
 
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>{/*Parent*/}
            <Route path="/" element={<Home />}/>{/*Outlet/Child*/}
            <Route path="/modify" element={<Modify />}/>{/*Outlet/Child*/}
          </Route>
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default Router;