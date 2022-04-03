import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import ErrorHandler from './Handler/ErrorHandler';
import ErrorNotifier from './Handler/ErrorNotifier';
import $ from "jquery"

const roleAdmin = "ROLE_ADMIN"

let thisObj

class UserEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        thisObj = this
    }

    async componentDidMount() {
        $.ajax({
            url: `/user-management/users/${thisObj.props.match.params.id}`,
            method: "GET",
            headers: {
                'Authorization': localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                thisObj.setState({ user: data, isLoading: false });
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        let value = target.value;
        let user = { ...this.state.user };

        if (name === 'enabled') {
            value = !user.enabled
        }

        user[name] = value;
        this.setState({ user: user });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { user: user } = this.state;

        $.ajax({
            url: '/user-management/users/' + user.id,
            method: "PUT",
            data: JSON.stringify(user),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                thisObj.setState({ users: data.users, isLoading: false });
                thisObj.props.history.push('/user-management/users');
                ErrorHandler.runSuccess(data)
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }

    render() {
        const { user: user } = this.state;

        if (localStorage.getItem("login") == null || localStorage.getItem("role") !== roleAdmin || localStorage.getItem("id") == null) {
            return <ErrorNotifier />
        }

        return <div>
            <AppNavbar />
            <Container style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ minWidth: '60%' }}>
                    <Form onSubmit={this.handleSubmit} style={{ minWidth: '100%'}}>
                        <FormGroup className="mt-3">
                            <Label for="email">Email</Label>
                            <Input type="text" name="email" id="email" value={user.email || ''}
                                onChange={this.handleChange} autoComplete="email" />
                        </FormGroup>
                        <FormGroup className="mt-3" style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ minWidth: "49%" }}>
                                <Label for="firstName">First Name</Label>
                                <Input type="text" name="firstName" id="firstName" value={user.firstName || ''}
                                    onChange={this.handleChange} autoComplete="firstName" />
                            </div>
                            <div style={{ minWidth: "49%" }}>
                                <Label for="lastName">Last Name</Label>
                                <Input type="text" name="lastName" id="lastName" value={user.lastName || ''}
                                    onChange={this.handleChange} autoComplete="lastName" />
                            </div>
                        </FormGroup>
                        <FormGroup className="mt-5" style={{ display: "flex", justifyContent: "space-around" }}>
                            <Button onClick={this.handleChange} style={{minWidth: "25%"}} color={user.role == "ADMIN" ? 'danger' : 'outline-danger'} name="role" value='ADMIN' >Admin</Button>
                            <Button onClick={this.handleChange} style={{minWidth: "25%"}} color={user.role == "USER" ? 'success' : 'outline-success'} name="role" value='USER' standalone checked={user.role == "USER"}>User</Button>
                            <Button onClick={this.handleChange} style={{minWidth: "25%"}} color={user.role == "ARRANGER" ? 'warning' : 'outline-warning text-dark'} name="role" value='ARRANGER' standalone checked={user.role == "ARRANGER"} >Arranger</Button>
                            <Button name="enabled" id="enabled" style={{minWidth: "25%"}} color={this.state.user.enabled ? "outline-success": "danger"}
                                onClick={this.handleChange} autoComplete="enabled">{this.state.user.enabled ? "Enabled": "Disabled"}</Button>
                        </FormGroup>
                        <FormGroup className="mt-5" style={{ display: "flex", justifyContent: "space-between" }}>
                            <Button color="success" style={{ minWidth: "49%" }} type="submit">Save</Button>{' '}
                            <Button color="secondary" style={{ minWidth: "49%" }} tag={Link} to="/user-management/users">Cancel</Button>
                        </FormGroup>
                    </Form>
                </div>
            </Container>
            <ErrorNotifier />
        </div>
    }
}

export default withRouter(UserEdit);