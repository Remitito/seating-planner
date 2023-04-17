import React, {useState, useEffect} from 'react'
import './App.css'
import Marquee from 'react-fast-marquee'
import {SwapOutlined, DeleteOutlined, SmallDashOutlined, CheckCircleOutlined, UserOutlined, UserSwitchOutlined, FrownOutlined} from '@ant-design/icons'
import {Col, Row, Input, InputNumber, Button, Avatar, Alert, Typography, Popconfirm, Card} from 'antd'
const {TextArea} = Input
const {Title} = Typography

// Name length affects width on small screens so rows dont line up

const App = () => {
  const [newNames, updateNewNames] = useState("James\nHannah\nSteven\nMelvin\nJim\nLucy\nRoberta\nMike\nRoxanne\nHumphrey\nPavel\nGeorge")
  const [nameArray, setArray] = useState(["James", "Hannah", "Steven", "Melvin", "Jim", "Lucy", "Roberta", "Mike", "Roxanne", "Humphrey", "Pavel", "George"])
  const [columns, setColumns] = useState(4) // two variables for each to stop dynamic changes as this messes up formatting
  const [tempColumns, setTempColumns] = useState(4)
  const [rows, setRows] = useState(3)
  const [tempRows, setTempRows] = useState(3)
  const [hoverName, setHoverName] = useState("")
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
    setColumns(tempColumns)
    setRows(tempRows)
    if(newNames.length === 0) {
      showNoNames(true)
      return
    }
    let removeEmptyLines = newNames.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,"")
    let newNameArray = removeEmptyLines.split(/\r?\n/)
    let totalSeats = tempColumns * tempRows
    if(newNameArray.length > totalSeats) { // check there are enough seats
      showNotEnoughSeats(true)
      return
    }
    if(newNameArray.length !== new Set(newNameArray).size) { // Check for duplicates
      showDuplicates(true)
      return
    }
    if(newNameArray.length < (totalSeats)) { // Add "Empty" to fill unused seats
      while(newNameArray.length < (totalSeats)) {
        newNameArray.push("Empty")
      }
    }  
    confirm(false)
    setMessage([' Press "Rearrange" to mix up the seating plan!', 'info'])
    setArray(newNameArray)
  }

  const changeColRow = (func) => {
    showNotEnoughSeats(false)
    showDuplicates(false)
    confirm(true)
    setMessage(['Press "Confirm" to update columns and rows', 'info'])
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
    let fontSize = "medium"
    if(window.innerWidth < 960) {
      fontSize = "small"
    }
    return nameArray.map((student, index) => 
    <div style={{flex: (100 / columns) + "%", display: 'flex', 
    flexDirection: 'column', marginBottom: "25px"}}>
      <Card onMouseOver={() => setHoverName(index)} onMouseOut={() => setHoverName("")} 
       style={{borderColor: "black"}} size='small' headStyle={{fontSize: fontSize, 
      }} hoverable onClick={() => handleSeatChange(index)} title={student}>
        {/* Empty seat icons */}
        {student === "Empty" ? 
        <> 
          {hoverName === index || selectedSeat === index ?
          <>
            <Avatar icon={<SmallDashOutlined/>} className='selectedSeatAvatar' size={50}/>
          </>  
            :
          <>
            <Avatar icon={<SmallDashOutlined/>} className='seatAvatar' size={50}/>
          </>
          }
        </>
        :
        // Filled seat icons
        <>
        {hoverName === index || selectedSeat === index ?
          <Avatar icon={<UserSwitchOutlined/>} className='selectedSeatAvatar' size={50}/>
          :
          <Avatar icon={<UserOutlined/>} className='seatAvatar' size={50}/>
        }
        </>
      }
      </Card>
    </div>
    )
  }

  return (
    <div className="App">
      <Row style={{marginTop: "30px"}} justify="center" align="middle">
        <img height={40} src={require('./images/chair.png')} />
        <Title style={{marginBottom: "30px", fontSize: "xx-large"}} level={2}>Classroom Seating Planner</Title>
      </Row>
      <Row>
        <Col span={8}>
          <h2>Settings</h2>
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
              <InputNumber min="1" addonBefore="Col: " value={tempColumns} onChange={(value) => changeColRow(setTempColumns(value))}/>
            </Col>
            <Col span={10}>
              <InputNumber min="1" addonBefore="Row: " value={tempRows} onChange={(value) => changeColRow(setTempRows(value))}/>
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
              <Button size="large"  style={{margin: "5px"}} danger type="primary">Clear
              <DeleteOutlined /></Button>
            </Popconfirm>
            {confirmed ? 
             <Button size="large" onClick={() => makeArray()} style={{margin: "5px"}} type="primary">Confirm
             <CheckCircleOutlined /></Button>
            :
             <Button size="large" onClick={() => rearrange()} style={{margin: "5px"}} type="primary">Rearrange
             <SwapOutlined />
             </Button>
            }
          </Row>
        </Col>
        <Col span={16}>
          <Alert style={{width: "80%", margin: "auto", marginTop: "10px", fontSize: "x-large"}} 
          type={message[1]} showIcon message={
            <Marquee speed={50} className={window.innerWidth < 960 ? "marqueeSmall" : "marqueeBig"} pauseOnHover gradient={false}>
              {message[0]}
            </Marquee>} />
          {nameArray.length > 0 || newNames.length > 0 ?
            <div className='seatCont'>
            {mapNames()}
            </div>
            :
            <>
              <FrownOutlined style={{marginTop: "70px", fontSize: "10rem"}}/>
            </>
          }
        </Col>
      </Row>
    </div>
  );
};

export default App;
