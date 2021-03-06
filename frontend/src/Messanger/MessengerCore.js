import axios from 'axios';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { Container, Alert, Input, Label } from 'reactstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { dispense } from "Localization/Dispenser";

var Stomp = require('stompjs');
var SockJS = require("sockjs-client");

let thisObj;

class MessengerCore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allMessages: [],
            receivers: [],
            filteredReceivers: [],
            currentMessagesControls: [],
            currentReceiver: null,
            loginToIdMap: new Map(),
            messageText: '',
            filterName: ""
        }

        thisObj = this;
        this.websocket = null;

        this.pickDialog = this.pickDialog.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.changeFilterName = this.changeFilterName.bind(this);
        this.filterReceivers = this.filterReceivers.bind(this);
    }

    filterReceivers() {
        let filteredReceivers = this.state.receivers;

        filteredReceivers = filteredReceivers.filter(item => {
            return item.login.includes(this.state.filterName)
        })

        this.setState({ filteredReceivers: filteredReceivers })
    }

    changeFilterName(event) {
        let value = event.target.value;
        this.setState({ filterName: value }, () => this.filterReceivers())
    }

    render() {

        let receiversControls = this.state.filteredReceivers.map(receiver => {

            const avatar = receiver.avatarId !== null ? <div class="image-cropper">
                <img class='rounded' src={"/resources/users/" + receiver.id + "/photos/" + receiver.avatarId} />
            </div>
                : false
            return <li class="nav-item m-1">
                <button style={{ minWidth: "100%", display: "flex", alignItems: "center", flexDirection: "column" }}
                    class={receiver.login == this.state.currentReceiver ? "btn btn-success" : "btn btn-outline-success"} onClick={() => this.pickDialog(receiver.login)}>{avatar}{receiver.login}</button>
            </li>
        });

        return <Container fluid>
            <Row>
                <Col md="2" className='border p-3'>
                    <Label className='mb-1'>{dispense("receivers")}</Label>
                    <Input onChange={this.changeFilterName} className="mb-3" placeholder={dispense("receiverLogin")}></Input>
                    <div class="receiversScroller border">
                        <ul class="nav flex-column flex-nowrap">
                            {receiversControls}
                        </ul>
                    </div>
                </Col>
                <Col className='border p-3 ms-3'>
                    <h3><Link className="text-success" to={`/guest/${this.state.currentReceiver}`}>{this.state.currentReceiver}</Link></h3>
                    <div class="messagesScroller border" >
                        <ul class="nav flex-column">
                            {this.state.currentMessagesControls}
                        </ul>
                    </div>
                    <div class="input-group">
                        <input type="text" class="form-control" name="messageText" value={this.state.messageText} onChange={this.handleChange}
                            onKeyPress={event => {
                                if (event.key === 'Enter') {
                                    this.sendMessage()
                                }
                            }} />
                        <div class="input-group-append" style={{minWidth:"20%"}}>
                            <button type="button" class="btn btn-outline-success" style={{minWidth:"100%"}} onClick={this.sendMessage}>{dispense("send")}</button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container >
    }

    componentDidMount() {
        let config = {
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            }
        }

        axios.get('/message/receivers', config)
            .then(res => {

                res.data.receivers.map(receiver => {
                    this.state.loginToIdMap.set(receiver.login, receiver.id)
                })


                this.setState({ receivers: res.data.receivers }, () => this.filterReceivers())

            })

        axios.get('/message', config)
            .then(res => {
                this.setState({
                    allMessages: res.data.messages
                })
            })

        var socket = new SockJS('/ws/messages');
        let stompWebsocket = Stomp.over(socket);
        this.websocket = stompWebsocket;

        this.websocket.connect({ "X-Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken") }, function (frame) {
            stompWebsocket.subscribe('/topic/users/' + localStorage.getItem("id"), function (data) {
                let messages = thisObj.state.allMessages;

                let message = JSON.parse(data.body);
                message.creationTime = new Date(message.creationTime).getTime() / 1000;
                messages.push(message)


                thisObj.setState({ allMessages: messages })
                thisObj.pickDialog(thisObj.state.currentReceiver)
            });
        });

    }

    sendMessage() {
        let config = {
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            }
        }
        console.log(this.state.loginToIdMap)

        const dto = {
            text: this.state.messageText
        }

        this.websocket.send("/app/receivers/" + this.state.loginToIdMap.get(this.state.currentReceiver), {}, JSON.stringify(dto))

        // ErrorHandler.runStringMessage("Message was sent to " + this.state.currentReceiver);

        this.setState({ messageText: '' }, () => {
            let messages = thisObj.state.allMessages;
            let newMessage = {
                text: dto.text,
                receiver: {
                    login: thisObj.state.currentReceiver
                },
                sender: {
                    login: localStorage.getItem("login")
                },
                creationTime: new Date().getTime() / 1000
            }

            console.log(newMessage)
            console.log(messages)
            messages.push(newMessage)
            thisObj.setState({ allMessages: messages }, () => {
                thisObj.pickDialog(thisObj.state.currentReceiver)
            })

        })
    }

    pickDialog(anotherUserLogin) {
        console.log("dialog was picked")
        const currentMessagesControls = this.state.allMessages
            .filter(message => {
                return (message.receiver.login == anotherUserLogin && message.sender.login == localStorage.getItem("login")
                    || message.sender.login == anotherUserLogin && message.receiver.login == localStorage.getItem("login"))

            })
            .sort((a, b) => a.creationTime - b.creationTime)
            .map(message => {
                let creationTime = new Date(message.creationTime * 1000);


                return <li class="nav-item mt-1">
                    {message.receiver.login == anotherUserLogin
                        ?
                        <div class="border-bottom p-2" style={{ display: "flex", justifyContent: "right" }}>
                            <div>
                                <div class="text-secondary" style={{ display: "flex", justifyContent: "right" }}>
                                    <span>{creationTime.toLocaleString()}</span>
                                </div>
                                <div>
                                    <span >{message.text}</span>
                                </div>
                            </div>
                        </div>
                        :
                        <div class="border-bottom p-2" style={{ display: "flex", justifyContent: "left" }}>
                            <div>
                                <span class="text-secondary">{creationTime.toLocaleString()}</span>
                                <div>
                                    <span >{message.text}</span>
                                </div>
                            </div>
                        </div>
                    }
                </li>
            });


        this.setState({
            currentMessagesControls: currentMessagesControls,
            currentReceiver: anotherUserLogin,
        }, () => {
            let scroller = document.getElementsByClassName("messagesScroller")[0];
            scroller.scrollTop = scroller.scrollHeight;
        })
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        });
    }

}

export default MessengerCore