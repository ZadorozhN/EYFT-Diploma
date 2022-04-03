import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Button, Card} from 'react-bootstrap'
import {Input} from 'reactstrap';
import AppNavbar from '../../AppNavbar';
import $ from 'jquery';
import ErrorHandler from '../../Handler/ErrorHandler';
import ErrorNotifier from '../../Handler/ErrorNotifier';
import Constants from '../../Const/Constants';

const address = ""

let thisObj; 

class GuestMePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: true,
            setUser: props.setUser
            }

            thisObj = this
        }

    async componentDidMount() {
        
        const userUrl = `/guest/${this.props.match.params.login}`;

        $.ajax({
            method: "Get",
            url: userUrl,
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
              },
            success: function(data){
                thisObj.setState({ user: data, isLoading: false  });
                thisObj.state.setUser(data)
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        })
    }

    render() {
		const { user, isLoading } = this.state;

		if (isLoading) {
			return <p>Loading...</p>;
		}

        const avatar = user.avatar !== null ?   <Card > 
                                                    <Card.Img src={"/resources/users/" + user.id + "/photos/" + user.avatar.id}/>
                                                </Card> 
                                                : ""

        return <div className="d-grid gap-2">
                    {avatar}
                    <h1>{this.state.user.login}</h1>
                </div>
    }
}

export default withRouter(GuestMePage);