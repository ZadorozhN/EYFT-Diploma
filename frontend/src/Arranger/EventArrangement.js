import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, Row, Col } from 'reactstrap';
import { Badge } from "react-bootstrap"
import AppNavbar from '../AppNavbar';
import DatePicker from 'react-datetime';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import $ from 'jquery';
import ErrorHandler from '../Handler/ErrorHandler';
import ErrorNotifier from '../Handler/ErrorNotifier';
import classnames from 'classnames';
import ArrangementProps from './PropsForArrangement/ArrangementProps';
import Multiselect from 'multiselect-react-dropdown';
import {dispense} from "Localization/Dispenser.js"

const address = "/arranger/arrangement"

const roleArranger = "ROLE_ARRANGER"
const roleAdmin = "ROLE_ADMIN"

let thisObj

class EventArrangement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event: {
                name: "",
                description: "",
                place: "",
                categoriesNames: [],
                startInstant: "",
                endInstant: "",
            },
            categories: [],
            props: [],
            activeTab: '1'
        }

        thisObj = this

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onRemove = this.onRemove.bind(this);
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

    handleChange(e) {
        const target = e.target;
        const name = target.name;
        let value = target.value;
        let event = { ...this.state.event };

        if (name == "categoriesNames") {
            value = value.split(',')
        }

        event[name] = value;
        this.setState({ event: event });
    }

    handleSubmit(event) {
        event.preventDefault();

        let arrangedEvent = {
            name: this.state.event.name,
            description: this.state.event.description,
            place: this.state.event.place,
            startInstant: this.state.event.startInstant,
            endInstant: this.state.event.endInstant,
            price: this.state.event.price,
            categoriesNames: this.state.event.categoriesNames.map(function (el) {
                return el.trim();
            }).filter(function (el) {
                return el !== "" && el !== null;
            })
        }

        $.ajax({
            url: address,
            contentType: "application/json; charset=UTF-8",
            method: "post",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            data: JSON.stringify(arrangedEvent),
            success: function (data) {
                thisObj.props.history.push('/arranger')
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }

    addCategory(name) {
        let event = this.state.event
        event.categoriesNames.push(name)

        this.setState({ event: event })
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

    render() {

        if (localStorage.getItem("login") == null
            || (localStorage.getItem("role") !== roleArranger && localStorage.getItem("role") !== roleAdmin)
            || localStorage.getItem("id") == null) {
            return <ErrorNotifier />
        }

        const { event: event } = this.state;

        const admittedCategories = this.state.categories.map(category => {
            return <Badge className="bg bg-info m-1" onClick={() => this.addCategory(category.name)}>{category.name}</Badge>
        });

        console.log(admittedCategories)

        return <div>
            <AppNavbar />
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
                    <FormGroup className="mt-3">
                        <Label for="price">{dispense("priceInCents")}</Label>
                        <Input type="number" name="price" id="price" value={event.price || ''}
                            onChange={this.handleChange} autoComplete="price" />
                    </FormGroup>
                    <Row>
                        <Col md="8">
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
                                <InputGroup style={{"display":"flex", justifyContent:"right"}}>
                                        <Label for="startInstant">{dispense("startAt")}</Label>
                                        <DatePicker className='ms-5'
                                            name="startInstant"
                                            dateFormat="DD-MM-YYYY"
                                            timeFormat="HH:mm"
                                            onChange={val => this.state.event.startInstant = val}>
                                        </DatePicker>
                                </InputGroup>
                            </FormGroup>
                            <FormGroup className="mt-3">
                                <InputGroup style={{"display":"flex", justifyContent:"right"}}>
                                    <Label for="endInstant">{dispense("finishAt")}</Label>
                                    <DatePicker className='ms-5'
                                        name="endInstant"
                                        dateFormat="DD-MM-YYYY"
                                        timeFormat="HH:mm"
                                        onChange={val => this.state.event.endInstant = val}>

                                    </DatePicker>
                                </InputGroup>
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup className="mt-3" style={{minWidth:"100%", display:"flex", justifyContent:"space-between"}}>
                        <Button color="success" type="submit" style={{minWidth:"48%"}}>{dispense("create")}</Button>{' '}
                        <Button color="secondary" tag={Link} to="/arranger" style={{minWidth:"48%"}}>{dispense("cancel")}</Button>
                    </FormGroup>
                </Form>

            </Container>
            <ErrorNotifier />
        </div>
    }
}

export default EventArrangement