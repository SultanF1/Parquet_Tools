import { Button, Col, Row, Table } from "antd";
import { Menu } from 'antd';
import { useEffect, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../ firebaseConfig";
import axios from "axios"
import Navbar from "./Navbar";

function ReadCsv(){

    const location = useLocation();
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([])
    const [columns, setColumns] = useState([])
    const [data, setData] = useState({})
    const [fail, setFail] = useState(false)
       // State to store uploaded file
       const [file, setFile] = useState("");
 
       // progress
       const [percent, setPercent] = useState(0);
    
       // Handle file upload event and update state
       function handleChange(event) {
           setFile(event.target.files[0]);
       }
    
       const handleUpload = () => {
           if (!file) {
               alert("Please upload an image first!");
           }
    
           const storageRef = ref(storage, `/${location.state.name}/parquet/${file.name}`);
    
           // progress can be paused and resumed. It also exposes progress updates.
           // Receives the storage reference and the file to upload.
           const uploadTask = uploadBytesResumable(storageRef, file);
    
           uploadTask.on(
               "state_changed",
               (snapshot) => {
                   const percent = Math.round(
                       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                   );
    
                   // update progress
                   setPercent(percent);
               },
               (err) => console.log(err),
               () => {
                   // download url
                   getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                       console.log(url);
                   });
               }
           );
       };
    function read(){
         axios.get('getData?' + new URLSearchParams({
            name: location.state.name,
            onDownloadProgress: progressEvent => {
                const total = parseFloat(progressEvent.currentTarget.responseHeaders['Content-Length'])
                const current = progressEvent.currentTarget.response.length
                let percentCompleted = Math.floor(current / total * 100)
                console.log('completed: ', percentCompleted)
              }
        })).then(res => {
            setDataSource(...dataSource, res.data.dataSource)
            setColumns(...columns, res.data.columns)
            console.log(res.status)
            if (res.status !== 200){
                setFail(true)
            } 
        })}
    
    return (
        <>
        <Navbar/>
        <div className="head">
        <h3>This function allows you to read a parquet file in a table format.</h3>
            <or>
                <li>The memory available is limited, this function is meant for testing</li>
                <li>The security side of the application is not tested, refer from uploading classified files</li>
                <li>Make sure that the file uploaded ends with .parquet</li>
            </or>
      <br></br>
      <Row justify="center">
        <Col span={20}>
            
            <br></br><br></br>
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>Upload The File</Button>
            <p>{percent}% done</p>
            <br></br>
            <Button onClick={read}>Read File</Button>
      {columns.length >0 ? (
                <>
                <br></br><br></br>
                <Table dataSource={dataSource} columns={columns} />
                </>
            ): (
                <p></p>
            )}
        {fail ? (
            <p>Faced an issue, try again</p>
        ):
        (
            <p></p>
        )}
            </Col>
        </Row>
      </div>
      </>
    );
}


export default ReadCsv;