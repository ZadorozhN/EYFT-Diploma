import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, TabContent, TabPane, Nav, NavItem, NavLink, } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import $ from "jquery"
import ErrorNotifier from '../Handler/ErrorNotifier';
import Constants from '../Const/Constants';
import ErrorHandler from '../Handler/ErrorHandler';
import classnames from 'classnames';
import { dispense } from "Localization/Dispenser";

let thisObj

class MySettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            oldPassword: null,
            newPassword: null,
            newPasswordRepeat: null,
            activeTab: "1"
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.becomeArranger = this.becomeArranger.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
        this.toggle = this.toggle.bind(this)

        thisObj = this
    }

    
    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    async componentDidMount() {

        $.ajax({
            url: '/me/personalData',
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                thisObj.setState({ user: data });
            }
        })
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        let value = target.value;
        let user = { ...this.state.user };

        if (name === 'enabled') {
            value = target.checked
        }

        user[name] = value;
        this.setState({ user: user });
    }

    async handleSubmit(event) {
        event.preventDefault();

        let data = {
            firstName: this.state.user.firstName,
            lastName: this.state.user.lastName,
            email: this.state.user.email
        }

        $.ajax({
            url: '/me/personalData',
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            data: JSON.stringify(data),
            success: function (data) {
                ErrorHandler.runSuccess(data)
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }

    becomeArranger() {
        $.ajax({
            url: "/me/becomeArranger",
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                ErrorHandler.runSuccess(data)
                let waitingNotifier = "<div class=\"badge bg-success\">Waiting for an approval of arranger becoming</div>"
                $("#arrangerBecoming").html(waitingNotifier)
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }


    handlePasswordChange(event) {
        const target = event.target;
        const name = target.name;
        let value = target.value;

        this.setState({ [name]: value });
    }

    async handlePasswordSubmit(event) {
        event.preventDefault();

        let data = {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
            newPasswordRepeat: this.state.newPasswordRepeat
        }

        $.ajax({
            url: '/me/password',
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            data: JSON.stringify(data),
            success: function (data) {
                ErrorHandler.runSuccess(data)
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }

    render() {

        if (localStorage.getItem("login") == null
            || !Constants.isAnyRole((localStorage.getItem("role")))
            || localStorage.getItem("id") == null) {
            return <ErrorNotifier />
        }

        const { user: user } = this.state;

        let arrangerBecoming = user.arrangerRoleRequested
            ? <div class="badge bg-success">{dispense("waitingForAnApprovalOfArrangerBecoming")}</div>
            : Constants.isArrangerOrHigher(localStorage.getItem("role")) ? "" : <Button color="success" style={{minWidth:"100%"}} onClick={this.becomeArranger}>{dispense("becomeArranger")}</Button>

        return <div>
            <AppNavbar />
            <Container>
                <div className="p-3">
                    <Nav tabs >
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggle('1'); }}
                            >
                                {dispense("personalData")} 📗
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggle('2'); }}
                            >
                                {dispense("password")} ⚙️
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={() => { this.toggle('3'); }}
                            >
                                {dispense("arranger")} 🎍
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup className="mt-3">
                                    <Label for="email">{dispense("email")}</Label>
                                    <Input type="text" name="email" id="email" value={user.email || ''}
                                        onChange={this.handleChange} autoComplete="email" />
                                </FormGroup>
                                <FormGroup className="mt-3">
                                    <Label for="firstName">{dispense("firstName")}</Label>
                                    <Input type="text" name="firstName" id="firstName" value={user.firstName || ''}
                                        onChange={this.handleChange} autoComplete="firstName" />
                                </FormGroup>
                                <FormGroup className="mt-3">
                                    <Label for="lastName">{dispense("lastName")}</Label>
                                    <Input type="text" name="lastName" id="lastName" value={user.lastName || ''}
                                        onChange={this.handleChange} autoComplete="lastName" />
                                </FormGroup>
                                <FormGroup className="mt-4">
                                    <Button color="success" style={{minWidth:"100%"}} type="submit">{dispense("save")}</Button>{' '}
                                </FormGroup>
                            </Form>
                        </TabPane>
                        <TabPane tabId="2">
                            <Form onSubmit={this.handlePasswordSubmit}>
                                <FormGroup className="mt-3">
                                    <Label for="oldPassword">{dispense("oldPassword")}</Label>
                                    <Input type="password" name="oldPassword" id="oldPassword" value={this.state.oldPassword || ''}
                                        onChange={this.handlePasswordChange} autoComplete="oldPassword" />
                                </FormGroup>
                                <FormGroup className="mt-3">
                                    <Label for="newPassword">{dispense("newPassword")}</Label>
                                    <Input type="password" name="newPassword" id="newPassword" value={this.state.newPassword || ''}
                                        onChange={this.handlePasswordChange} autoComplete="newPassword" />
                                </FormGroup>
                                <FormGroup className="mt-3">
                                    <Label for="newPasswordRepeat">{dispense("newPasswordRepeat")}</Label>
                                    <Input type="password" name="newPasswordRepeat" id="newPasswordRepeat" value={this.state.newPasswordRepeat || ''}
                                        onChange={this.handlePasswordChange} autoComplete="newPasswordRepeat" />
                                </FormGroup>
                                <FormGroup className="mt-4">
                                    <Button color="success" style={{minWidth:"100%"}} type="submit">{dispense("changePassword")}</Button>{' '}
                                </FormGroup>
                            </Form>
                        </TabPane>
                        <TabPane tabId="3">
                            <div class="mt-3" id="arrangerBecoming">
                                {arrangerBecoming}
                            </div>
                        </TabPane>
                    </TabContent>
                </div>
            </Container>
            <ErrorNotifier />
        </div>
    }
}

export default withRouter(MySettings);