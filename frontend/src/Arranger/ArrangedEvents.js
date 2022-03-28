import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Card, CardGroup, Col, Row, Alert, ToggleButton, ListGroup } from 'react-bootstrap'
import { Button, Container, ButtonGroup, Table, Form, Input, InputGroup, FormGroup, Label } from 'reactstrap';
import Badge from 'react-bootstrap/Badge';
import AppNavbar from '../AppNavbar';
import $ from 'jquery';
import ErrorHandler from '../Handler/ErrorHandler'
import ErrorNotifier from '../Handler/ErrorNotifier'
import Multiselect from 'multiselect-react-dropdown';

let thisObj;

const roleArranger = "ROLE_ARRANGER"
const roleAdmin = "ROLE_ADMIN"

class ArrangedEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: localStorage.getItem("id"),
            events: [],
            filterField: null,
            filterValue: null,
            filterOperation: null,
            sortOrder: null,
            sortField: null,
            eventState: null,
            categoriesNames: [],
            searchBarEnabled: false,
            selectedValues: [],
            options: [],
            multiselectRefTracker: React.createRef()
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
        this.toggleSearchBar = this.toggleSearchBar.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.onRemove = this.onRemove.bind(this)

        thisObj = this;
    }

    onSelect(selectedList, selectedItem) {
        let categoriesNames = this.state.categoriesNames;
        categoriesNames.push(selectedItem.name);
        this.setState({ categoriesNames: categoriesNames })

        setTimeout(this.seacrch, 100);
    }

    onRemove(selectedList, removedItem) {
        let categoriesNames = this.state.categoriesNames;

        categoriesNames = categoriesNames.filter(item => {
            return item != removedItem.name
        });

        this.setState({ categoriesNames: categoriesNames })
        setTimeout(this.seacrch, 100);
    }

    toggleSearchBar() {
        this.setState({ searchBarEnabled: !this.state.searchBarEnabled })
    }

    async componentDidMount() {

        $.ajax({
            url: "/arranger/arranged",
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                thisObj.setState({ events: data.events });
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })

        $.ajax({
            method: "GET",
            url: "/categories",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                thisObj.setState({ options: data.categories, isLoading: false });
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        });
    }

    render() {

        if (localStorage.getItem("login") == null
            || (localStorage.getItem("role") !== roleArranger && localStorage.getItem("role") !== roleAdmin)
            || localStorage.getItem("id") == null) {
            return <ErrorNotifier />
        }

        const eventList = this.state.events.map(event => {

            var startInstant = new Date(event.startInstant * 1000);
            startInstant.toLocaleString('en-GB', { hour12: false })

            var endInstant = new Date(event.endInstant * 1000);
            endInstant.toLocaleString('en-GB', { hour12: false })

            var categories = event.categoriesNames.map(category => {
                return <Badge className="bg-success me-1" style={{ minWidth: "23%" }}>{category}</Badge>
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
                    <Card.Img variant="top" src={photoSrc} />
                    <Card.Body>
                        <Card.Title>{event.name}</Card.Title>
                        <Card.Text>{event.description}</Card.Text>
                        <div className='mb-3'>
                            {categories}
                        </div>
                        <Link to={"/arranger/arranged/" + event.id}>View more</Link>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                        <div>
                            Starts at {startInstant.toLocaleString('en-GB', { hour12: false })}
                        </div>
                        <div>
                            Finishes at {endInstant.toLocaleString('en-GB', { hour12: false })}
                        </div>
                    </Card.Footer>
                </Card>
            </Col>
        });

        let toggler = <div class="input-group" style={{ display: "flex", justifyContent: "left" }}>
            <div class="input-group-prepend">
                <button class={this.state.searchBarEnabled ? "btn btn-success" : "btn btn-outline-success"} id="basic-addon1" onClick={this.toggleSearchBar}>🔎</button>
            </div>
        </div>

        return (
            <div>
                <AppNavbar />
                <Container fluid>
                    <div class="ms-3">
                        <Row>
                            {toggler}
                        </Row>
                        <Row className="mt-3">
                            {this.state.searchBarEnabled ? this.searchBar() : ""}
                        </Row>
                        <Row xs={1} md={4} className="g-3 mt-3">
                            {eventList}
                        </Row>
                    </div>
                </Container>
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

        const userJoinedEventsUrl = `/arranger/arranged`;

        $.ajax({
            method: "POST",
            url: userJoinedEventsUrl,
            data: JSON.stringify(queryEventDto),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                thisObj.setState({ events: data.events, isLoading: false });
            },
            error: function (data) {
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

    async clearFilter() {

        this.setState({ filterField: null });
        this.setState({ filterValue: "" });
        this.setState({ filterOperation: null });
        this.setState({ sortOrder: null });
        this.setState({ sortField: null });
        this.setState({ eventState: null });
        this.setState({ categoriesNames: [] });
		await this.state.multiselectRefTracker.current.resetSelectedValues()

        setTimeout(this.seacrch, 100);
    }


    searchBar() {
        return <Form className="mb-3">

            <Button className="mb-3"
                onClick={this.clearFilter}
                color="outline-secondary">
                Clear Filter
            </Button>

            <div style={{ display: "flex", justifyContent: "space-between" }} className="mb-3">
                <Multiselect
                    options={this.state.options} // Options to display in the dropdown
                    selectedValues={this.state.selectedValues} // Preselected value to persist in dropdown
                    onSelect={this.onSelect} // Function will trigger on select event
                    onRemove={this.onRemove} // Function will trigger on remove event
                    displayValue="name"  // Property name to display in the dropdown options
                    ref={this.state.multiselectRefTracker}
                />

                {/* <Input onChange={this.handleCategoriesChange} value={this.state.categoriesNames}
                    placeholder="Enter categories separated by comma" style={{ maxWidth: "25%" }}></Input> */}
            </div>

            <FormGroup className="mb-3">
                <div style={{ display: "inline" }}>
                    <ToggleButton
                        eventState="WAITING_FOR_START"
                        variant={this.state.eventState === "WAITING_FOR_START" ? "success" : "outline-success"}
                        onClick={this.setEventState}>
                        Waiting
                    </ToggleButton>
                    <ToggleButton
                        eventState="STARTED"
                        variant={this.state.eventState === "STARTED" ? "success" : "outline-success"}
                        onClick={this.setEventState}>
                        Started
                    </ToggleButton>
                    <ToggleButton
                        eventState="FINISHED"
                        variant={this.state.eventState === "FINISHED" ? "success" : "outline-success"}
                        onClick={this.setEventState}>
                        Finished
                    </ToggleButton>
                    <ToggleButton
                        eventState="CLOSED"
                        variant={this.state.eventState == "CLOSED" ? "success" : "outline-success"}
                        onClick={this.setEventState}>
                        Closed
                    </ToggleButton>
                </div>
            </FormGroup>

            <FormGroup className="mb-3" >
                <div style={{ display: "inline" }}>
                    <ToggleButton
                        sortField="name"
                        variant={this.state.sortField === "name" ? "success" : "outline-success"}
                        onClick={this.setSortField}>
                        Name
                    </ToggleButton>
                    <ToggleButton
                        sortField="description"
                        variant={this.state.sortField === "description" ? "success" : "outline-success"}
                        onClick={this.setSortField}>
                        Description
                    </ToggleButton>
                    <ToggleButton
                        sortField="startInstant"
                        variant={this.state.sortField === "startInstant" ? "success" : "outline-success"}
                        onClick={this.setSortField}>
                        Start Instant
                    </ToggleButton>
                    <ToggleButton
                        sortField="endInstant"
                        variant={this.state.sortField === "endInstant" ? "success" : "outline-success"}
                        onClick={this.setSortField}>
                        End Instant
                    </ToggleButton>
                </div>

                <div class="ms-3" style={{ display: "inline" }}>
                    <ToggleButton
                        sortOrder="ASC"
                        variant={this.state.sortOrder === "ASC" ? "success" : "outline-success"}
                        onClick={this.setSortOrder}>
                        Ascend
                    </ToggleButton>
                    <ToggleButton
                        sortOrder="DESC"
                        variant={this.state.sortOrder === "DESC" ? "success" : "outline-success"}
                        onClick={this.setSortOrder}>
                        Descend
                    </ToggleButton>
                </div>
            </FormGroup>

            <FormGroup >

                <div style={{ display: "flex", justifyContent: "left" }} className="mb-3">
                    <div style={{ display: "inline" }}>
                        <ToggleButton
                            filterField="name"
                            variant={this.state.filterField === "name" ? "success" : "outline-success"}
                            onClick={this.setFilterValue}>
                            Name
                        </ToggleButton>
                        <ToggleButton
                            filterField="description"
                            variant={this.state.filterField === "description" ? "success" : "outline-success"}
                            onClick={this.setFilterValue}>
                            Description
                        </ToggleButton>
                    </div>

                    <div class="ms-3" style={{ display: "inline" }}>
                        <ToggleButton
                            filterOperation="LIKE"
                            variant={this.state.filterOperation === "LIKE" ? "success" : "outline-success"}
                            onClick={this.setFilterOperation}>
                            Like
                        </ToggleButton>
                        <ToggleButton
                            filterOperation="EQUAL"
                            variant={this.state.filterOperation === "EQUAL" ? "success" : "outline-success"}
                            onClick={this.setFilterOperation}>
                            Equal
                        </ToggleButton>
                    </div>

                    <Input onChange={this.handleChange} name="filterValue" value={this.state.filterValue} className="ms-3"
                        placeholder="Letters" style={{ maxWidth: "25%", display: "inline" }}></Input>
                </div>
            </FormGroup>
        </Form >
    }
}

export default withRouter(ArrangedEvents);
