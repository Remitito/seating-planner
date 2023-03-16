import React, {useState, useReducer} from 'react'
import './App.css'
import Marquee from 'react-fast-marquee'
import {SwapOutlined, DeleteOutlined, CheckCircleOutlined, UserOutlined, FrownOutlined} from '@ant-design/icons'
import {Col, Row, Input, InputNumber, Button, Avatar, Alert, Switch, Typography, Image, Popconfirm} from 'antd'
const {TextArea} = Input
const {Title} = Typography 


const App = () => {
  const [newNames, updateNewNames] = useState("James\nHannah\nSteven\nMelvin\nJim\nLucy\nRoberta\nMike\nRoxanne\nHumphrey\nPavel\nGeorge")
  const [nameArray, setArray] = useState(["James", "Hannah", "Steven", "Melvin", "Jim", "Lucy", "Roberta", "Mike", "Roxanne", "Humphrey", "Pavel", "George"])
  const [columns, setColumns] = useState(4)
  const [rows, setRows] = useState(3)
  const [message, setMessage] = useState(['Press "Clear" and enter names to get started!', 'info'])
  const [confirmed, confirm] = useState(false) // to trigger showing the rearrange seats button after confirming
  const [selectedSeat, selectSeat] = useState(-1)
  const [notEnoughSeats, showNotEnoughSeats] = useState(false)
  const [noNamesAdded, showNoNames] = useState(false)
  const [noDuplicates, showDuplicates] = useState(false)

  const rearrange = () => {
    let newNameArray = [...nameArray]
    for (var i = newNameArray.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = newNameArray[i];
      newNameArray[i] = newNameArray[j];
      newNameArray[j] = temp;
    }
    setArray(newNameArray) // does nothing
  }

  const clearAll = () => {
    setMessage(['Enter names (line-separated) then press "Confirm"!', 'info'])
    updateNewNames("")
    showNotEnoughSeats(false)
    confirm(true)
    setArray([])
  }

  // After pressing "Confirm"
  const makeArray = () => {
    showNotEnoughSeats(false)
    showDuplicates(false)
    showNoNames(false)
    if(newNames.length === 0) {
      showNoNames(true)
      return
    }
    let removeEmptyLines = newNames.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,"")
    let newNameArray = removeEmptyLines.split(/\r?\n/)
    let totalSeats = columns * rows
    if(newNameArray.length > totalSeats) { // check there are enough seats
      showNotEnoughSeats(true)
      return
    }
    let nameSet = new Set(newNameArray)
    console.log(nameSet)
    console.log(newNameArray)
    if(newNameArray.length !== new Set(newNameArray).size) { // Check for duplicates
      console.log(newNameArray)
      console.log(new Set(newNameArray))
      showDuplicates(true)
      return
    }
    if(newNameArray.length < (totalSeats)) { // Add "Empty" to fill unused seats
      while(newNameArray.length < (totalSeats)) {
        newNameArray.push("Empty")
      }
    }  
    confirm(false)
    setMessage(['Press "Rearrange" to mix up the seating plan!', 'info'])
    setArray(newNameArray)
  }

  const handleChange = (func) => {
    showNotEnoughSeats(false)
    showDuplicates(false)
    confirm(true)
    // if(func() === setRows()) {} // work around for weird bug
    func()
  } 

  const handleSeatChange = (index) => {
    if(selectedSeat < 0) {
      selectSeat(index)
      setMessage([`Change ${nameArray[index]} with...?`, 'warning'])
    }
    else {
      let newNameArray = nameArray
      let tempValue = newNameArray[index]
      newNameArray[index] = newNameArray[selectedSeat]
      newNameArray[selectedSeat] = tempValue 
      selectSeat(-1)
      setArray(newNameArray)
      setMessage([`${nameArray[selectedSeat]} changed with ${nameArray[index]}`, 'success'])
    }
  }

  const mapNames = () => {
    return nameArray.map((student, index) => 
    <div style={{flex: (100 / columns) + "%", marginBottom: "10px", display: 'flex', flexDirection: 'column'}}>
      <a onClick={() => handleSeatChange(index)}>
        <Avatar icon={<UserOutlined />} className={selectedSeat === index ? 'selectedSeatAvatar' : 'seatAvatar'} size={50} />
      </a>
      <label style={{margin: "auto", marginTop: "5px"}}>{student}</label>
    </div>
    )
  }

  return (
    <div className="App">
      {/* <a href="https://www.flaticon.com/free-icons/seat" title="seat icons">Seat icons created by Freepik - Flaticon</a> */}
        <Row justify="center" align="middle">
          <img height={40} src={require('./images/chair.png')} />
          <Title level={2}>Classroom Seating Planner</Title>
        </Row>
      <Row>
        <Col span={8}>
          <h3>Settings</h3>
          {notEnoughSeats && (
            <Alert className='settingsAlert' type="error" showIcon message="Not enough seats! Add more columns or rows below"/>
          )}
          {noNamesAdded && (
            <Alert className='settingsAlert' type="error" showIcon message="Please add a name"/>
          )}
          {noDuplicates && (
            <Alert className='settingsAlert' type="error" showIcon message="No duplicates!"/>
          )}
          <Row justify="space-around">
            <Col span={10}>
              <InputNumber min="1" addonBefore="Col: " value={columns} onChange={(value) => handleChange(setColumns(value))}/>
            </Col>
            <Col span={10}>
              <InputNumber min="1" addonBefore="Row: " value={rows} onChange={(value) => handleChange(setRows(value))}/>
            </Col>
          </Row>
          <Row justify="center">
            <Col span={18}>
              <TextArea autoSize value={newNames} rows={"8"} style={{marginTop: "10px"}}
              onChange={(e) => {
                updateNewNames(e.target.value)
                confirm(true)}}/>
            </Col>
          </Row>
          <Row justify={"center"} align="middle">
            <Popconfirm onConfirm={() => clearAll()} title="Are you sure want to delete everything?" okText="Yes" cancelText="No">
              <Button style={{margin: "5px"}} danger type="primary">Clear
              <DeleteOutlined /></Button>
            </Popconfirm>
            {confirmed ? 
             <Button onClick={() => makeArray()} style={{margin: "5px"}} type="primary">Confirm
             <CheckCircleOutlined /></Button>
            :
             <Button onClick={() => rearrange()} style={{margin: "5px"}} type="primary">Rearrange
             <SwapOutlined />
             </Button>
            }
          </Row>
        </Col>
        <Col span={16}>
          <Alert style={{width: "80%", margin: "auto", marginTop: "10px", fontSize: "larger"}} 
          type={message[1]} showIcon message={
            <Marquee speed={50} pauseOnHover gradient={false}>
              {message[0]}
            </Marquee>} />
          {nameArray.length > 0 || newNames.length > 0 ?
            <div className='seatCont'>
            {mapNames()}
            </div>
            :
            <>
              <FrownOutlined spin style={{marginTop: "70px", fontSize: "10rem"}}/>
            </>
          }
        </Col>
      </Row>
    </div>
  );
};

export default App;
