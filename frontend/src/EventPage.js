import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, ButtonGroup, Table, Input, InputGroup } from 'reactstrap';
import { Card, CardGroup, Col, Row, Image } from 'react-bootstrap'
import $ from 'jquery'

import Badge from 'react-bootstrap/Badge';
import AppNavbar from './AppNavbar';
import ErrorNotifier from './Handler/ErrorNotifier';
import ErrorHandler from './Handler/ErrorHandler';
import Constants from './Const/Constants';
import InstantFormatter from './Formatter/InstantFormatter'

let thisObj

class EventPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: localStorage.getItem("id"),
            event: null,
            isLoading: true,
            comments: [],
            commentText: ""
        }

        thisObj = this;

        this.leaveComment = this.leaveComment.bind(this);
        this.changeCommentText = this.changeCommentText.bind(this);
    }

    async componentDidMount() {
        const response = await fetch(`/events/${this.props.match.params.id}`, {
            method: "GET",
            headers: new Headers({
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            })
        });

        const body = await response.json();
        this.setState({ event: body });

        const commentsResponse = await fetch(`/comments/event/${this.props.match.params.id}`, {
            method: "GET",
            headers: new Headers({
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            })
        });

        const commentsBody = await commentsResponse.json();
        this.setState({ comments: commentsBody.comments, isLoading: false });
    }

    leaveComment() {

        const dto = {
            text: this.state.commentText
        }

        $.ajax({
            url: '/comments/event/' + this.state.event.id,
            contentType: "application/json; charset=UTF-8",
            method: "post",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            data: JSON.stringify(dto),
            success: function (data) {
                let updatedComments = [...thisObj.state.comments];
                updatedComments.push({
                    user: {
                        login: localStorage.getItem("login"),
                        id: localStorage.getItem("id"),
                    },
                    text: dto.text,
                    creationTime: new Date() / 1000
                })
                thisObj.setState({ comments: updatedComments, commentText: "" });
                // ErrorHandler.runSuccess(data)
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }

    changeCommentText(e) {
        let target = e.target;

        this.setState({
            commentText: target.value
        })
    }

    render() {

        //TODO fix anonim
        // if(localStorage.getItem("login") == null 
        // || !Constants.isAnyRole((localStorage.getItem("role"))) 
        // || localStorage.getItem("id") == null){
        // return <ErrorNotifier/>
        // }

        const { event, isLoading } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        var startInstant = new Date(event.startInstant * 1000);
        startInstant.toLocaleString('en-GB', { hour12: false })

        var endInstant = new Date(event.endInstant * 1000);
        endInstant.toLocaleString('en-GB', { hour12: false })

        var categories = event.categoriesNames.map(category => {
            return <Badge className="bg bg-info m-1">{category}</Badge>
        })

        let photosLength = event.photos.length
        let photoSrc = ""
        if (photosLength > 0) {
            photoSrc = "/resources/events/" + event.id + "/photos/" + event.photos[0].id;
        }

        const photosList = event.photos.map(photo => {
            return <Card >
                <Card.Img src={"/resources/events/" + event.id + "/photos/" + photo.id} />
            </Card>
        })

        const preview = event.preview !== null ? <Card >
            <Card.Img src={"/resources/events/" + event.id + "/photos/" + event.preview.id} />
        </Card>
            : ""

        let arranger = ""
        if (event.userLogin !== null) {
            arranger = <div>Arranger: <Link to={`/guest/${event.userLogin}`}>{event.userLogin}</Link></div>
        } else {
            arranger = <div>Arranger: No owner </div>
        }

        const comments = this.state.comments.map(comment => {
            return <div><span class="badge bg-success">{comment.user.login}</span>{InstantFormatter.formatInstant(comment.creationTime)} {comment.text}</div>
        })

        return <div>
            <AppNavbar />
            <Container fluid>
                <Row>
                    <Col xs="4">
                        {preview}
                        <div>Title: {event.name}</div>
                        <div>Description: {event.description}</div>
                        {arranger}
                        <div>Categories: {categories}</div>
                        <div>Place: {event.place}</div>
                        <div>
                            Starts at {startInstant.toLocaleString('en-GB', { hour12: false })}
                        </div>
                        <div>
                            Finishes at {endInstant.toLocaleString('en-GB', { hour12: false })}
                        </div>
                        <div>
                            {localStorage.getItem("login") == null ? "" :
                                <InputGroup>
                                    <Input placeholder='Leave a comment' onChange={this.changeCommentText} value={this.state.commentText} />
                                    <Button onClick={this.leaveComment} color='info'>Send</Button>
                                </InputGroup>
                            }
                        </div>
                        <div>
                            Comments:{comments}
                        </div>
                    </Col>

                    <Col xs="8">
                        <Row xs={1} md={3} className="g-4">
                            {photosList}
                        </Row>
                    </Col>
                </Row>
            </Container>
            <ErrorNotifier />
        </div>
    }
}

export default withRouter(EventPage);