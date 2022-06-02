import React from "react";
import $ from 'jquery';
import AppNavbar from "./AppNavbar";
import ErrorHandler from './Handler/ErrorHandler';
import ErrorNotifier from "./Handler/ErrorNotifier";
import { Button } from "reactstrap";
import { dispense } from "Localization/Dispenser";

var jwt = require('jsonwebtoken');
const roleUser = "ROLE_USER"
const roleAdmin = "ROLE_ADMIN"
const roleArranger = "ROLE_ARRANGER"

const authAddress = "/auth"

class AuthForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            login: "",
            password: "",
			recoverMode: false
        }
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.recoverPassword = this.recoverPassword.bind(this);
    }

    handleChange(event) {
		const target = event.target;
		const value = target.value
		const name = target.name

		this.setState({
			[name]: value
		});
	}

    handleSubmit(event) {
		event.preventDefault();

		if(this.state.recoverMode){
			let data = {
				email: this.state.login,
				type: "FORGOTTEN_PASSWORD"
			}

			$.ajax({
				method: "POST",
				url: "/support",
				contentType: "application/json",
				data: JSON.stringify(data),
				success: function(data){
					ErrorHandler.runSuccess(data)
				},
				error: function(data){
					ErrorHandler.runError(data)
				}
			})
			return
		}


		let props = this.props;
		
		$.ajax({
			url: authAddress,
			contentType: "application/json; charset=UTF-8",
			method: "post",
			data: JSON.stringify(this.state),
            statusCode: {
                200: function(data, textStatus, xhr){
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('tokenType', data.tokenType);
                    localStorage.setItem('expiresIn', data.expiresIn);

					let decodedToken = jwt.decode(data.accessToken);
					console.log(decodedToken)
                    localStorage.setItem('login', decodedToken.sub);
                    localStorage.setItem('role', decodedToken.role);
                    localStorage.setItem('id', decodedToken.id);

					if(localStorage.getItem('role') === roleUser){
						props.history.push('/me');
					}
					if(localStorage.getItem('role') === roleAdmin){
						props.history.push('/admin');
					}
					if(localStorage.getItem('role') === roleArranger){
						props.history.push('/arranger');
					}
                }
            },
			error: function(data){
                ErrorHandler.runError(data)
            }
		})
	}

	recoverPassword(){
		this.setState({recoverMode: !this.state.recoverMode})
	}

    render(){
        
		return (
			<div>
				<AppNavbar/>
				<div class="container">
					<form onSubmit={this.handleSubmit}>				
						<div class="form-group mb-2">
							<label class="form-label">{this.state.recoverMode?  dispense("email") : dispense("login")}</label>
							<input type="text" class="form-control"
								name="login" value={this.state.login} onChange={this.handleChange} />
						</div>

						{this.state.recoverMode? "":
						<div class="form-group mb-2">
							<label class="form-label">{dispense("password")}</label>
							<input type="password" class="form-control"
								name="password" value={this.state.password} onChange={this.handleChange} />
						</div>}

						<div className="d-grid gap-2">
							<Button class="btn btn-success mt-3" color="success">{this.state.recoverMode? dispense("sendEmail") : dispense("enter")}</Button>
						</div>
					</form>
					<div className="d-grid gap-2 mt-3" id="passwordRecoveringStart">
						<button class="btn btn-warning" onClick={this.recoverPassword}>{this.state.recoverMode? dispense("haveRemindedPassword") 
						: dispense("haveForgottenPassword")}</button>
						{this.state.recoverMode?
						<span class='badge bg-success mt-3'>{dispense("enterEmailAndYouWillGetPassword")}</span>
						: ""}
					</div>
				</div>
                <ErrorNotifier />
			</div>
        )
    }
}

export default AuthForm