import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Button, Card, Row} from 'react-bootstrap'
import {Input} from 'reactstrap';
import $ from 'jquery';
import ErrorHandler from '../../Handler/ErrorHandler';
import ErrorNotifier from '../../Handler/ErrorNotifier';
import Constants from '../../Const/Constants';
import Waiter from '../../Waiter';
import { dispense } from "Localization/Dispenser";

const address = ""

let thisObj; 

class GuestMePhotos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: true,
            }
            
            thisObj = this
        }

    async componentDidMount() {
        const userUrl = `/guest/${this.props.match.params.login}`;

        $.ajax({
            method: "GET",
            url: userUrl,
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
              },
            success: function(data){
                thisObj.setState({ user: data, isLoading: false  });
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        })
    }

    render() {

		const { user, isLoading } = this.state;

		if (isLoading) {
			return <p>{dispense("loading...")}</p>;
		}

		const photosList = this.state.user.photos.map(photo => {
            return <Card border="light"> 
                        <Card.Img src={"/resources/users/" + this.state.user.id + "/photos/" + photo.id} />
                    </Card>
        })

        const avatar = user.avatar !== null ?   <Card> 
                                                    <Card.Img src={"/resources/users/" + user.id + "/photos/" + user.avatar.id}/>
                                                </Card> 
                                                : ""

        return <div>
                    <Row xs={1} md={3} className="g-4">
                        {photosList}
                    </Row>
                </div>
    }
}

export default withRouter(GuestMePhotos);