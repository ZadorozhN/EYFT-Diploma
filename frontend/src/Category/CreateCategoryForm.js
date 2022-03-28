import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label,  } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import DatePicker from 'react-datetime';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import $ from 'jquery';
import ErrorNotifier from '../Handler/ErrorNotifier';
import ErrorHandler from '../Handler/ErrorHandler';
import style from "../style.css"

const address = "/category-management/categories"

const roleAdmin = "ROLE_ADMIN"

let thisObj

class CreateCategoryForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            category: {
                name: "",
                description: "",
            }
        }

        this.toggleCreateMode = props.toggle;
        this.addCategory = props.addCategory;
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);


        thisObj = this
    }

    handleChange(e) {
        const target = e.target;
        const name = target.name;
        let value = target.value;
        let category = { ...this.state.category };

        category[name] = value;
        this.setState({ category: category });
	}

    handleSubmit(event) {
		$.ajax({
			url: address,
			contentType: "application/json; charset=UTF-8",
			method: "post",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
			data: JSON.stringify(this.state.category),
            success: function(data){
                thisObj.addCategory(data)
                thisObj.setState({
                    category: {
                        name: "",
                        description: "",
                    }
                })
                thisObj.toggleCreateMode()
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
		})
		event.preventDefault();
	}

    render(){
        const { category: category } = this.state;

        if(localStorage.getItem("login") == null || localStorage.getItem("role") !== roleAdmin || localStorage.getItem("id") == null){
            return <ErrorNotifier/>
        }

        return <div>
        <Container className="createCategoryFormContainer">
            <Form onSubmit={this.handleSubmit}>
                <FormGroup className="mt-3">
                    <Label for="name">Name</Label>
                    <Input type="text" name="name" id="name" value={category.name || ''}
                        onChange={this.handleChange} autoComplete="event" />
                </FormGroup>
                <FormGroup className="mt-3">
                    <Label for="description">Description</Label>
                    <Input type="text" name="description" id="description" value={category.description || ''}
                        onChange={this.handleChange} autoComplete="description" />
                </FormGroup>
                <FormGroup className="mt-4">
                    <div class="saveCancelCategoryButtons">
                        <Button color="success" className='saveCategoryButton' type="submit">Save</Button>{' '}
                        <Button color="secondary" className='cancelCategoryButton' onClick={this.toggleCreateMode}>Cancel</Button>
                    </div>
                </FormGroup>
            </Form>
        </Container>
    </div>
    }
}

export default CreateCategoryForm