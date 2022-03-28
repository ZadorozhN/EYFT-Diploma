import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label,  } from 'reactstrap';
import AppNavbar from './AppNavbar';
import DatePicker from 'react-datetime';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import $ from 'jquery';
import ErrorNotifier from './Handler/ErrorNotifier';
import Constants from './Const/Constants';

const address = "/events/arrange"

class CreateEventForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            event: {
                name: "",
                description: "",
                place: "",
                categoriesNames: [""],
                startInstant: "",
                endInstant: "",
            }
        }

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const target = e.target;
        const name = target.name;
        let value = target.value;
        let event = { ...this.state.event };

        if(name == "categoriesNames"){
            value = value.split(',')
        }

        event[name] = value;
        this.setState({ event: event });
	}

    handleSubmit(event) {
		$.ajax({
			url: address,
			contentType: "application/json; charset=UTF-8",
			method: "post",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
              },
			data: JSON.stringify(this.state.event),
		})
		event.preventDefault();
	}

    render(){
        const { event: event } = this.state;

        if(localStorage.getItem("login") == null 
        || !Constants.isArrangerOrHigher((localStorage.getItem("role"))) 
        || localStorage.getItem("id") == null){
            return <ErrorNotifier/>
        }

        return <div>
        <AppNavbar />
        <Container>
            <Form onSubmit={this.handleSubmit}>
                <FormGroup className="mt-3">
                    <Label for="name">Name</Label>
                    <Input type="text" name="name" id="name" value={event.name || ''}
                        onChange={this.handleChange} autoComplete="event" />
                </FormGroup>
                <FormGroup className="mt-3">
                    <Label for="description">Description</Label>
                    <Input type="text" name="description" id="description" value={event.description || ''}
                        onChange={this.handleChange} autoComplete="description" />
                </FormGroup>
                <FormGroup className="mt-3">
                    <Label for="place">Place</Label>
                    <Input type="text" name="place" id="place" value={event.place || ''}
                        onChange={this.handleChange} autoComplete="place" />
                </FormGroup>
                <FormGroup className="mt-3">
                    <Label for="categoriesNames">Categories (separated by comma ',' )</Label>
                    <Input type="text" name="categoriesNames" id="categoriesNames" value={event.categoriesNames || ''}
                        onChange={this.handleChange} autoComplete="categoriesNames" />
                </FormGroup>
                <FormGroup className="mt-3">
                    <Label for="startInstant">Starts at</Label>
                    <DatePicker
                            name = "startInstant"
                            dateFormat="DD-MM-YYYY"
                            timeFormat="HH:mm"
                            onChange={val => this.state.event.startInstant = val}>

                            </DatePicker>
                </FormGroup>
                <FormGroup className="mt-3">
                    <Label for="endInstant">Finishes at</Label>
                    <DatePicker
                            name = "endInstant"
                            dateFormat="DD-MM-YYYY"
                            timeFormat="HH:mm"
                            onChange={val => this.state.event.endInstant = val}>

                            </DatePicker>
                </FormGroup>
                
                <FormGroup className="mt-3">
                    <Button color="primary" type="submit">Save</Button>{' '}
                    <Button color="secondary" tag={Link} to="/">Cancel</Button>
                </FormGroup>
            </Form>
        </Container>
    </div>
    }
}

export default CreateEventForm