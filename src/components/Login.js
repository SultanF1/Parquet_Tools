import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import "../App.css"
import { Col, Row } from 'antd';
import { useState } from 'react';
import storage from '../ firebaseConfig';
import { useNavigate } from "react-router-dom";

function Login(){
    const navigate = useNavigate()
    const [name, setName] = useState("")    
    const onFinish = (values) => {
        console.log('Success:', values);
      };
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

      return (
        <>
        <br></br>
        <br></br><br></br>
        <Row justify='center'>
            <Col span={6}>
            <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Ticket Name"
        name="username"
        rules={[
          {
            required: true,
            message: 'Enter your name',
          },
        ]}
      >
        <Input value={name} onChange={(e) => {setName(e.target.value);console.log(name)}}/>
      </Form.Item>

     

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit" onClick={()=>navigate('/home',{state:{name:name,page:"home"}})}>
          Submit
        </Button>
      </Form.Item>
    </Form>
        </Col>
        </Row>
        </>
      );
}


export default Login;