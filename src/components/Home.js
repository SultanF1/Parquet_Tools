import { useEffect, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../ firebaseConfig";
import { Col, Row, Space, Table, Tag } from 'antd';
import { Menu } from 'antd';
import {useLocation, useNavigate} from "react-router-dom"
import Navbar from "./Navbar";
import "../stylesheets/style.css"
import picture from "../images/1*QEQJjtnDb3JQ2xqhzARZZw.png"

function Home() {
    
    const location = useLocation();
    const navigate = useNavigate();
    


    return (      
      <>
      <Navbar/>
      
      <div className="head">
        <Row justify="center">
      <Col span={18}>
        <h2>Apache Parquet</h2>
        <p>Parquet is an open source file format built to handle flat columnar storage data formats. Parquet operates well with complex data in large volumes.It is known for its both performant data compression and its ability to handle a wide variety of encoding types.</p>
        <br></br>
        <h2>Why Parquet</h2>
        <or>
          <div className="home">
          <li>Good for storing big data of any kind (structured data tables, images, videos, documents).</li>
          <li>Saves on cloud storage space by using highly efficient column-wise compression, and flexible encoding schemes for columns with different data types.</li>
          <li>Increased data throughput and performance using techniques like data skipping, whereby queries that fetch specific column values need not read the entire row of data.</li>
          </div>
        </or>
        <br></br>
        <h2>How Does Parquet Store Data</h2>
        <p>When we convert a 2-dimensional table to a sequence of 0’s and 1’s, we must think carefully about the optimal structure.<br></br>Traditionally there are three main layouts that convert our 2 dimensional table down to 1:</p>
        <div className="home">
        <or>
          <li><strong>Row-based:</strong> sequentially store rows (CSV).</li>
          <li><strong>Column-based</strong>: sequentially store columns (ORC).</li>
          <li><strong>Hybrid-base:</strong> sequentially store chunks of columns (Parquet).</li>
        </or>
        </div>
        <br></br>
        <img src={picture} alt="layout format" width={"85%"} height={"auto"}/>
        <br></br><br></br><br></br>
        <h2>Parquet Encoding</h2>
        <p>Since parquet uses hybrid storage, values of the same type are number stored together. This opens up a whole world of optimisation tricks that aren’t available when we save data as rows, e.g. CSV files.</p>
        <h3>Run length encoding</h3>
        <p>Suppose a column just contains a single value repeated on every row. Instead of storing the same number over and over (as a CSV file would), we can just record “value X repeated N times”. This means that even when N gets very large, the storage costs remain small. If we had more than one value in a column, then we can use a simple look-up table. In parquet, this is known as run length encoding. If we have the following column:(4, 4, 4, 4, 4, 1, 2, 2, 2, 2)<br></br>This would be stored as:</p>
        <or>
          <li>value 4, repeated 5 times</li>
          <li>value 1, repeated once</li>
          <li>value 2, reported 4 times</li>
        </or>
        <br></br><br></br>
        <h3>Dictionary encoding</h3>
        <p>Suppose we had the following character vector<br></br>("Jumping Rivers", "Jumping Rivers", "Jumping Rivers")<br></br>If we want to save storage, then we could replace Jumping Rivers with the number 0 and have a table to map between 0 and Jumping Rivers. This would significantly reduce storage, especially for long vectors.</p>
        <br></br>
        <h3>Delta encoding</h3>
        <p>This encoding is typically used in conjunction with timestamps. Times are typically stored as Unix times, which is the number of seconds that have elapsed since January 1st, 1970. This storage format isn’t particularly helpful for humans, so typically it is pretty-printed to make it more palatable for us.<br></br>If we have a large number of time stamps in a column, one method for reducing file size is to simply subtract the minimum time stamp from all values. For example, instead of storing: <br></br>(1628426074, 1628426078, 1628426080)<br></br>we would store <br></br>(0, 4, 6), with the corresponding offset 1628426074.</p>
        </Col>
        </Row>
      </div>
      
      </>
    );
}

export default Home