import React, {useState, useReducer} from 'react'
import './App.css'
import {SwapOutlined, DeleteOutlined, CheckCircleOutlined} from '@ant-design/icons'
import {Col, Row, Input, InputNumber, Label, Button, Avatar, Alert, Switch, Typography, Image} from 'antd'
const {TextArea} = Input
const {Title} = Typography 

const App = () => {
  const [newNames, updateNewNames] = useState("James\nHannah\nSteven\nMelvin\nJim\nLucy\nRoberta\nMike")
  const [nameArray, setArray] = useState(["James", "Hannah", "Steven", "Melvin", "Jim", "Lucy", "Roberta", "Mike", "Empty"])
  const [columns, setColumns] = useState(3)
  const [confirmed, confirm] = useState(false) // to trigger showing the rearrange seats button after confirming
  const [selectedSeat, selectSeat] = useState(-1)
  const [rows, setRows] = useState(3)
  const [notEnoughSeats, showNotEnoughSeats] = useState(false)
  const [noNamesAdded, showNoNames] = useState(false)

// A message below the column and row boxes to say to enter names line-separated
// Implement rearrange button functionality !!!
// Add a message box below the buttons to explain when to use Confirm and Rearrange
// Add an "Are You Sure?" popup after clear is pressed
// When changing students, after you click the first name it can say "Changing ____ with..."
// After, it can say "Changed _____ with _______"
// Add background picture


  const rearrange = () => {
    let newNameArray = nameArray
    for (var i = newNameArray.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = newNameArray[i];
      newNameArray[i] = newNameArray[j];
      newNameArray[j] = temp;
    }
    setArray(newNameArray)
  }

  const clearAll = () => {
    updateNewNames("")
    showNotEnoughSeats(false)
    confirm(true)
    setArray([])
  }

  const makeArray = () => {
    showNotEnoughSeats(false)
    showNoNames(false)
    if(newNames.length === 0) {
      showNoNames(true)
      return
    }
    let removeEmptyLines = newNames.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,"")
    let newNameArray = removeEmptyLines.split(/\r?\n/)
    let totalSeats = columns * rows
    if(newNameArray.length > totalSeats) {
      showNotEnoughSeats(true)
      return
    }
    if(newNameArray.length < (totalSeats)) {
      while(newNameArray.length < (totalSeats)) {
        newNameArray.push("Empty")
      }
    }
    confirm(false)
    setArray(newNameArray)
  }

  const handleChange = (func) => {
    showNotEnoughSeats(false)
    confirm(true)
    // if(func() === setRows()) {} // work around for weird bug
    func()
  } 

  const handleSeat = (index) => {
    if(selectedSeat < 0) {
      selectSeat(index)
    }
    else {
      let newNameArray = nameArray
      let tempValue = newNameArray[index]
      newNameArray[index] = newNameArray[selectedSeat]
      newNameArray[selectedSeat] = tempValue 
      selectSeat(-1)
      setArray(newNameArray)
    }
  }

  const mapNames = () => {
    return nameArray.map((student, index) => 
    <div style={{flex: (100 / columns) + "%", marginBottom: "10px"}}>
      <a onClick={() => handleSeat(index)}>
        <Avatar className='seatAvatar' size={50}
        style={{backgroundColor: selectedSeat === index ? "#1677ff" : "black"}}>{student}</Avatar>
      </a>
    </div>
    )
  }

  const mapSeats = () => {
    return nameArray.map((name, index) => 
    <>
      <Button onClick={() => handleSeat(index)}>
        <Avatar>{name}</Avatar>
      </Button>
    </>
    )
  }

  return (
    <div className="App">
      {/* <a href="https://www.flaticon.com/free-icons/seat" title="seat icons">Seat icons created by Freepik - Flaticon</a> */}
        <Row justify="center" align="middle">
          <img height={40} src={require('./images/chair.png')} />
          <Title level={2}>Seating Planner</Title>
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
          <Row justify="space-around">
            <Col span={10}>
              <InputNumber min="1" addonBefore="Col: " value={columns} onChange={(value) => handleChange(setColumns(value))}/>
            </Col>
            <Col span={10}>
              <InputNumber controls min="1" addonBefore="Row: " value={rows} onChange={(value) => handleChange(setRows(value))}/>
            </Col>
          </Row>
          <Row justify="center">
            <Col span={18}>
              <TextArea allowClear autoSize value={newNames} rows={"8"} style={{marginTop: "10px"}}
              onChange={(e) => {
                updateNewNames(e.target.value)
                confirm(true)}}/>
            </Col>
          </Row>
          <Row justify={"center"} align="middle">
            <Button onClick={() => clearAll()} style={{margin: "5px"}} danger type="primary">Clear
            <DeleteOutlined /></Button>
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
          {nameArray.length > 0 ?
            <div className='seatCont'>
            {mapNames()}
            </div>
            :
            <Title style={{marginTop: "100px"}} keyboard type={"danger"} level={2}>No Names Added</Title>
          }
        </Col>
      </Row>
    </div>
  );
};

export default App;
