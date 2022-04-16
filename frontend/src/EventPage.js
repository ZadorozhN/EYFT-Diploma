import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, ButtonGroup, Table, Input, InputGroup, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Card, CardGroup, Col, Row, Image } from 'react-bootstrap'
import $ from 'jquery'
import css from './style.css'
import classnames from 'classnames';

import Badge from 'react-bootstrap/Badge';
import AppNavbar from './AppNavbar';
import ErrorNotifier from './Handler/ErrorNotifier';
import ErrorHandler from './Handler/ErrorHandler';
import Constants from './Const/Constants';
import InstantFormatter from './Formatter/InstantFormatter'
import ParticipantMessageGenerator from './ParticipantMessageGenerator'

let thisObj

class EventPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: localStorage.getItem("id"),
            event: null,
            isLoading: true,
            comments: [],
            commentText: "",
            activeTab: '1'
        }

        this.participantMessageGenerator = new ParticipantMessageGenerator()

        thisObj = this;

        this.leaveComment = this.leaveComment.bind(this);
        this.changeCommentText = this.changeCommentText.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
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

        const { event, isLoading } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        let photosLength = event.photos.length
        let photoSrc = ""
        if (photosLength > 0) {
            photoSrc = "/resources/events/" + event.id + "/photos/" + event.photos[0].id;
        }

        const photosList = event.photos.map(photo => {
            return <Card border="light">
                <Card.Img src={"/resources/events/" + event.id + "/photos/" + photo.id} />
            </Card>
        })

        const preview = event.preview !== null ? <Card >
            <Card.Img src={"/resources/events/" + event.id + "/photos/" + event.preview.id} />
        </Card>
            : ""

        const comments = this.state.comments.map(comment => {
            return <div class="border-bottom p-2">
                <div>
                    <span class="text-secondary me-1">{comment.user.login} at</span>
                    <span class="text-secondary">{InstantFormatter.formatInstant(comment.creationTime)}</span>
                </div>
                <div>
                    {comment.text}
                </div>
            </div>
        })

        return <div>
            <AppNavbar />
            <Container fluid>
                <Row>
                    <Col xs="4">
                        {preview}
                        <hr class="solid" />
                        <h2 className='text-center'>{event.name}</h2>
                        <hr class="solid" />
                    </Col>
                    <Col xs="8">
                        <div>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '1' })}
                                        onClick={() => { this.toggle('1'); }}
                                    >
                                        Information 📊
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '2' })}
                                        onClick={() => { this.toggle('2'); }}
                                    >
                                        Comments 💬
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '3' })}
                                        onClick={() => { this.toggle('3'); }}
                                    >
                                        Photos 📷
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="1">
                                    {this.renderInfoSection.bind(this)(event)}
                                </TabPane>
                                <TabPane tabId="2">
                                    {this.renderCommentSection.bind(this)(comments)}
                                </TabPane>
                                <TabPane tabId="3">
                                    {this.renderPhotosSection.bind(this)(photosList, event)}
                                </TabPane>
                            </TabContent>
                        </div>
                    </Col>
                </Row>
            </Container>
            <ErrorNotifier />
        </div>
    }

    renderInfoSection(event) {
        let arranger = ""
        if (event.userLogin !== null) {
            arranger = <Link to={`/guest/${event.userLogin}`}>{event.userLogin}</Link>
        } else {
            arranger = "No owner"
        }

        var startInstant = new Date(event.startInstant * 1000);
        startInstant.toLocaleString('en-GB', { hour12: false })

        var endInstant = new Date(event.endInstant * 1000);
        endInstant.toLocaleString('en-GB', { hour12: false })

        var categories = event.categoriesNames.map(category => {
            return <Badge className="bg bg-success me-1" style={{ minWidth: "24%" }}>{category}</Badge>
        })

        var state
        switch (event.eventState) {
            case "WAITING_FOR_START":
                state = <Badge className="bg-warning text-dark" style={{ minWidth: "100%" }}>Waiting</Badge>
                break;
            case "STARTED":
                state = <Badge className="bg-success" style={{ minWidth: "100%" }}>Started</Badge>
                break;
            case "FINISHED":
                state = <Badge className="bg-danger" style={{ minWidth: "100%" }}>Finished</Badge>
                break;
            case "CLOSED":
                state = <Badge className="bg-dark" style={{ minWidth: "100%" }}>Closed</Badge>
                break;
        }

        let participantMessage = this.participantMessageGenerator.make(event.participantsAmount);

        return (<div>
            <div>{event.description}</div>
            <div>
                <h5>
                    {categories}
                </h5>
            </div>
            <div>Arranged by {arranger} nearby {event.place}</div>
            <div>{participantMessage}</div>
            <div>
                Starts at {startInstant.toLocaleString('en-GB', { hour12: false })}
            </div>
            <div>
                Finishes at {endInstant.toLocaleString('en-GB', { hour12: false })}
            </div>
            <div>
                <h5>
                    {state}
                </h5>
            </div>
        </div>
        )
    }

    renderCommentSection(comments) {
        return (<div>
            <div>
                {localStorage.getItem("login") == null ? "" :
                    <InputGroup className="my-1">
                        <Input placeholder='Leave a comment' onChange={this.changeCommentText} value={this.state.commentText} />
                        <Button onClick={this.leaveComment} color='success'>Send</Button>
                    </InputGroup>
                }
            </div>
            <div>
                <div class="messagesScroller" >
                    {comments}
                </div>
            </div>
        </div>)
    }

    renderPhotosSection(photosList) {
        return (<div>
            <Row xs={1} md={3} className="g-4">
                {photosList}
            </Row>
        </div>
        )
    }
}

export default withRouter(EventPage);