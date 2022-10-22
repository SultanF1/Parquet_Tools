import { Button, Col, Row, Table } from "antd";
import { Menu } from 'antd';
import { useEffect, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../ firebaseConfig";
import Navbar from "./Navbar";
import "../stylesheets/style.css"
function ConvertFromCsv(){

    const location = useLocation();
    

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
            alert("Please upload a file first");
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
    const [url, setUrl] = useState("")
    async function convert(){
    await fetch('convertcsv?' + new URLSearchParams({
        name: location.state.name,
    })).then(res => res.json()).then(json => {
        setUrl(json)
    })
    
    }
    return (
        <>
        <Navbar/>
        <br></br>
        <Row justify="center">
        <Col span={20}>
        <div className="head">
        <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>Upload The File</Button>
            <p>{percent}% done</p>
            <br></br>
            <Button onClick={convert}>Convert</Button>
            {url ? (
            <Button href={url}>Download Parquet File</Button>
        ): (
            <p></p>
        )}
        </div>
            </Col>
        </Row>
        </>
    );
}


export default ConvertFromCsv;