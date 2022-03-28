// import React, { Component } from 'react';
// import { Link, withRouter } from 'react-router-dom';
// import { Button, Container, Form, FormGroup, Input, Label,  } from 'reactstrap';
// import AppNavbar from '../AppNavbar';
// import DatePicker from 'react-datetime';
// import moment from 'moment';
// import 'react-datetime/css/react-datetime.css';
// import $ from 'jquery';
// import ErrorHandler from '../Handler/ErrorHandler';
// import ErrorNotifier from '../Handler/ErrorNotifier';

// const address = "/category-management/categories"

// const roleAdmin = "ROLE_ADMIN"

// let thisObj

// class CreateCategoryForm extends React.Component {
//     constructor(props){
//         super(props);
//         this.state = {
//             category: {
//                 id: "",
//                 name: "",
//                 description: "",
//             }
//         }

// 		this.handleChange = this.handleChange.bind(this);
// 		this.handleSubmit = this.handleSubmit.bind(this);

//         thisObj = this
//     }

//     async componentDidMount() {
//         $.ajax({
//             url: `/category-management/categories/${this.props.match.params.id}`,
// 			method: "GET",
//             headers: {
// 				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
// 			},
//             success: function(data){
//                 thisObj.setState({ category: data });
//             },
//             error: function(data){
//                 ErrorHandler.runError(data)
//             }
//         })
//     }

//     handleChange(e) {
//         const target = e.target;
//         const name = target.name;
//         let value = target.value;
//         let category = { ...this.state.category };

//         category[name] = value;
//         this.setState({ category: category });
// 	}

//     handleSubmit(event) {
// 		$.ajax({
// 			url: `/category-management/categories/${this.props.match.params.id}`,
// 			contentType: "application/json; charset=UTF-8",
// 			method: "put",
// 			data: JSON.stringify(this.state.category),
//             headers: {
//                 "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
//             },
//             success: function(data){
//                 thisObj.props.history.push('/category-management/categories');
//                 ErrorHandler.runSuccess(data)
//             },
//             error: function(data){
//                 ErrorHandler.runError(data)
//             }
// 		})

// 		event.preventDefault();
// 	}

//     render(){
//         const { category: category } = this.state;

//         if(localStorage.getItem("login") == null || localStorage.getItem("role") !== roleAdmin || localStorage.getItem("id") == null){
//             return <ErrorNotifier/>
//         }

//         return <div>
//         <AppNavbar />
//         <Container>
//             <Form onSubmit={this.handleSubmit}>
//                 <FormGroup className="mt-3">
//                     <Label for="name">Name</Label>
//                     <Input type="text" name="name" id="name" value={category.name || ''}
//                         onChange={this.handleChange} autoComplete="event" />
//                 </FormGroup>
//                 <FormGroup className="mt-3">
//                     <Label for="description">Description</Label>
//                     <Input type="text" name="description" id="description" value={category.description || ''}
//                         onChange={this.handleChange} autoComplete="description" />
//                 </FormGroup>
//                 <FormGroup className="mt-3">
//                     <Button color="success" type="submit">Save</Button>{' '}
//                     <Button color="secondary" tag={Link} to="/category-management/categories">Cancel</Button>
//                 </FormGroup>
//             </Form>
//         </Container>
//         <ErrorNotifier/>
//     </div>
//     }
// }

// export default CreateCategoryForm