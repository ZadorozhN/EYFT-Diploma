import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from '../AppNavbar.js';
import { Link } from 'react-router-dom';
import ErrorNotifier from '../Handler/ErrorNotifier.js';
import ErrorHandler from '../Handler/ErrorHandler.js';
import $ from "jquery"
import style from "../style.css"
import CreateCategoryForm from './CreateCategoryForm.js';
import Waiter from '../Waiter.js';

const roleAdmin = "ROLE_ADMIN"

let thisObj

class CategoryList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			selectedCategories: [],
			isLoading: true,
			editModeId: null,
			editModeName: null,
			editModeDescription: null,
			createMode: false,
			filterValue: ""
		};

		this.remove = this.remove.bind(this);
		this.filterCategories = this.filterCategories.bind(this)
		this.editMode = this.editMode.bind(this)
		this.editModeChangeValue = this.editModeChangeValue.bind(this)
		this.saveCategory = this.saveCategory.bind(this)
		this.toggleCreateMode = this.toggleCreateMode.bind(this)
		this.addCategory = this.addCategory.bind(this)
		this.cancelEditing = this.cancelEditing.bind(this)

		thisObj = this
	}

	async componentDidMount() {
		$.ajax({
			url: "/category-management/categories",
			method: "GET",
			data: JSON.stringify(this.state.category),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
			success: function (data) {
				thisObj.setState({ categories: data.categories, selectedCategories: data.categories, isLoading: false });
			},
			error: function (data) {
				ErrorHandler.runError(data)
			}
		})
	}

	async remove(id) {
		$.ajax({
			url: `/category-management/categories/${id}`,
			method: "DELETE",
			data: JSON.stringify(this.state.category),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
			success: function (data) {
				let updatedCategories = [...thisObj.state.categories].filter(i => i.id !== id);
				thisObj.setState({ categories: updatedCategories });
				let updatedSelectedCategories = [...thisObj.state.selectedCategories].filter(i => i.id !== id);
				thisObj.setState({ selectedCategories: updatedSelectedCategories });
				ErrorHandler.runSuccess(data)
			},
			error: function (data) {
				ErrorHandler.runError(data)
			}
		})
	}

	toggleCreateMode() {
		this.setState({ createMode: !this.state.createMode })
	}

	cancelEditing() {
		thisObj.setState({
			editModeId: null
		})
	}

	addCategory(category) {
		let categories = this.state.categories
		categories.push(category)
		this.setState({ categories: categories }, () => {
			let updatedCategories = [...thisObj.state.categories];
			thisObj.setState({ categories: updatedCategories });

			let selectedCategories = [...thisObj.state.categories].filter((category) => {
				return category.name.includes(thisObj.state.filterValue);
			})

			thisObj.setState({ selectedCategories: selectedCategories });
		})
	}

	filterCategories(e) {
		let value = e.target.value;
		let selectedCategories = [...this.state.categories].filter((category) => {
			return category.name.includes(value);
		})

		this.setState({ selectedCategories: selectedCategories, filterValue: value });
	}

	editMode(category) {
		this.setState({
			editModeId: category.id,
			editModeName: category.name,
			editModeDescription: category.description
		});
	}

	editModeChangeValue(e) {
		let target = e.target;
		let name = target.name;
		let value = target.value;

		let state = this.state
		state[name] = value;
		this.setState(state);
	}

	saveCategory(category) {
		let dto = {
			id: this.state.editModeId,
			name: this.state.editModeName,
			description: this.state.editModeDescription,
		}

		$.ajax({
			url: `/category-management/categories/${this.props.match.params.id}`,
			contentType: "application/json; charset=UTF-8",
			method: "put",
			data: JSON.stringify(dto),
			headers: {
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
			success: function (data) {
				// thisObj.props.history.push('/category-management/categories');	
				ErrorHandler.runSuccess(data)
				thisObj.setState({ editModeId: null })
				category.name = thisObj.state.editModeName
				category.description = thisObj.state.editModeDescription

				let updatedCategories = [...thisObj.state.categories];
				thisObj.setState({ categories: updatedCategories });
				let selectedCategories = [...thisObj.state.categories].filter((category) => {
					return category.name.includes(thisObj.state.filterValue);
				})

				thisObj.setState({ selectedCategories: selectedCategories });
			},
			error: function (data) {
				ErrorHandler.runError(data)
			}
		})
	}

	render() {
		const { isLoading } = this.state;
		const categories = this.state.selectedCategories;

		if (localStorage.getItem("login") == null || localStorage.getItem("role") !== roleAdmin || localStorage.getItem("id") == null) {
			return <ErrorNotifier />
		}

		if (isLoading) {
			return <Waiter />;
		}

		const categoryList = categories.map(category => {
			return <tr key={category.id}>
				<td style={{ whiteSpace: 'nowrap' }}>{this.state.editModeId == category.id ? <input value={this.state.editModeName} name="editModeName" onChange={this.editModeChangeValue}></input> : category.name}</td>
				<td>{this.state.editModeId == category.id ? <input value={this.state.editModeDescription} name="editModeDescription" style={{ minWidth: "100%" }} onChange={this.editModeChangeValue}></input> : category.description}</td>
				<td>
					<ButtonGroup style={{ minWidth: "100%" }}>
						{this.state.editModeId == category.id
							? <ButtonGroup style={{ minWidth: "50%" }}>
								<Button size="sm" color="warning" style={{ minWidth: "50%" }} onClick={() => this.saveCategory(category)} >Save</Button>
								<Button size="sm" color="success" style={{ minWidth: "50%" }} onClick={() => this.cancelEditing()} >Cancel</Button>
							</ButtonGroup>
							: <Button size="sm" color="success" style={{ minWidth: "50%" }} onClick={() => this.editMode(category)} >Quick Edit</Button>}
						<Button size="sm" color="danger" style={{ minWidth: "50%" }} onClick={() => this.remove(category.id)}>Delete</Button>
					</ButtonGroup>
				</td>
			</tr>
		});

		return (
			<div>
				<AppNavbar />
				<Container fluid >
					{this.state.createMode ? <CreateCategoryForm addCategory={this.addCategory} toggle={this.toggleCreateMode} /> :
						<div class="categoriesList mt-3 p-3">
							<Button color='success' onClick={this.toggleCreateMode} >Create Category</Button>
							<div class="input-group categoryNameInput">
								<div class="input-group-prepend">
									<span class="input-group-text" id="basic-addon1">🔎</span>
								</div>
								<input type="text" class="form-control" value={this.state.filterValue} onChange={this.filterCategories} placeholder="Category Name" aria-label="Category Name" aria-describedby="basic-addon1" />
							</div>
						</div>
					}
					<div class="mt-3 p-3">
						<Table >
							<thead>
								<tr>
									<th width="15%">Name</th>
									<th width="65%">Description</th>
									<th width="20%">Operations</th>
								</tr>
							</thead>
							<tbody>
								{categoryList}
							</tbody>
						</Table>
					</div>
				</Container>
				<ErrorNotifier />
			</div>
		);
	}
}

export default CategoryList;