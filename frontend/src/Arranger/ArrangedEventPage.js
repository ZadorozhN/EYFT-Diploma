import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, ButtonGroup, Table, Input, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { Button, Card, CardGroup, Col, Row, Image } from 'react-bootstrap'
import classnames from 'classnames';

import { Badge } from 'react-bootstrap';
import AppNavbar from '../AppNavbar';
import ErrorNotifier from '../Handler/ErrorNotifier';
import $ from "jquery"
import ErrorHandler from '../Handler/ErrorHandler';
import ArrangedEventEdit from './ArrangedEventEdit';
import InstantFormatter from '../Formatter/InstantFormatter';
import Waiter from '../Waiter';

const roleArranger = "ROLE_ARRANGER"
const roleAdmin = "ROLE_ADMIN"

let thisObj

class ArrangedEventPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: localStorage.getItem("id"),
            event: null,
            comments: [],
            isLoading: true,
            activeTab: '1'
        }

        this.toggle = this.toggle.bind(this);

        this.startEvent = this.startEvent.bind(this);
        this.stopEvent = this.stopEvent.bind(this);
        this.finishEvent = this.finishEvent.bind(this);
        this.closeEvent = this.closeEvent.bind(this);
        this.setPreview = this.setPreview.bind(this);
        this.removePhoto = this.removePhoto.bind(this);

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
            url: `/events/${thisObj.props.match.params.id}`,
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: async function (data) {
                thisObj.setState({ event: data });

                const commentsResponse = await fetch(`/comments/event/${thisObj.props.match.params.id}`, {
                    method: "GET",
                    headers: new Headers({
                        "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
                    })
                });

                const commentsBody = await commentsResponse.json();
                thisObj.setState({ comments: commentsBody.comments, isLoading: false });

            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }

    upload(event) {
        let target = event.target

        const fileInput = document.querySelector("#eventImages" + target.getAttribute("eventId"));
        const formData = new FormData();

        for (let photo of fileInput.files) {
            formData.append('photos', photo);
        }

        fetch("/resources/events/" + target.getAttribute("eventId"), {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            }
        }).then(function (event) {
            window.location.reload()
        })
    }

    startEvent(event) {

        $.ajax({
            url: "/events/" + event.target.getAttribute("eventId") + "/start",
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                window.location.reload()
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }

    stopEvent(event) {

        $.ajax({
            url: "/events/" + event.target.getAttribute("eventId") + "/stop",
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                window.location.reload()
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })

    }

    finishEvent(event) {


        $.ajax({
            url: "/events/" + event.target.getAttribute("eventId") + "/finish",
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                window.location.reload()
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }

    closeEvent(event) {
        $.ajax({
            url: "/events/" + event.target.getAttribute("eventId") + "/close",
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                window.location.reload()
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }

    setPreview(event) {
        let eventInDto = {
            id: event.target.getAttribute("photoId")
        }

        $.ajax({
            url: "/arranger/arranged/" + event.target.getAttribute("eventId") + "/preview",
            method: "PUT",
            data: JSON.stringify(eventInDto),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                window.location.reload()
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }

    removePhoto(event) {
        $.ajax({
            url: `/arranger/arranged/${event.target.getAttribute("eventId")}/photos/${event.target.getAttribute("photoId")}`,
            method: "DELETE",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function () {
                window.location.reload();
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }

    render() {

        if (localStorage.getItem("login") == null
            || (localStorage.getItem("role") !== roleArranger && localStorage.getItem("role") !== roleAdmin)
            || localStorage.getItem("id") == null) {
            return <ErrorNotifier />
        }

        const { event, isLoading } = this.state;

        if (isLoading) {
            return <Waiter />;
        }

        var startInstant = new Date(event.startInstant * 1000);
        startInstant.toLocaleString('en-GB', { hour12: false })

        var endInstant = new Date(event.endInstant * 1000);
        endInstant.toLocaleString('en-GB', { hour12: false })

        var categories = event.categoriesNames.map(category => {
            return <Badge className="bg bg-success me-1" style={{ minWidth: "24%" }}>{category}</Badge>
        })

        let photosLength = event.photos.length
        let photoSrc = ""
        if (photosLength > 0) {
            photoSrc = "/resources/events/" + event.id + "/photos/" + event.photos[0].id;
        }

        const photosList = event.photos.map(photo => {
            return <Card border="light">
                <Card.Img src={"/resources/events/" + event.id + "/photos/" + photo.id} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {this.state.event.preview.id == photo.id ? <span className='mt-3 border-bottom border-success' style={{ minWidth: "79%" }}>Current Preview</span> :
                        <Button onClick={this.setPreview} eventId={event.id} photoId={photo.id} variant="outline-success" className="mt-1" style={{ minWidth: "79%" }}>Set as preview</Button>
                    }
                    <Button onClick={this.removePhoto} eventId={event.id} photoId={photo.id} variant="outline-danger" className="mt-1" style={{ minWidth: "20%" }}>❌</Button>
                </div>
            </Card>
        })

        let eventAction = ""
        if (event.eventState == "WAITING_FOR_START") {
            eventAction =
                <div className="d-grid gap-2 mt-2">
                    <Button variant="success" onClick={this.startEvent} eventId={event.id}>Start</Button>
                    <Button variant="dark" onClick={this.closeEvent} eventId={event.id}>Close</Button>
                </div>
        } else if (event.eventState == "STARTED") {
            eventAction =
                <div className="d-grid gap-2 mt-2">
                    <Button variant="warning" onClick={this.stopEvent} eventId={event.id}>Roll back</Button>
                    <Button variant="danger" onClick={this.finishEvent} eventId={event.id}>Finish</Button>
                    <Button variant="dark" onClick={this.closeEvent} eventId={event.id}>Close</Button>
                </div>
        } else if (event.eventState == "FINISHED") {
            eventAction =
                <div className="d-grid gap-2 mt-2">
                    <Button variant="dark" onClick={this.closeEvent} eventId={event.id}>Close</Button>
                </div>
        }

        const preview = event.preview !== null ? <Card >
            <Card.Img src={"/resources/events/" + event.id + "/photos/" + event.preview.id} />
        </Card>
            : ""


        var state
        switch (event.eventState) {
            case "WAITING_FOR_START":
                state = <Badge className="bg-warning" style={{ minWidth: "100%" }}>Waiting</Badge>
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
                        <div>{event.description}</div>
                        <div>{categories}</div>
                        <div>Nearby {event.place}</div>
                        <div>
                            Starts at {startInstant.toLocaleString('en-GB', { hour12: false })}
                        </div>
                        <div>
                            Finishes at {endInstant.toLocaleString('en-GB', { hour12: false })}
                        </div>
                        <div>
                            {state}
                        </div>

                        {this.state.event.eventState != "CLOSED" ?
                            <div><hr class="solid" />
                                <h5 className='text-center'>Actions</h5>
                                <hr class="solid" />
                                {eventAction}
                            </div> : ""}
                    </Col>
                    <Col xs="8">
                        <div>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '1' })}
                                        onClick={() => { this.toggle('1'); }}
                                    >
                                        Photos 📷
                                    </NavLink>
                                </NavItem>
                                {event.eventState == "WAITING_FOR_START" || event.eventState == "STARTED" ?
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '2' })}
                                            onClick={() => { this.toggle('2'); }}
                                        >
                                            Edit ✏️
                                        </NavLink>
                                    </NavItem> : ""}
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '3' })}
                                        onClick={() => { this.toggle('3'); }}
                                    >
                                        Comments 💬
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="1">
                                    <div className='my-2'>
                                        <Input variant="primary" type="file" name="image" id={"eventImages" + event.id} multiple />
                                        <Button onClick={this.upload} eventId={event.id} variant="success">Upload</Button>
                                    </div>
                                    <Row xs={1} md={3} className="g-4">
                                        {photosList}
                                    </Row>
                                </TabPane>
                                <TabPane tabId="2">
                                    <ArrangedEventEdit />
                                </TabPane>
                                <TabPane tabId="3">
                                    <div class="messagesScroller" >
                                        {comments}
                                    </div>
                                </TabPane>
                            </TabContent>
                        </div>
                    </Col>
                </Row>
            </Container>
            <ErrorNotifier />
        </div>
    }
}

export default withRouter(ArrangedEventPage);