import { useEffect, useState } from "react";
import "../App.css"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../ firebaseConfig";
import { Col, Row, Space, Table, Tag } from 'antd';
import { Menu } from 'antd';
import {useLocation, useNavigate} from "react-router-dom"

function Home() {
    
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location)
    return (
        <div className="bg">
        <Menu mode="horizontal" defaultSelectedKeys={[location.state.page]} theme="dark" >
        <Menu.Item key="home">
          Home
        </Menu.Item>
        <Menu.Item key="readParquet" onClick={() => navigate("/read", {state:{name:location.state.name,page:"read"}})}>
          Read Parquet
        </Menu.Item>

        <Menu.Item key="writeParquet" onClick={() => navigate("/write", {state:{name:location.state.name,page:"write"}})}>
          Write Parquet
        </Menu.Item>
        
      </Menu>
      </div>
    );
}

export default Home