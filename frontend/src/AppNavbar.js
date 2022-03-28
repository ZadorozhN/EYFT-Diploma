import React, { Component } from 'react';
// import { Alert, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Button, Navbar, Container, Nav, Form, NavDropdown, FormControl } from 'react-bootstrap'

import { Link } from 'react-router-dom';
import $ from "jquery"
import ErrorHandler from './Handler/ErrorHandler';
import axios from 'axios';
import MoneyFormatter from './Formatter/MoneyFormatter';
import Constants from './Const/Constants'

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

        // if (localStorage.getItem("role") === roleAdmin) {
        //     navItems = <Nav className="ml-auto" navbar>
        //         <NavItem>
        //             <NavLink href="/me">Me</NavLink>
        //         </NavItem>
        //         <NavItem>
        //             <NavLink href="/arranger">Arranger Console</NavLink>
        //         </NavItem>
        //         <NavItem>
        //             <NavLink href="/admin">Admin Console</NavLink>
        //         </NavItem>
        //         <NavItem>
        //             <NavLink onClick={this.logout} href="/auth">Log Out</NavLink>
        //         </NavItem>

        //     </Nav>
        // } else if (localStorage.getItem("role") === roleUser) {
        //     navItems = <Nav className="ml-auto" navbar>
        //         <NavItem>
        //             <NavLink href="/me">Me</NavLink>
        //         </NavItem>
        //         <NavItem>
        //             <NavLink onClick={this.logout} href="/auth">Log Out</NavLink>
        //         </NavItem>
        //     </Nav>
        // } else if (localStorage.getItem("role") === roleArranger) {
        //     navItems = <Nav className="ml-auto" navbar>
        //         <NavItem>
        //             <NavLink href="/me">Me</NavLink>
        //         </NavItem>
        //         <NavItem>
        //             <NavLink href="/arranger">Arranger Console</NavLink>
        //         </NavItem>
        //         <NavItem>
        //             <NavLink onClick={this.logout} href="/auth">Log Out</NavLink>
        //         </NavItem>
        //     </Nav>
        // } else {
        //     navItems = <Nav className="ml-auto" navbar>
        //         <NavItem>
        //             <NavLink href="/auth">Login</NavLink>
        //         </NavItem>
        //         <NavItem>
        //             <NavLink href="/registration">Registration</NavLink>
        //         </NavItem>
        //     </Nav>
        // }


        // return <div class="bg bg-dark px-3">
        //     <Navbar color="dark" dark expand="md" >
        //         <NavbarBrand tag={Link} to="/" className="mr-auto">Home</NavbarBrand>
        //         <NavbarToggler onClick={this.toggle} />
        //         <Collapse isOpen={this.state.isOpen} navbar>
        //             {navItems}
        //         </Collapse>
        <h4>
            <span class="badge bg-success">{MoneyFormatter.fromatDollars(this.state.cents)}</span>
        </h4>
        //     </Navbar>
        // </div>

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
                        <span class="badge bg-success">{MoneyFormatter.fromatDollars(this.state.cents)}</span>
                    </h4> : ""}
                    <Button variant={this.state.fastMode ? "success" : "outline-success"}
                        className="mx-3" onClick={this.toggleFastMode}>
                        Fast Mode
                    </Button>

                    {/* <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form> */}
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
    }
}

export default AppNavbar