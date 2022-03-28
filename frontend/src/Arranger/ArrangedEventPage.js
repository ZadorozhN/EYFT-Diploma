import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, ButtonGroup, Table, Input, TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import { Button,Card, CardGroup, Col, Row, Image} from 'react-bootstrap'
import classnames from 'classnames';

import { Badge } from 'react-bootstrap';
import AppNavbar from '../AppNavbar';
import ErrorNotifier from '../Handler/ErrorNotifier';
import $ from "jquery"
import ErrorHandler from '../Handler/ErrorHandler';
import ArrangedEventEdit from './ArrangedEventEdit';

const roleArranger = "ROLE_ARRANGER"
const roleAdmin = "ROLE_ADMIN"

let thisObj

class ArrangedEventPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : localStorage.getItem("id"),
            event: null,
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
            success: function(data){
                thisObj.setState({ event: data, isLoading: false });
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        })
    }

	upload(event) {
		let target = event.target
        
		const fileInput = document.querySelector("#eventImages" + target.getAttribute("eventId"));
		const formData = new FormData();

        for(let photo of fileInput.files){
            formData.append('photos', photo);
        }
	
		fetch("/resources/events/" + target.getAttribute("eventId"), {
			method: "POST",
			body: formData,
			headers: {
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			}
		}).then(function(event){
            window.location.reload()
        })
	}

    startEvent(event){

        $.ajax({
            url: "/events/" + event.target.getAttribute("eventId") + "/start",
			method: "PUT",
            headers: {
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
            success: function(data){
                window.location.reload()
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        })
    }

    stopEvent(event){

        $.ajax({
            url: "/events/" + event.target.getAttribute("eventId") + "/stop",
			method: "PUT",
            headers: {
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
            success: function(data){
                window.location.reload()
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        })

    }

    finishEvent(event){


        $.ajax({
            url: "/events/" + event.target.getAttribute("eventId") + "/finish",
			method: "PUT",
            headers: {
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
            success: function(data){
                window.location.reload()
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        })
    }

    closeEvent(event){
        $.ajax({
            url: "/events/" + event.target.getAttribute("eventId") + "/close",
			method: "PUT",
			headers: {
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
            success: function(data){
                window.location.reload()
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        })
    }

    setPreview(event){
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
            success: function(data){
                window.location.reload()
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        })
    }

    removePhoto(event){
        $.ajax({
            url: `/arranger/arranged/${event.target.getAttribute("eventId")}/photos/${event.target.getAttribute("photoId")}`,
            method: "DELETE",
            headers: {
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function(){
                window.location.reload ();
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        })
    }

    render() {

        if(localStorage.getItem("login") == null 
        || (localStorage.getItem("role") !== roleArranger && localStorage.getItem("role") !== roleAdmin) 
        || localStorage.getItem("id") == null){
            return <ErrorNotifier/>
        }
        
        const { event, isLoading } = this.state;

		if (isLoading) {
			return <p>Loading...</p>;
		}
        
        var startInstant = new Date(event.startInstant * 1000);
        startInstant.toLocaleString('en-GB', { hour12:false } )
    
        var endInstant = new Date(event.endInstant * 1000);
        endInstant.toLocaleString('en-GB', { hour12:false } )
        
        var categories = event.categoriesNames.map(category => {
            return <Badge className="bg bg-info m-1">{category}</Badge>
        })

        let photosLength = event.photos.length
        let photoSrc = ""
        if(photosLength > 0){
            photoSrc = "/resources/events/" + event.id + "/photos/" + event.photos[0].id;
        }

		const photosList = event.photos.map(photo => {
            return <Card > 
                        <Card.Img src={"/resources/events/" + event.id + "/photos/" + photo.id}/>
                        <Button onClick={this.setPreview} eventId={event.id} photoId={photo.id} className="mt-1" variant="success">Set as preview</Button>
                        <Button onClick={this.removePhoto} eventId={event.id} photoId={photo.id} className="mt-1" variant="danger">Remove</Button>
                    </Card>
        })

        let eventAction = ""
        if(event.eventState == "WAITING_FOR_START"){
            eventAction = 
            <div className="d-grid gap-2 mt-2">
                <Button variant="success" onClick={this.startEvent} eventId={event.id}>Start</Button>
                <Button variant="secondary" onClick={this.closeEvent} eventId={event.id}>Close</Button>
            </div>
        } else if(event.eventState == "STARTED"){
            eventAction = 
            <div className="d-grid gap-2 mt-2">
                <Button variant="warning" onClick={this.stopEvent} eventId={event.id}>Roll back</Button>
                <Button variant="danger" onClick={this.finishEvent} eventId={event.id}>Finish</Button>
                <Button variant="secondary" onClick={this.closeEvent} eventId={event.id}>Close</Button>
            </div>
        } else if(event.eventState == "FINISHED"){
            eventAction = 
            <div className="d-grid gap-2 mt-2">
                <Button variant="secondary" onClick={this.closeEvent} eventId={event.id}>Close</Button>
            </div>
        }

        const preview = event.preview !== null ? <Card > 
                                                    <Card.Img src={"/resources/events/" + event.id + "/photos/" + event.preview.id}/>
                                                </Card> 
                                                : ""

        

        return  <div>
                    <AppNavbar/>
                    <Container fluid>
                    <Row>
                        <Col xs="4">
                            {preview}
                            <div>Title: {event.name}</div>
                            <div>Description: {event.description}</div>
                            <div>Categories: {categories}</div>
                            <div>Place: {event.place}</div>
                            <div>
                                Starts at {startInstant.toLocaleString('en-GB', { hour12:false })}
                            </div>
                            <div>
                                Finishes at {endInstant.toLocaleString('en-GB', { hour12:false })}
                            </div>
                            <div>
                                <Input variant="primary" type="file" name="image" id={"eventImages" + event.id} multiple/>
                                <Button onClick={this.upload} eventId={event.id} variant="success">Upload</Button>
                            </div>
                            <div>
                                Current state: {event.eventState}
                            </div>
                            {eventAction}
                        </Col>
                        
                        <Col xs ="8">
                        <div>
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '1' })}
                                            onClick={() => { this.toggle('1'); }}
                                        >
                                            Photos
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '2' })}
                                            onClick={() => { this.toggle('2'); }}
                                        >
                                            Edit
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={this.state.activeTab}>
                                    <TabPane tabId="1">
                                        <Row xs={1} md={3} className="g-4">
                                            {photosList}
                                        </Row>
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <ArrangedEventEdit/>
                                    </TabPane>
                                </TabContent>
                            </div>
                        </Col>
                    </Row>
                    </Container>
                    <ErrorNotifier/>
                </div>
    }
}

export default withRouter(ArrangedEventPage);