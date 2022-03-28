import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, ButtonGroup, Table, Form, Input, InputGroup, FormGroup, Label } from 'reactstrap';
import { Card, CardGroup, Col, Row, Alert, ToggleButton } from 'react-bootstrap'
import Badge from 'react-bootstrap/Badge';
import AppNavbar from '../../AppNavbar';
import $, { post } from 'jquery';
import { ScrollSpy } from 'bootstrap';
import ErrorHandler from '../../Handler/ErrorHandler';
import ErrorNotifier from '../../Handler/ErrorNotifier';
import Constants from '../../Const/Constants'

let thisObj; 

class GuestMeJoinedEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login : localStorage.getItem("login"),
            id : localStorage.getItem("id"),
            role : localStorage.getItem("role"),
            events: [],
            filterField: null,
            filterValue: null,
            filterOperation: null,
            sortOrder: null,
            sortField: null,
            eventState: null,
            categoriesNames: [],
        }

        this.seacrch = this.seacrch.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.setFilterValue = this.setFilterValue.bind(this)
        this.setFilterOperation = this.setFilterOperation.bind(this)
        this.setSortField = this.setSortField.bind(this);
        this.setSortOrder = this.setSortOrder.bind(this);
        this.setEventState = this.setEventState.bind(this);
        this.clearFilter = this.clearFilter.bind(this)
        this.handleCategoriesChange = this.handleCategoriesChange.bind(this);

        thisObj = this
    }

    async componentDidMount() {
        const userUrl = `/guest/${this.props.match.params.login}/joined`;

        $.ajax({
            method: "GET",
            url: userUrl,
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function(data){
                thisObj.setState({ events: data.events, isLoading: false });
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        });
    }

    render() {

        // if(localStorage.getItem("login") == null 
        // || !Constants.isAnyRole((localStorage.getItem("role"))) 
        // || localStorage.getItem("id") == null){
        //     return <ErrorNotifier/>
        // }

        const eventList = this.state.events.map(event => {

            var startInstant = new Date(event.startInstant * 1000);
            startInstant.toLocaleString('en-GB', { hour12: false })

            var endInstant = new Date(event.endInstant * 1000);
            endInstant.toLocaleString('en-GB', { hour12: false })

            var categories = event.categoriesNames.map(category => {
                return <Badge>{category}</Badge>
            })

            let photosLength = event.photos.length
            let photoSrc = ""
            if (photosLength > 0 && event.preview != null) {
                photoSrc = "/resources/events/" + event.id + "/photos/" + event.preview.id;
            }

            let eventState = ""
            if (event.eventState == "WAITING_FOR_START") {
                eventState =
                    <Alert variant="warning" className="mb-0">Waiting for start</Alert>
            } else if (event.eventState == "STARTED") {
                eventState =
                    <Alert variant="success" className="mb-0">Started</Alert>
            } else if (event.eventState == "FINISHED") {
                eventState =
                    <Alert variant="danger" className="mb-0">Finished</Alert>
            } else {
                eventState =
                    <Alert variant="secondary" className="mb-0">Closed</Alert>
            }

            return <Col>
                <Card>
                    {eventState}
                    <Card.Img variant="top" src={photoSrc} className="mt-0"/>
                    <Card.Body>
                        <Card.Title>{event.name}</Card.Title>
                        <Card.Text>{event.description}</Card.Text>
                        <div>
                            Starts at {startInstant.toLocaleString('en-GB', { hour12: false })}
                        </div>
                        <Link to={"/events/" + event.id}>more</Link>
                    </Card.Body>
                </Card>
            </Col>
        });

        return (<div>
            {this.searchBar()}
            <Row xs={1} md={3} className="g-4">
                {eventList}
            </Row>
        </div>
        );
    }

    async seacrch() {
        let queryEventDto = {
            filterField: this.state.filterField,
            filterValue: this.state.filterValue,
            filterOperation: this.state.filterOperation,
            sortField: this.state.sortField,
            sortOrder: this.state.sortOrder,
            eventState: this.state.eventState,
            categoriesNames: this.state.categoriesNames.map(function (el) {
                return el.trim();
              }).filter(function (el) {
                return el !== "" && el !== null;
              })
        }

        const userJoinedEventsUrl = `/guest/${this.props.match.params.login}/joined`;

        $.ajax({
            method: "POST",
            url: userJoinedEventsUrl,
            data: JSON.stringify(queryEventDto),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function(data){
                thisObj.setState({ events: data.events, isLoading: false });
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        });

    }

    setFilterValue(event) {
        this.setState({ filterField: event.target.getAttribute("filterField") });

        setTimeout(this.seacrch, 100);
    }

    setFilterOperation(event) {
        this.setState({ filterOperation: event.target.getAttribute("filterOperation") });

        setTimeout(this.seacrch, 100);
    }

    setSortOrder(event) {
        this.setState({ sortOrder: event.target.getAttribute("sortOrder") });

        setTimeout(this.seacrch, 100);
    }

    setSortField(event) {
        this.setState({ sortField: event.target.getAttribute("sortField") });

        setTimeout(this.seacrch, 100);
    }

    setEventState(event) {
        this.setState({ eventState: event.target.getAttribute("eventState") });

        setTimeout(this.seacrch, 100);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        });

        setTimeout(this.seacrch, 100);
    }

    handleCategoriesChange(event) {
        const target = event.target;
        let value = target.value

        if (value !== null && value !== "") {
            this.setState({
                categoriesNames: value.split(','),
            });
        } else {
            this.setState({ categoriesNames: [] })
        }

        setTimeout(this.seacrch, 100);
    }

    clearFilter() {

        this.setState({ filterField: null });
        this.setState({ filterValue: "" });
        this.setState({ filterOperation: null });
        this.setState({ sortOrder: null });
        this.setState({ sortField: null });
        this.setState({ eventState: null });
        this.setState({ categoriesNames: [] });

        setTimeout(this.seacrch, 100);
    }

    searchBar() {
        return <Form className="mb-3">
            <FormGroup className="ms-3 mb-3" >
                <Label>Filter</Label>
                <ButtonGroup className="ms-3">
                    <ToggleButton
                        filterField="name"
                        variant={this.state.filterField === "name" ? "info" : "outline-info"}
                        onClick={this.setFilterValue}>
                        Name
                    </ToggleButton>
                    <ToggleButton
                        filterField="description"
                        variant={this.state.filterField === "description" ? "info" : "outline-info"}
                        onClick={this.setFilterValue}>
                        Description
                    </ToggleButton>
                </ButtonGroup>

                <ButtonGroup className="ms-3">
                    <ToggleButton
                        filterOperation="LIKE"
                        variant={this.state.filterOperation === "LIKE" ? "info" : "outline-info"}
                        onClick={this.setFilterOperation}>
                        Like
                    </ToggleButton>
                    <ToggleButton
                        filterOperation="EQUAL"
                        variant={this.state.filterOperation === "EQUAL" ? "info" : "outline-info"}
                        onClick={this.setFilterOperation}>
                        Equal
                    </ToggleButton>
                </ButtonGroup>
                </FormGroup>
                <FormGroup className="ms-3 mb-3" >
                    <Label>Sorting</Label>
                    <ButtonGroup className="ms-3">
                        <ToggleButton
                            sortField="name"
                            variant={this.state.sortField === "name" ? "info" : "outline-info"}
                            onClick={this.setSortField}>
                            Name
                        </ToggleButton>
                        <ToggleButton
                            sortField="description"
                            variant={this.state.sortField === "description" ? "info" : "outline-info"}
                            onClick={this.setSortField}>
                            Description
                        </ToggleButton>
                        <ToggleButton
                            sortField="startInstant"
                            variant={this.state.sortField === "startInstant" ? "info" : "outline-info"}
                            onClick={this.setSortField}>
                            Start Instant
                        </ToggleButton>
                        <ToggleButton
                            sortField="endInstant"
                            variant={this.state.sortField === "endInstant" ? "info" : "outline-info"}
                            onClick={this.setSortField}>
                            End Instant
                        </ToggleButton>
                    </ButtonGroup>

                    <ButtonGroup className="ms-3">
                        <ToggleButton
                            sortOrder="ASC"
                            variant={this.state.sortOrder === "ASC" ? "info" : "outline-info"}
                            onClick={this.setSortOrder}>
                            Ascend
                        </ToggleButton>
                        <ToggleButton
                            sortOrder="DESC"
                            variant={this.state.sortOrder === "DESC" ? "info" : "outline-info"}
                            onClick={this.setSortOrder}>
                            Descend
                        </ToggleButton>
                    </ButtonGroup>
                </FormGroup>
                <FormGroup className="ms-3 mb-3" >
                    <Label>State</Label>
                    <ButtonGroup className="ms-3">
                        <ToggleButton 
                            eventState="WAITING_FOR_START"
                            variant={this.state.eventState === "WAITING_FOR_START" ? "info" : "outline-info"}
                            onClick={this.setEventState}>
                            Waiting for start
                        </ToggleButton>
                        <ToggleButton
                            eventState="STARTED"
                            variant={this.state.eventState === "STARTED" ? "info" : "outline-info"}
                            onClick={this.setEventState}>
                            Started
                        </ToggleButton>
                        <ToggleButton
                            eventState="FINISHED"
                            variant={this.state.eventState === "FINISHED" ? "info" : "outline-info"}
                            onClick={this.setEventState}>
                            Finished
                        </ToggleButton>
                        <ToggleButton
                            eventState="CLOSED"
                            variant={this.state.eventState == "CLOSED" ? "info" : "outline-info"}
                            onClick={this.setEventState}>
                            Closed
                        </ToggleButton>
                    </ButtonGroup>

                <Button className=" ms-3"
                    onClick={this.clearFilter}
                    color="outline-secondary">
                    Clear Filter
                </Button>

            </FormGroup>
            <Input onChange={this.handleChange} name="filterValue" value={this.state.filterValue}
                className="mb-3" placeholder="Search"></Input>
            <Input onChange={this.handleCategoriesChange} value={this.state.categoriesNames}
                placeholder="Enter categories separated by comma"></Input>
            <Button color="info" className="mt-3" onClick={this.seacrch}>Search</Button>
        </Form>
    }
}

export default withRouter(GuestMeJoinedEvents);