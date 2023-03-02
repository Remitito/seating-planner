import React, {useState} from 'react'
import './App.css'
import {Col, Row, Input, InputNumber, Label, Button, Avatar} from 'antd'
const {TextArea} = Input


const App = () => {
  const [newNames, updateNewNames] = useState("James\nHannah\nSteven\nMelvin\nJim\nLucy\nRoberta\nMike\nPatricia")
  const [nameArray, setArray] = useState(["James", "Hannah", "Steven", "Melvin", "Jim", "Lucy", "Roberta", "Mike", "Empty"])
  const [columns, setColumns] = useState(3)
  const [rows, setRows] = useState(3)

  const clearAll = () => {
    updateNewNames("")
    setArray([])
  }

  const makeArray = () => {
    let removeEmptyLines = newNames.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,"")
    let newNameArray = removeEmptyLines.split(/\r?\n/)
    let totalSeats = columns * rows
    if(newNameArray.length < (totalSeats)) {
      while(newNameArray.length < (totalSeats)) {
        newNameArray.push("Empty")
      }
    }
    setArray(newNameArray)
  }

  const mapNames = () => {
    return nameArray.map((student) => 
    <div className='seat'>
      <Avatar>{student}</Avatar>
    </div>
    )
  }

  return (
    <div className="App">
      <h1>Seat Planner</h1>
      <Row>
        <Col span={8}>
          <h3>Settings</h3>
          <Row justify="space-around">
            <Col span={10}>
              <InputNumber min="1" addonBefore="Col: " value={columns} onChange={value => setColumns(value)}/>
            </Col>
            <Col span={10}>
              <InputNumber controls min="1" addonBefore="Row: " value={rows} onChange={value => setRows(value)}/>
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
