import { useEffect, useState } from "react";
import {Route, Routes} from "react-router-dom"
import Home from "./components/Home";
import Login from "./components/Login";
import ReadCsv from "./components/ReadCsv";
import WriteParquet from "./components/WriteParquet";


function App() {

  
  return (
    <div>
      
      <Routes>
        <Route path="/" exact element={<Login/>}/>
        <Route path="/home" element={<Home/>}/> 
        <Route path="/read" element={<ReadCsv/>}/>
        <Route path="/write" element={<WriteParquet/>}/>
      </Routes>
      
      
    </div>
  );
}

export default App;
