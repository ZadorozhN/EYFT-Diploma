import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Button, Card} from 'react-bootstrap'
import {Input} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import $ from 'jquery';
import ErrorHandler from '../Handler/ErrorHandler';
import ErrorNotifier from '../Handler/ErrorNotifier';
import Constants from '../Const/Constants';
import style from "../style.css"

const address = ""

let thisObj; 

class MePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login : localStorage.getItem("login"),
            id : localStorage.getItem("id"),
            role : localStorage.getItem("role"),
            user: null,
            isLoading: true,
            }

            this.logout = this.logout.bind(this)
            this.joinEvents = this.joinEvents.bind(this)
            
            thisObj = this
        }

    async componentDidMount() {
        $.ajax({
            method: "Get",
            url: "/me",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
              },
            success: function(data){
                thisObj.setState({ user: data, isLoading: false  });
                
                Constants.updateRole(data.role)
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        })
    }

    logout() {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("tokenType")
        localStorage.removeItem("expiresIn")
        
        localStorage.removeItem("login")
        localStorage.removeItem("id")
        localStorage.removeItem("role")

        this.props.history.push('/auth');
    }

    joinEvents() {
        this.props.history.push('/me/join-events');
    }

    render() {

        if(localStorage.getItem("login") == null 
        || !Constants.isAnyRole((localStorage.getItem("role"))) 
        || localStorage.getItem("id") == null){
            return <ErrorNotifier/>
        }

		const { user, isLoading } = this.state;

		if (isLoading) {
			return <p>Loading...</p>;
		}

        if(this.state.login == null || this.state.role == null || this.state.id == null){
            return <div><h1>Unauthorized</h1></div>
        }


        const avatar = user.avatar !== null ?   <Card > 
                                                    <Card.Img src={"/resources/users/" + user.id + "/photos/" + user.avatar.id}/>
                                                </Card> 
                                                : ""

        return <div className="d-grid gap-2">
                    {avatar}
                    <h1>{this.state.login}</h1>
                    <Button variant="success" onClick={this.joinEvents}>
                        Join Events
                    </Button>
                    <Button variant="warning" onClick={this.logout}>
                        Logout
                    </Button>
                    
                </div>
    }
}

export default withRouter(MePage);