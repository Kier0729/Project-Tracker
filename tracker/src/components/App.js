import React, {useState} from "react"
import CreateEntry from "./CreateEntry";
import Entry from "./Entry";
import Context from "./Context"; //use for passing data to components/child using (Context.Provider)

function App(){
    const[data, setData] = useState([
        {date: "1", merchant: "x", amount: "1.00"},
        {date: "2", merchant: "y", amount: "2.00"},
        {date: "3", merchant: "z", amount: "3.00"}
    ]);

    function handleAdd(received){
        setData((prev)=>{//passing previous value
            return([...prev, received]);//return the value to be use in setData
        })
    }
    
    return (
    <div>
        <Context.Provider value={handleAdd}> 
        <CreateEntry />
        </Context.Provider>
        
        {data.map((items, index)=>( //map can also pass the index
            //using Context.Provider below passing a key and value to the Entry (using spread operator ... 
            //to create a new array and include "id" inside the "items" )
            <Context.Provider key={index} value={{...items, id:index, handleAdd}}> 
                <Entry />
            </Context.Provider>
        ))}
    </div>
    );
}

export default App;