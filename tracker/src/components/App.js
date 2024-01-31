import React, {useState} from "react"
import Context from "./Context"; //use for passing data to components/child using (Context.Provider)
import Router from "./Router";

function App(){
    const[data, setData] = useState([
        {date: "1", merchant: "x", amount: "1.00"},
        {date: "2", merchant: "y", amount: "2.00"},
        {date: "3", merchant: "z", amount: "3.00"}
    ]);

    const [value , setValue] = useState();

    function handleAdd(received){
        setData((prev)=>{//using callback/function to pass previous value(prev) of data
            return([...prev, received]);//return the value to be use in setData
        })
    }

    function handleModify(received){
        setValue(received);
        // console.log(received);
    }
    
    return (
    <div>
        {/* <Context.Provider value={handleAdd}> 
        <CreateEntry />
        </Context.Provider>
        
        {data.map((items, index)=>( //map can also pass the index
            //using Context.Provider below passing a key and value to the Entry (using spread operator ... 
            //to create a new array and include "id" inside the "items" )
            <Context.Provider key={index} value={{...items, id:index, handleAdd}}> 
                <Entry />
            </Context.Provider>
        ))} */}
{/*passing data/function as an OBJECT to all of the child*/}
        <Context.Provider value={{data:data, onAdd:handleAdd, onModify:handleModify, value:value}}> {/*passing data to all of the child*/}
            <Router />{/**/}
        </Context.Provider>
    </div>
    );
}

export default App;