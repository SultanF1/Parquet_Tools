import { useEffect, useState } from "react";
import {Route, Routes} from "react-router-dom"
import ConvertFromCsv from "./components/ConvertFromCsv";
import Home from "./components/Home";
import Login from "./components/Login";
import ReadCsv from "./components/ReadCsv";
import WriteParquet from "./components/WriteParquet";


function App() {

  useEffect(() => {
    document.title = "Parquet Tools"
  }, [])
  return (
    <div className="bg">
      
      <Routes>
        <Route path="/" exact element={<Login/>}/>
        <Route path="/home" element={<Home/>}/> 
        <Route path="/read" element={<ReadCsv/>}/>
        <Route path="/write" element={<WriteParquet/>}/>
        <Route path="/convert-csv" element={<ConvertFromCsv/>}/>
      </Routes>
      
      
    </div>
  );
}

export default App;
