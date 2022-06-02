import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, InputGroup, Row, Col } from 'reactstrap';
import { Badge } from 'react-bootstrap'
import AppNavbar from '../AppNavbar';
import DatePicker from 'react-datetime';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import $ from 'jquery';
import ErrorHandler from '../Handler/ErrorHandler';
import ErrorNotifier from '../Handler/ErrorNotifier';
import Constants from '../Const/Constants';
import Multiselect from 'multiselect-react-dropdown';
import {dispense} from "Localization/Dispenser.js"

const roleAdmin = "ROLE_ADMIN"

let thisObj

class ArrangedEventPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: {},
            categories: [],
            selectedValue: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeStartInstant = this.handleChangeStartInstant.bind(this);
        this.handleChangeEndInstant = this.handleChangeEndInstant.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onRemove = this.onRemove.bind(this);

        thisObj = this
    }

    onSelect(selectedList, selectedItem) {
        let event = this.state.event;
        event.categoriesNames.push(selectedItem.name);
        this.setState({ event: event })
    }

    onRemove(selectedList, removedItem) {
        let event = this.state.event;

        event.categoriesNames = event.categoriesNames.filter(item => {
            return item != removedItem.name
        });

        this.setState({ event: event })
    }


    async componentDidMount() {
        $.ajax({
            url: `/arranger/arranged/${thisObj.props.match.params.id}`,
            method: "GET",
            headers: {
                'Authorization': localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                let event = data
                event.startInstant *= 1000
                event.endInstant *= 1000
                let categories = event.categoriesNames.map(name => { return { name: name } });
                thisObj.setState({ event: event, selectedValue: categories });
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
                thisObj.setState({ categories: data.categories, isLoading: false });
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })

    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        let value = target.value;

        let ev = { ...this.state.event };
        ev[name] = value;

        this.setState({ event: ev });
    }

    handleChangeStartInstant(event) {
        let ev = { ...this.state.event };
        ev.startInstant = event._d
        console.log(ev.startInstant)
        this.setState({ event: ev });
    }

    handleChangeEndInstant(event) {
        let ev = { ...this.state.event };
        ev.endInstant = event._d
        this.setState({ event: ev });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { event: ev } = this.state;

        if (typeof ev.startInstant === "number") {
            ev.startInstant /= 1000;
        }

        if (typeof ev.endInstant === "number") {
            ev.endInstant /= 1000;
        }

        ev.categoriesNames = ev.categoriesNames.map(function (el) {
            return el.trim();
        }).filter(function (el) {
            return el !== "" && el !== null;
        })

        $.ajax({
            url: '/arranger/arranged/' + ev.id,
            method: 'PUT',
            data: JSON.stringify(ev),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                ErrorHandler.runSuccess(data)
                window.location.reload()
            },
            error: function (data) {
                ev.endInstant *= 1000;
                ev.startInstant *= 1000;
                ErrorHandler.runError(data)
            }
        })
    }

    render() {
        const { event: event } = this.state;

        if (localStorage.getItem("login") == null
            || !Constants.isArrangerOrHigher(localStorage.getItem("role"))
            || localStorage.getItem("id") == null) {
            return <ErrorNotifier />
        }

        return <div>
            <Container>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup className="mt-3">
                        <Label for="name">{dispense("title")}</Label>
                        <Input type="text" name="name" id="name" value={event.name || ''}
                            onChange={this.handleChange} autoComplete="event" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="description">{dispense("description")}</Label>
                        <Input type="text" name="description" id="description" value={event.description || ''}
                            onChange={this.handleChange} autoComplete="description" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="place">{dispense("place")}</Label>
                        <Input type="text" name="place" id="place" value={event.place || ''}
                            onChange={this.handleChange} autoComplete="place" />
                    </FormGroup>
                    <Row>
                        <Col md="6">
                            <FormGroup className="mt-3">
                                <div>
                                    <Label>{dispense("categories")}</Label>
                                    <Multiselect
                                        options={this.state.categories} // Options to display in the dropdown
                                        selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                        onSelect={this.onSelect} // Function will trigger on select event
                                        onRemove={this.onRemove} // Function will trigger on remove event
                                        displayValue="name"  // Property name to display in the dropdown options
                                    />
                                </div>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup className="mt-3">
                                <InputGroup style={{ "display": "flex", justifyContent: "right" }}>
                                    <Label for="startInstant">{dispense("startAt")}</Label>
                                    <DatePicker className='ms-5'
                                        value={this.state.event.startInstant}
                                        name="startInstant"
                                        dateFormat="DD-MM-YYYY"
                                        timeFormat="HH:mm"
                                        onChange={this.handleChangeStartInstant}>
                                    </DatePicker>
                                </InputGroup>
                            </FormGroup>
                            <FormGroup className="mt-3">
                                <InputGroup style={{ "display": "flex", justifyContent: "right" }}>
                                    <Label for="endInstant">{dispense("finishAt")}</Label>
                                    <DatePicker className='ms-5'
                                        value={this.state.event.endInstant}
                                        name="endInstant"
                                        dateFormat="DD-MM-YYYY"
                                        timeFormat="HH:mm"
                                        onChange={this.handleChangeEndInstant}>

                                    </DatePicker>
                                </InputGroup>
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup className="mt-3" style={{minWidth:"100%", display:"flex", justifyContent:"space-between"}}>
                        <Button color="success" type="submit" style={{minWidth:"48%"}}>{dispense("save")}</Button>{' '}
                        <Button color="secondary" tag={Link} to="/arranger/arranged" style={{minWidth:"48%"}}>{dispense("cancel")}</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(ArrangedEventPage);