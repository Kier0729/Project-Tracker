import React, {useState} from "react"
import Context from "./Context"; //use for passing data to components/child using (Context.Provider)
import Router from "./Router";

function App(){

//Data received from server///////////////////////////////////////
    const[data, setData] = useState([
        {date: "1", merchant: "x", amount: "1.00"},
        {date: "2", merchant: "y", amount: "2.00"},
        {date: "3", merchant: "z", amount: "3.00"}
    ]);
//////////////////////////////////////////////////////////////////

////////////////Data received selected value//////////////////////
    const[selectedItem, setSelectedItem]=useState({
        id:"",
        date:"",
        merchant:"",
        amount:"",
    });

//This will received the value of the element that triggers the event(check Entry.js)///
function handleDoubleClick(event){
    const {date:val1, merchant:val2, amount:val3} = event.target.children;
    setSelectedItem({
        id:event.target.id,
        date:val1.innerText,
        merchant:val2.innerText,
        amount:val3.innerText
    });
    // console.log(selectedItem);
}
//////////////////////////////////////////////////////////////////

    function handleAdd(received){
        setData((prev)=>{//using callback/function to pass previous value(prev) of data
            return([...prev, received]);//return the value to be use in setData
        })
    }
//insert the modified data received(from Modify.js) to the selected index(received.id) using SPLICE
    function handleModify(received){
        // console.log(data.splice(received.id,1,{date: received.date, merchant: received.merchant, amount: received.amount}));
        // setSelectedItem(()=>{
        //     return (
                data.splice(received.id,1,{date: received.date, merchant: received.merchant, amount: received.amount})
                // );
    // });
    }

    function handleDelete(id){
        setData(data.filter(function(item, index){
            // console.log(typeof index); index is a number
            // console.log(typeof id); id is a String
            return(index != id); //use single = to not include the typeof in comparing values    
        })
        );
    }
    
    return (
    <div>
{/*passing value to Context.Provider (data/function as an OBJECT to all of the child)*/}
        <Context.Provider value={{data:data, selectedItem:selectedItem, onAdd:handleAdd, 
            onModify:handleModify, onDoubleClick:handleDoubleClick, 
            onDelete:handleDelete}}> {/*passing data to all of the child*/}

            <Router />

        </Context.Provider>
{/*//////////////////////////////////////////////////////////////////*/}
    </div>
    );
}

export default App;