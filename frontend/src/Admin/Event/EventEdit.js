import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../../AppNavbar';
import DatePicker from 'react-datetime';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import $ from 'jquery';
import ErrorHandler from '../../Handler/ErrorHandler';
import ErrorNotifier from '../../Handler/ErrorNotifier';

const roleAdmin = "ROLE_ADMIN"

let thisObj

class EventEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: {}
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeStartInstant = this.handleChangeStartInstant.bind(this);
        this.handleChangeEndInstant = this.handleChangeEndInstant.bind(this);
        this.handleCategoriesChange = this.handleCategoriesChange.bind(this)

        thisObj = this
    }

    async componentDidMount() {
        $.ajax({
			url: `/event-management/events/${thisObj.props.match.params.id}`,
			method: "GET",
			headers:{
				'Authorization': localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
			success: function(data){
                let event = data
                event.startInstant *= 1000
                event.endInstant *= 1000
                thisObj.setState({ event: event });
			},
			error: function(data){
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

    handleCategoriesChange(event) {
        const target = event.target;
        let value = target.value

        let ev = this.state.event;

        if (value !== null && value !== "") {
            ev.categoriesNames = value.split(',')
            this.setState({
                event: ev
            });
        } else {
            this.setState({ event: ev })
        }
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
            url: '/event-management/events/' + ev.id,
            method: 'PUT',
            data: JSON.stringify(ev),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function(data){
                thisObj.props.history.push('/event-management/events');
                ErrorHandler.runSuccess(data)
            },
            error: function(data){
                ev.endInstant *= 1000;
                ev.startInstant *= 1000;
                ErrorHandler.runError(data)
            }
        })
    }

    render() {
        const { event: ev } = this.state;

		if(localStorage.getItem("login") == null || localStorage.getItem("role") !== roleAdmin || localStorage.getItem("id") == null){
            return <ErrorNotifier/>
        }

        const title = <h2>Edit Event {ev.id}</h2>;

        return <div>
            <AppNavbar />
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup className="mt-3">
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" id="name" value={ev.name || ''}
                            onChange={this.handleChange} autoComplete="name" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="description">Description</Label>
                        <Input type="text" name="description" id="description" value={ev.description || ''}
                            onChange={this.handleChange} autoComplete="description" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="place">Place</Label>
                        <Input type="text" name="place" id="place" value={ev.place || ''}
                            onChange={this.handleChange} autoComplete="place" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="eventState">Event state</Label>
                        <div onChange={this.handleChange}>
                            <Input type="radio" name="eventState" value='WAITING_FOR_START' standalone checked={ev.eventState == "WAITING_FOR_START"} />
                            Waiting for start
                        </div>
                        <div onChange={this.handleChange}>
                            <Input type="radio" name="eventState" value='STARTED' standalone checked={ev.eventState == "STARTED"} />
                            Started
                        </div>
                        <div onChange={this.handleChange}>
                            <Input type="radio" name="eventState" value='FINISHED' standalone checked={ev.eventState == "FINISHED"} />
                            Finished
                        </div>
                        <div onChange={this.handleChange}>
                            <Input type="radio" name="eventState" value='CLOSED' standalone checked={ev.eventState == "CLOSED"} />
                            Closed
                        </div>
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="categories">Categories</Label>
                        <Input type="categories" name="categories" id="categories" value={ev.categoriesNames || ''}
                            onChange={this.handleCategoriesChange} autoComplete="categories" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="startInstant">Starts at</Label>
                        <DatePicker
                            value={this.state.event.startInstant}
                            name="startInstant"
                            dateFormat="DD-MM-YYYY"
                            timeFormat="HH:mm"
                            onChange={this.handleChangeStartInstant}>

                        </DatePicker>
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="endInstant">Finishes at</Label>
                        <DatePicker
                            value={this.state.event.endInstant}
                            name="endInstant"
                            dateFormat="DD-MM-YYYY"
                            timeFormat="HH:mm"
                            onChange={this.handleChangeEndInstant}>

                        </DatePicker>
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/event-management/events">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
            <ErrorNotifier/>
        </div>
    }
}

export default withRouter(EventEdit);