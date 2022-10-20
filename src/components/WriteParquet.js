import { Col, Input, Menu, Row, InputGroup, Button } from "antd";
import { useEffect, useState } from "react";
import {useNavigate, useLocation} from "react-router-dom"
import { InputNumber } from 'antd';
import "../App.css"

function WriteParquet(){
    const [numColumns, setNumColumns] = useState(0)
    const [columnNames, setColumnNames] = useState([])
    const [record, setRecord] = useState([])
    const [showFieldSelectors, setShowFieldSelectors] = useState(false)
    const [showRecordSelectors, setShowRecordSelectors] = useState(false)
    const [addRecord, setAddRecord] = useState(false)
    const [data, setData] = useState([])
    const [url, setUrl] = useState("")
    const location = useLocation()
    const navigate = useNavigate()
    const onChange = (value) => {
        setNumColumns(value)
      };
    function handleNumberButton(){
        setShowFieldSelectors(true)
        setColumnNames(Array(numColumns).fill(""));
    }
    function handleFieldName(i, e){
        let tmp = columnNames
        tmp[i] = e.target.value
        setColumnNames(tmp)
        
    }
    function handleRecordValue(i,e){
        let tmp = record
        tmp[i] = e.target.value
        setRecord(tmp)
        
    }
    function handleAddRecord(){
        setAddRecord(false)
        let tmp = data
        tmp.push(record)
        setRecord([])
        setData(tmp)
        
    }
    async function downloadParquet(){
        await fetch('/write?' + new URLSearchParams({
            name: location.state.name,
            data: JSON.stringify(data),
            columns: JSON.stringify(columnNames),
        })).then(res => res.json()).then(json => {
            console.log(json)
            setUrl(json)
        })
        console.log(url)
        console.log("first")
    }
    return(
        <>
        <Menu mode="horizontal" defaultSelectedKeys={[location.state.page]} theme="dark" >
        <Menu.Item key="home" onClick={() => {
            navigate("/home", {state:{name:location.state.name,page:"home"}})
        }}>
          Home
        </Menu.Item>
        <Menu.Item key="read" onClick={() => navigate("/read", {state:{name:location.state.name,page:"read"}})}>
          Read Parquet
        </Menu.Item>

        <Menu.Item key="write" onClick={() => navigate("/write", {state:{name:location.state.name,page:"write"}})}>
          Write Parquet
        </Menu.Item>
        
      </Menu>
      <br></br>
      <Row justify="center">
        <Col span={20}>
        {showFieldSelectors ? (
            <p></p>
        ):(
            <>
            <p>Enter the number of columns:</p>
        <InputNumber min={1}  onChange={onChange} />
        <br></br><br></br>
        <Button size="small" onClick={handleNumberButton}>Confirm Number Of Columns</Button>
        </>
        )
        }
        
        <br></br>
        <br></br>
        {showFieldSelectors && !showRecordSelectors ? (
            <>
            <p>Enter Field Names:</p>
            <Input.Group compact>
            {[...Array(numColumns)].map((x, i) =>
                <Input key={i} style={{ width:'10%'}} defaultValue="" placeholder="Field Name" onChange={(e) => handleFieldName(i,e)}/> 
            )}    
            </Input.Group>
            <br></br>
            <Button onClick={()=>setShowRecordSelectors(true)}>Confirm Columns</Button>
            </>
        ): (
            <p></p>
        )}

        {showRecordSelectors ? (
            <>
            {addRecord ? (
                <>
                <p>Enter Record Values</p>
                <Input.Group compact>
                {columnNames.map((column,i) => 
                    <Input key={column} style={{ width:'10%'}} defaultValue="" placeholder={column} onChange={(e) => handleRecordValue(i,e)}/> 
                )}
                </Input.Group>
                <br></br>
                <Button onClick={handleAddRecord}>Confirm Record</Button>
                </>
            ):(                
                <Button onClick={() => setAddRecord(true)}>Add New Record</Button>
            )}
            <br></br><br></br>
            {data.length > 0 ? (
                <Button onClick={downloadParquet}>Submit</Button>
            ): (
                <p></p>
            )}
            
            </>
        ):(
            <p></p>
        )}
        {url ? (
            <Button href={url}>Download Parquet File</Button>
        ): (
            <p></p>
        )}
        </Col>
      </Row>
      
        </>
    )

}


export default WriteParquet;