import React, {useState, useReducer} from 'react'
import './App.css'
import {Col, Row, Input, InputNumber, Label, Button, Avatar, Alert, Image} from 'antd'
import { IconCont, Icon } from './styled'
const {TextArea} = Input

// Add different color when clicking

const App = () => {

  const [newNames, updateNewNames] = useState("James\nHannah\nSteven\nMelvin\nJim\nLucy\nRoberta\nMike\nPatricia")
  const [nameArray, setArray] = useState(["James", "Hannah", "Steven", "Melvin", "Jim", "Lucy", "Roberta", "Mike", "Empty"])
  const [columns, setColumns] = useState(3)
  const [selectedSeat, selectSeat] = useState(-1)
  const [rows, setRows] = useState(3)
  const [notEnoughSeats, showNotEnoughSeats] = useState(false)
  const [noNamesAdded, showNoNames] = useState(false)
  const [seating, setSeating] = useState({})

  const makeSeatingPlan = () => {

  }

  const clearAll = () => {
    updateNewNames("")
    showNotEnoughSeats(false)
  }

  const makeArray = () => {
    //set a max length
    showNotEnoughSeats(false)
    showNoNames(false)
    if(newNames.length === 0) {showNoNames(true)}
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
    setArray(newNameArray)
  }

  const handleChange = (func) => {
    showNotEnoughSeats(false)
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
        <Avatar shape={selectedSeat === index ? "square" : "circle"} size={60}>{student}</Avatar>
      </a>
    </div>
    )
  }

  const mapSeats = () => {
    return nameArray.map((name, index) => 
    <>
      <a onClick={() => handleSeat(index)}>
        <Avatar>{name}</Avatar>
      </a>
    </>
    )
  }

  return (
    <div className="App">
      <h1>Seat Planner</h1>
      <Row>
        <Col span={8}>
          <h3>Settings</h3>
          {notEnoughSeats && (
            <Alert className='settingsAlert' type="error" showIcon message="Not enough seats! Add more columns or rows below"/>
          )}
          {noNamesAdded && (
            <Alert className='settingsAlert' type="error" showIcon message="You must add at least one name!"/>
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
              <TextArea value={newNames} onChange={e => updateNewNames(e.target.value)} rows={"8"} style={{marginTop: "10px"}}/>
            </Col>
          </Row>
          <Row justify={"center"}>
            <Button onClick={() => clearAll()} style={{margin: "5px"}} danger type="primary">Clear</Button>
            <Button onClick={() => makeArray()} style={{margin: "5px"}} type="primary">Confirm</Button>
          </Row>
        </Col>
        <Col span={16}>
          <div className='seatCont'>
            {mapNames()}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default App;
