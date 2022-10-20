import { Button, Col, Row, Table } from "antd";
import { Menu } from 'antd';
import { useEffect, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../ firebaseConfig";


function ConvertFromCsv(){

    const location = useLocation();
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([])
    const [columns, setColumns] = useState([])
    useEffect(() => {
        fetch('getData?' + new URLSearchParams({
            name: location.state.name,
        })).then(res => res.json()).then(json => {
            setDataSource(json.dataSource)
            setColumns(json.columns)
        })
        
    },[])

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
               alert("Please upload a file first!");
           }
           
           const storageRef = ref(storage, `/${location.state.name}/csv/${file.name}`);
    
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
       async function read(){
        await fetch('getData?' + new URLSearchParams({
            name: location.state.name,
        })).then(res => res.json()).then(json => {
            setDataSource(json.dataSource)
            setColumns(json.columns)
        })
       }
    return (
        <div className="bg">
        <Menu mode="horizontal" defaultSelectedKeys={[location.state.page]} theme="dark" >
        <Menu.Item key="home" onClick={() => {
            navigate("/home", {state:{name:location.state.name,page:"home"}})
        }}>
          Home
        </Menu.Item>
        <Menu.Item key="read" onClick={() => navigate("/read", {state:{name:location.state.name,page:"read"}})}>
          Read Parquet
        </Menu.Item>

        <Menu.Item key="writeParquet" onClick={() => navigate("/write", {state:{name:location.state.name,page:"write"}})}>
          Write Parquet
        </Menu.Item>
        
      </Menu>
      <br></br>
      <Row justify="center">
        <Col span={20}>
      <input type="file" onChange={handleChange}/>
            <button onClick={handleUpload}>Upload to Firebase</button>
            <p>{percent} "% done"</p>
            <br></br>
            <Button onClick={read}>Read File</Button>

            </Col>
        </Row>
      </div>
    );
}


export default ConvertFromCsv;