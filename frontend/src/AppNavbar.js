import React, { Component } from 'react';
import { Button, Navbar, Container, Nav, Form, NavDropdown, FormControl } from 'react-bootstrap'

import { Link } from 'react-router-dom';
import $ from "jquery"
import ErrorHandler from './Handler/ErrorHandler';
import axios from 'axios';
import MoneyFormatter from './Formatter/MoneyFormatter';
import Constants from './Const/Constants'
import { dispense } from "Localization/Dispenser";

var Stomp = require('stompjs');
var SockJS = require("sockjs-client");

const roleUser = "ROLE_USER"
const roleAdmin = "ROLE_ADMIN"
const roleArranger = "ROLE_ARRANGER"

class AppNavbar extends Component {
    constructor(props) {
        super(props);
        let fm = localStorage.getItem("fastMode")

        let langInit = localStorage.getItem("lang")
        if(!langInit){
            localStorage.setItem("lang", "ru")
        }

        this.state = {
            isOpen: false,
            accountId: null,
            cents: null,
            fastMode: JSON.parse(fm) === true,
            lang: localStorage.getItem("lang")
        };

        this.toggle = this.toggle.bind(this);
        this.logout = this.logout.bind(this);
        this.toggleFastMode = this.toggleFastMode.bind(this);
        this.toggleLanguage = this.toggleLanguage.bind(this);
    }

    toggleFastMode() {

        localStorage.setItem("fastMode", !this.state.fastMode)
        this.setState({ fastMode: !this.state.fastMode })
    }
    
    toggleLanguage() {
        let newLang

        if(this.state.lang == "en"){
            newLang = "ru"
        } else {
            newLang = "en"
        }

        localStorage.setItem("lang", newLang)
        window.location.reload()
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
            <span class="badge bg-success">{MoneyFormatter.format(this.state.cents)}</span>
        </h4>

        let nav;
        if (this.state.fastMode) {
            nav = <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
            >
                {localStorage.getItem("role") == null ? <Nav.Link href="/auth">{dispense("login")}</Nav.Link> : ""}
                {localStorage.getItem("role") == null ? <Nav.Link href="/registration">{dispense("registration")}</Nav.Link> : ""}
                {localStorage.getItem("role") != null ? <Nav.Link href="/me">{dispense("personalPage")}</Nav.Link> : ""}
                {Constants.isArrangerOrHigher(localStorage.getItem("role")) ? <Nav.Link href="/arranger">{dispense("arranger")}</Nav.Link> : ""}
                {Constants.isAdmin(localStorage.getItem("role")) ? <Nav.Link href="/admin">{dispense("admin")}</Nav.Link> : ""}
                {localStorage.getItem("role") != null ? <Nav.Link href="/auth" onClick={this.logout}>{dispense("logout")}</Nav.Link> : ""}
            </Nav>
        } else {
            nav = <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
            >

                {localStorage.getItem("role") == null ? <Nav.Link href="/auth">{dispense("login")}</Nav.Link> : ""}
                {localStorage.getItem("role") == null ? <Nav.Link href="/registration">{dispense("registration")}</Nav.Link> : ""}
                {localStorage.getItem("role") != null ?
                    <NavDropdown title="Личная страница" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/me">{dispense("console")}</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/me/events">{dispense("events")}</NavDropdown.Item>
                        <NavDropdown.Item href="/me/joined">{dispense("participationInEvents")}</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/me/messenger">{dispense("messenger")}</NavDropdown.Item>
                        <NavDropdown.Item href="/me/photos">{dispense("photos")}</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/me/settings">{dispense("settings")}</NavDropdown.Item>
                    </NavDropdown> : ""}
                {Constants.isArrangerOrHigher(localStorage.getItem("role")) ? <NavDropdown title={dispense("arranger")} id="navbarScrollingDropdown">
                    <NavDropdown.Item href="/arranger">{dispense("console")}</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/arranger/arranged">{dispense("arrangedEvents")}</NavDropdown.Item>
                    <NavDropdown.Item href="/arranger/arrangement">{dispense("arrangeEvent")}</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/arranger/props/market">{dispense("orderProp")}</NavDropdown.Item>
                    <NavDropdown.Item href="/arranger/props/ordered">{dispense("orderedProps")}</NavDropdown.Item>
                </NavDropdown> : ""}
                {Constants.isAdmin(localStorage.getItem("role")) ? <NavDropdown title={dispense("admin")} id="navbarScrollingDropdown">
                    <NavDropdown.Item href="/admin">{dispense("console")}</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/event-management/events">{dispense("events")}</NavDropdown.Item>
                    <NavDropdown.Item href="/category-management/categories">{dispense("categories")}</NavDropdown.Item>
                    <NavDropdown.Item href="/user-management/users">{dispense("users")}</NavDropdown.Item>
                    <NavDropdown.Item href="/prop-management/props">{dispense("props")}</NavDropdown.Item>
                    <NavDropdown.Item href="/prop-management/propOrders">{dispense("propOrders")}</NavDropdown.Item>
                </NavDropdown> : ""}
                {localStorage.getItem("role") != null ? <Nav.Link href="/auth" onClick={this.logout}>{dispense("logout")}</Nav.Link> : ""}
            </Nav>
        }

        return <Navbar bg="dark" variant="dark" expand="md">
            <Container fluid style={{ marginTop: "0px" }}>
                <Navbar.Brand href="/">{dispense("logo")}</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    {nav}
                    {localStorage.getItem("role") != null ?
                            <Button variant="outline-success" href='/card'>{MoneyFormatter.format(this.state.cents)}</Button>
                    : ""}
                    <Button variant={this.state.fastMode ? "success" : "outline-success"}
                        className="mx-1" onClick={this.toggleFastMode}>
                        {dispense("fastMode")}
                    </Button>
                    <Button variant={this.state.lang == "en" ? "success" : "outline-success"}
                        onClick={this.toggleLanguage}>
                        {dispense("language-locale")}
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
                ErrorHandler.runStringMessage(dispense("cantReceiveBalance"))
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