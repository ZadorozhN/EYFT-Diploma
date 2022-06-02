import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, ButtonGroup, Table, Form, Input, InputGroup, FormGroup, Label } from 'reactstrap';
import { Card, CardGroup, Col, Row, Alert, ToggleButton } from 'react-bootstrap'
import Badge from 'react-bootstrap/Badge';
import $ from 'jquery';
import ErrorHandler from '../Handler/ErrorHandler';
import ErrorNotifier from '../Handler/ErrorNotifier';
import Constants from '../Const/Constants';
import Multiselect from 'multiselect-react-dropdown';
import { dispense } from "Localization/Dispenser";

let thisObj;

class AllEventsBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: localStorage.getItem("login"),
            id: localStorage.getItem("id"),
            role: localStorage.getItem("role"),
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

        thisObj = this
    }

    async componentDidMount() {
        $.ajax({
            method: "GET",
            url: "/events",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                thisObj.setState({ events: data.events });
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        });

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

    toggleSearchBar() {
        this.setState({ searchBarEnabled: !this.state.searchBarEnabled })
    }

    render() {
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
                    <Alert variant="warning" className="mb-0">{dispense("waiting")}</Alert>
            } else if (event.eventState == "STARTED") {
                eventState =
                    <Alert variant="success" className="mb-0">{dispense("started")}</Alert>
            } else if (event.eventState == "FINISHED") {
                eventState =
                    <Alert variant="danger" className="mb-0">{dispense("finished")}</Alert>
            } else {
                eventState =
                    <Alert variant="secondary" className="mb-0">{dispense("closed")}</Alert>
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
                    <Link to={"/events/" + event.id}>{dispense("viewMore")}</Link>
                </Card.Body>
                <Card.Footer className="text-muted">
                    <div>
                    {dispense("startAt")} {startInstant.toLocaleString('en-GB', { hour12: false })}
                    </div>
                    <div>
                    {dispense("finishAt")} {endInstant.toLocaleString('en-GB', { hour12: false })}
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

        return (<div>
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

        $.ajax({
            method: "POST",
            url: "/homepage/events",
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
        // const target = event.target;
        // let value = target.value

        // if (value !== null && value !== "") {
        //     this.setState({
        //         categoriesNames: value.split(','),
        //     });
        // } else {
        //     this.setState({ categoriesNames: [] })
        // }

        // setTimeout(this.seacrch, 100);
    }

    async clearFilter() {

        this.setState({ filterField: null });
        this.setState({ filterValue: "" });
        this.setState({ filterOperation: null });
        this.setState({ sortOrder: null });
        this.setState({ sortField: null });
        this.setState({ eventState: null });
        this.setState({ categoriesNames: [] });
        this.setState({ selectedValues: [] });
		await this.state.multiselectRefTracker.current.resetSelectedValues()

        setTimeout(this.seacrch, 100);
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

    searchBar() {
        return <Form className="mb-3">

            <Button className="mb-3"
                onClick={this.clearFilter}
                color="outline-secondary">
                {dispense("clearFilter")}
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
                        {dispense("waiting")}
                    </ToggleButton>
                    <ToggleButton
                        eventState="STARTED"
                        variant={this.state.eventState === "STARTED" ? "success" : "outline-success"}
                        onClick={this.setEventState}>
                        {dispense("started")}
                    </ToggleButton>
                    <ToggleButton
                        eventState="FINISHED"
                        variant={this.state.eventState === "FINISHED" ? "success" : "outline-success"}
                        onClick={this.setEventState}>
                        {dispense("finished")}
                    </ToggleButton>
                    <ToggleButton
                        eventState="CLOSED"
                        variant={this.state.eventState == "CLOSED" ? "success" : "outline-success"}
                        onClick={this.setEventState}>
                        {dispense("closed")}
                    </ToggleButton>
                </div>
            </FormGroup>

            <FormGroup className="mb-3" >
                <div style={{ display: "inline" }}>
                    <ToggleButton
                        sortField="name"
                        variant={this.state.sortField === "name" ? "success" : "outline-success"}
                        onClick={this.setSortField}>
                        {dispense("name")}
                    </ToggleButton>
                    <ToggleButton
                        sortField="description"
                        variant={this.state.sortField === "description" ? "success" : "outline-success"}
                        onClick={this.setSortField}>
                        {dispense("description")}
                    </ToggleButton>
                    <ToggleButton
                        sortField="startInstant"
                        variant={this.state.sortField === "startInstant" ? "success" : "outline-success"}
                        onClick={this.setSortField}>
                        {dispense("startInstant")}
                    </ToggleButton>
                    <ToggleButton
                        sortField="endInstant"
                        variant={this.state.sortField === "endInstant" ? "success" : "outline-success"}
                        onClick={this.setSortField}>
                        {dispense("endInstant")}
                    </ToggleButton>
                </div>

                <div class="ms-3" style={{ display: "inline" }}>
                    <ToggleButton
                        sortOrder="ASC"
                        variant={this.state.sortOrder === "ASC" ? "success" : "outline-success"}
                        onClick={this.setSortOrder}>
                        {dispense("ascend")}
                    </ToggleButton>
                    <ToggleButton
                        sortOrder="DESC"
                        variant={this.state.sortOrder === "DESC" ? "success" : "outline-success"}
                        onClick={this.setSortOrder}>
                        {dispense("descend")}
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
                            {dispense("name")}
                        </ToggleButton>
                        <ToggleButton
                            filterField="description"
                            variant={this.state.filterField === "description" ? "success" : "outline-success"}
                            onClick={this.setFilterValue}>
                            {dispense("description")}
                        </ToggleButton>
                    </div>

                    <div class="ms-3" style={{ display: "inline" }}>
                        <ToggleButton
                            filterOperation="LIKE"
                            variant={this.state.filterOperation === "LIKE" ? "success" : "outline-success"}
                            onClick={this.setFilterOperation}>
                            {dispense("like")}
                        </ToggleButton>
                        <ToggleButton
                            filterOperation="EQUAL"
                            variant={this.state.filterOperation === "EQUAL" ? "success" : "outline-success"}
                            onClick={this.setFilterOperation}>
                            {dispense("equal")}
                        </ToggleButton>
                    </div>

                    <Input onChange={this.handleChange} name="filterValue" value={this.state.filterValue} className="ms-3"
                        placeholder={dispense("letters")} style={{ maxWidth: "25%", display: "inline" }}></Input>
                </div>
            </FormGroup>
        </Form >
    }
}

export default withRouter(AllEventsBlock);