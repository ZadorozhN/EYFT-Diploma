import React, { Component } from 'react';
import { Button, Navbar, Container, Nav, Form, NavDropdown, FormControl } from 'react-bootstrap'

import { Link } from 'react-router-dom';
import $ from "jquery"
import ErrorHandler from './Handler/ErrorHandler';
import axios from 'axios';
import MoneyFormatter from './Formatter/MoneyFormatter';
import Constants from './Const/Constants'

var Stomp = require('stompjs');
var SockJS = require("sockjs-client");

const roleUser = "ROLE_USER"
const roleAdmin = "ROLE_ADMIN"
const roleArranger = "ROLE_ARRANGER"

class AppNavbar extends Component {
    constructor(props) {
        super(props);
        let fm = localStorage.getItem("fastMode")
        this.state = {
            isOpen: false,
            accountId: null,
            cents: null,
            fastMode: JSON.parse(fm) === true
        };

        this.toggle = this.toggle.bind(this);
        this.logout = this.logout.bind(this);
        this.toggleFastMode = this.toggleFastMode.bind(this);
    }

    toggleFastMode() {

        localStorage.setItem("fastMode", !this.state.fastMode)
        this.setState({ fastMode: !this.state.fastMode })
    }

    logout() {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("tokenType")
        localStorage.removeItem("expiresIn")

        localStorage.removeItem("login")
        localStorage.removeItem("id")
        localStorage.removeItem("role")
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        let navItems;

        <h4>
            <span class="badge bg-success">{MoneyFormatter.fromatDollars(this.state.cents)}</span>
        </h4>

        let nav;
        if (this.state.fastMode) {
            nav = <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
            >
                {localStorage.getItem("role") == null ? <Nav.Link href="/auth">Auth</Nav.Link> : ""}
                {localStorage.getItem("role") == null ? <Nav.Link href="/registration">Registration</Nav.Link> : ""}
                {localStorage.getItem("role") != null ? <Nav.Link href="/me">Me</Nav.Link> : ""}
                {Constants.isArrangerOrHigher(localStorage.getItem("role")) ? <Nav.Link href="/arranger">Arranger</Nav.Link> : ""}
                {Constants.isAdmin(localStorage.getItem("role")) ? <Nav.Link href="/admin">Admin</Nav.Link> : ""}
                {localStorage.getItem("role") != null ? <Nav.Link href="/auth" onClick={this.logout}>Logout</Nav.Link> : ""}
            </Nav>
        } else {
            nav = <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
            >

                {localStorage.getItem("role") == null ? <Nav.Link href="/auth">Auth</Nav.Link> : ""}
                {localStorage.getItem("role") == null ? <Nav.Link href="/registration">Registration</Nav.Link> : ""}
                {localStorage.getItem("role") != null ?
                    <NavDropdown title="Me" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/me">Console</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/me/events">Events</NavDropdown.Item>
                        <NavDropdown.Item href="/me/joined">Joined Events</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/me/messenger">Messenger</NavDropdown.Item>
                        <NavDropdown.Item href="/me/photos">Photos</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/me/settings">Settings</NavDropdown.Item>
                    </NavDropdown> : ""}
                {Constants.isArrangerOrHigher(localStorage.getItem("role")) ? <NavDropdown title="Arranger" id="navbarScrollingDropdown">
                    <NavDropdown.Item href="/arranger">Console</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/arranger/arranged">Arranged Events</NavDropdown.Item>
                    <NavDropdown.Item href="/arranger/arrangement">Event Arrangement</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/arranger/props/market">Props Market</NavDropdown.Item>
                    <NavDropdown.Item href="/arranger/props/ordered">Ordered Props</NavDropdown.Item>
                </NavDropdown> : ""}
                {Constants.isAdmin(localStorage.getItem("role")) ? <NavDropdown title="Admin" id="navbarScrollingDropdown">
                    <NavDropdown.Item href="/admin">Console</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/event-management/events">Events</NavDropdown.Item>
                    <NavDropdown.Item href="/category-management/categories">Categories</NavDropdown.Item>
                    <NavDropdown.Item href="/user-management/users">Users</NavDropdown.Item>
                    <NavDropdown.Item href="/prop-management/props">Props</NavDropdown.Item>
                    <NavDropdown.Item href="/prop-management/propOrders">Prop Orders</NavDropdown.Item>
                </NavDropdown> : ""}
                {localStorage.getItem("role") != null ? <Nav.Link href="/auth" onClick={this.logout}>Logout</Nav.Link> : ""}
            </Nav>
        }

        return <Navbar bg="dark" variant="dark" expand="md">
            <Container fluid style={{ marginTop: "0px" }}>
                <Navbar.Brand href="/">EYFT</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    {nav}
                    {localStorage.getItem("role") != null ? <h4>
                        <a href='/card'>
                            <span class="badge bg-success">{MoneyFormatter.fromatDollars(this.state.cents)}</span>
                        </a>
                    </h4> : ""}
                    <Button variant={this.state.fastMode ? "success" : "outline-success"}
                        className="mx-3" onClick={this.toggleFastMode}>
                        Fast Mode
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    }

    componentDidMount() {
        let token = localStorage.getItem("accessToken");
        if (token) {
            axios({
                method: 'get',
                url: '/me/balance',
                headers: {
                    'Authorization': localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
                }
            }).then((res) => {
                this.setState({
                    accountId: res.data.accountId,
                    cents: res.data.cents
                })
                localStorage.setItem("accountId", res.data.accountId)
                localStorage.setItem("cents", res.data.cents)
            }).catch((err) => {
                ErrorHandler.runStringMessage("Can't receive balance")
            })
        }

        if (localStorage.getItem("accessToken")) {
            var socket = new SockJS('/ws/messages');
            let stompWebsocket = Stomp.over(socket);
            this.websocket = stompWebsocket;

            let thisObj = this;

            this.websocket.connect({ "X-Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken") }, function (frame) {
                stompWebsocket.subscribe('/topic/users/' + localStorage.getItem("id") + "/balance", function (data) {

                    let balance = JSON.parse(data.body)
                    localStorage.setItem("cents", balance.cents)
                    thisObj.setState({ cents: balance.cents })
                });
            });
        }
    }
}

export default AppNavbar