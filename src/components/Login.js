import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { Col, Row, Progress } from 'antd';
import { useState, useEffect } from 'react';
import storage from '../ firebaseConfig';
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from 'uuid';
import "../stylesheets/style.css"


function Login(){
    const navigate = useNavigate()
    const [name, setName] = useState("")    
    const [progress, setProgress] = useState(0)
    const unique_id = uuid();
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    useEffect(
      () => {
        var start = Date.now();
        setInterval(function() {
            var delta = Date.now() - start; // milliseconds elapsed since start
            setProgress(Math.floor(delta / 2500 * 100))
        }, 100); // update about every second
        let timer1 = setTimeout(() => navigate('/home',{state:{name:unique_id,page:"home"}}), 3000);
  
        // this will clear Timeout
        // when component unmount like in willComponentUnmount
        // and show will not change to true
        return () => {
          clearTimeout(timer1);
        };
      },
      // useEffect will run only one time with empty []
      // if you pass a value to array,
      // like this - [data]
      // than clearTimeout will run every time
      // this value changes (useEffect re-run)
      []
    );
    
      return (
        <>
        <br></br>
        <br></br><br></br>
        <Row justify='center'>
            <Col span={18}>
          <div className='head'>
            <p>Initiating access token, will redirect automatically</p>
            <Progress strokeLinecap="butt" percent={progress} />

          </div>
      
        </Col>
        </Row>
        </>
      );
}


export default Login;