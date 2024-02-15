import React, {useState, useContext} from "react";
import CreateEntry from "./CreateEntry";
import Entry from "./Entry";
import Context from "./Context"; //use for passing data to components/child using (Context.Provider)

function Home(){
     const data = useContext(Context); //passing the data received to a const data

    return(
        <div>
            <div>
                <h3>Login under: {data.user.fname} {data.user.lname}</h3>
            </div>
            <Context.Provider value={data.onAdd}>{/* select to ONLY pass the function onAdd check Apps.js*/}
                <CreateEntry />
            </Context.Provider>

            {data.data.map((items, index)=>{ //map can also pass the index //check the value of data.data
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
            }  
            )}
        </div>

    );
}

export default Home;