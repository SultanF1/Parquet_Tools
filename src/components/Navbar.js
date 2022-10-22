import {Menu} from "antd"
import {useLocation, useNavigate} from "react-router-dom"
import { v4 as uuid } from 'uuid';
import Icon, { GithubOutlined  } from '@ant-design/icons';

function Navbar(){
    const location = useLocation()
    const navigate = useNavigate()
    const unique_id = uuid();

    return(
        <Menu mode="horizontal" defaultSelectedKeys={[location.state.page]} theme="light" >
        <Menu.Item key="home" onClick={() => {
            fetch('delete?' + new URLSearchParams({
                name: location.state.name
                
            }))
            navigate("/home", {state:{name:location.state.name,page:"home"}})
        }}>
          Home
        </Menu.Item>
        <Menu.Item key="read"  onClick={() => {
            fetch('delete?' + new URLSearchParams({
                name: location.state.name
                
            }))
            navigate("/read", {state:{name:location.state.name,page:"read"}})
            
        }}>
          Read Existing Parquet
        </Menu.Item>

        <Menu.Item  key="writeParquet" onClick={() => {
            fetch('delete?' + new URLSearchParams({
                name: location.state.name
                
            }))
            navigate("/write", {state:{name:location.state.name,page:"write"}})
            
        }}>
          Write New Parquet
        </Menu.Item>
        <Menu.Item  key="convertCsv" onClick={() => {
            fetch('delete?' + new URLSearchParams({
                name: location.state.name
                
            }))
            navigate("/convert-csv", {state:{name:location.state.name,page:"convertCsv"}})
            
        }}>
          Convert CSV To Parquet    
        </Menu.Item>
        <Menu.Item  style={{ marginLeft: 'auto' }} key="git" onClick={() => {
            fetch('delete?' + new URLSearchParams({
                name: location.state.name
                
            }))
        }}>
          <a href="https://github.com/SultanF1/Parquet_Tools.git"><GithubOutlined style={{ fontSize: '24px'}}/></a>
        </Menu.Item>
      </Menu>
    )
}


export default Navbar