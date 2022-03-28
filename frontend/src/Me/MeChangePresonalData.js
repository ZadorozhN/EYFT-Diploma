import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import $ from "jquery"
import ErrorNotifier from '../Handler/ErrorNotifier';
import Constants from '../Const/Constants';
import ErrorHandler from '../Handler/ErrorHandler';

let thisObj

class MeChangePersonalData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            oldPassword: null,
            newPassword: null,
            newPasswordRepeat: null,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.becomeArranger = this.becomeArranger.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);

        thisObj = this
    }

    async componentDidMount() {
        
        $.ajax({
            url: '/me/personalData',
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function(data){
                thisObj.setState({ user: data });
            }
        })
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        let value = target.value;
        let user = { ...this.state.user };

        if(name === 'enabled'){
            value = target.checked
        }

        user[name] = value;
        this.setState({ user: user });
    }

    async handleSubmit(event) {
        event.preventDefault();

        let data = {
            firstName : this.state.user.firstName,
            lastName :  this.state.user.lastName,
            email : this.state.user.email
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
            success: function(data){
                ErrorHandler.runSuccess(data)
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        })
    }

    becomeArranger() {
        $.ajax({
            url:"/me/becomeArranger",
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
              },
            success: function(data){
                ErrorHandler.runSuccess(data)
                let waitingNotifier = "<div class=\"badge bg-success\">Waiting for an approval of arranger becoming</div>"
                $("#arrangerBecoming").html(waitingNotifier)
            },
            error: function(data){
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
            oldPassword : this.state.oldPassword,
            newPassword :  this.state.newPassword,
            newPasswordRepeat : this.state.newPasswordRepeat
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
            success: function(data){
                ErrorHandler.runSuccess(data)
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        })
    }

    render() {

        if(localStorage.getItem("login") == null 
        || !Constants.isAnyRole((localStorage.getItem("role"))) 
        || localStorage.getItem("id") == null){
            return <ErrorNotifier/>
        }

        const { user: user } = this.state;
        const title = <h2>Edit User {user.id}</h2>;

        let arrangerBecoming = user.arrangerRoleRequested 
            ? <div class="badge bg-success">Waiting for an approval of arranger becoming</div>
            : Constants.isArrangerOrHigher(localStorage.getItem("role")) ? "" : <Button color="success" onClick={this.becomeArranger}>Become Arranger</Button>

        return <div>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup className="mt-3">
                        <Label for="email">Email</Label>
                        <Input type="text" name="email" id="email" value={user.email || ''}
                            onChange={this.handleChange} autoComplete="email" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="firstName">First Name</Label>
                        <Input type="text" name="firstName" id="firstName" value={user.firstName || ''}
                            onChange={this.handleChange} autoComplete="firstName" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="lastName">Last Name</Label>
                        <Input type="text" name="lastName" id="lastName" value={user.lastName || ''}
                            onChange={this.handleChange} autoComplete="lastName" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Button color="success" type="submit">Save</Button>{' '}
                    </FormGroup>
                </Form>
                <Form onSubmit={this.handlePasswordSubmit}>
                    <FormGroup className="mt-3">
                        <Label for="oldPassword">Old Password</Label>
                        <Input type="password" name="oldPassword" id="oldPassword" value={this.state.oldPassword || ''}
                            onChange={this.handlePasswordChange} autoComplete="oldPassword" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="newPassword">New password</Label>
                        <Input type="password" name="newPassword" id="newPassword" value={this.state.newPassword || ''}
                            onChange={this.handlePasswordChange} autoComplete="newPassword" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="newPasswordRepeat">New Password Repeat</Label>
                        <Input type="password" name="newPasswordRepeat" id="newPasswordRepeat" value={this.state.newPasswordRepeat || ''}
                            onChange={this.handlePasswordChange} autoComplete="newPasswordRepeat" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Button color="success" type="submit">Change password</Button>{' '}
                    </FormGroup>
                </Form>
                <div class="mt-3" id="arrangerBecoming">
                    {arrangerBecoming}
                </div>
            </Container>
        </div>
    }
}

export default withRouter(MeChangePersonalData);