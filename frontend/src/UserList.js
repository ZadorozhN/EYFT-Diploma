import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, Row } from 'reactstrap';
import { Badge } from 'react-bootstrap'
import { Form, Input, InputGroup, FormGroup, } from 'reactstrap';
import { ToggleButton } from 'react-bootstrap'
import AppNavbar from './AppNavbar.js';
import { Link } from 'react-router-dom';
import ErrorHandler from './Handler/ErrorHandler.js';
import ErrorNotifier from './Handler/ErrorNotifier.js';
import $ from "jquery"
import Waiter from './Waiter.js';

const roleAdmin = "ROLE_ADMIN"

let thisObj

class UserList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			users: [],
			filteredUsers: [],
			isLoading: true,
			filterLogin: null,
			filterEmail: null,
			filterRole: null,
			filterEnabled: null,
			filterIsArrangerRoleRequested: null,
		};
		this.remove = this.remove.bind(this);
		this.toggleSearchBar = this.toggleSearchBar.bind(this)
		this.searchBar = this.searchBar.bind(this)
		this.clearFilter = this.clearFilter.bind(this)
		this.handleChangeValue = this.handleChangeValue.bind(this)
		this.filter = this.filter.bind(this)
		this.handleChangeValueBoolThrice = this.handleChangeValueBoolThrice.bind(this)

		thisObj = this
	}

	toggleSearchBar() {
		this.setState({ searchBarEnabled: !this.state.searchBarEnabled })
	}

	async componentDidMount() {

		$.ajax({
			url: "/user-management/users",
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
			success: function (data) {
				thisObj.setState({ users: data.users, isLoading: false }, () => thisObj.filter());
			},
			error: function (data) {
				ErrorHandler.runError(data)
			}
		})
	}

	async remove(id) {

		$.ajax({
			url: `/user-management/users/${id}`,
			method: "DELETE",
			headers: {
				'Authorization': localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
			success: function (data) {
				let updatedUsers = [...thisObj.state.users].filter(i => i.id !== id);
				thisObj.setState({ users: updatedUsers });
				ErrorHandler.runSuccess(data)
				thisObj.filter()
			},
			error: function (data) {
				ErrorHandler.runError(data)
			}
		})
	}

	acceptArrangerRequest(id) {

		let dto = {
			"accepted": true
		}

		$.ajax({
			url: `/user-management/users/${id}/arrangerRequest`,
			method: "PUT",
			contentType: "application/json",
			headers: {
				'Authorization': localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
			data: JSON.stringify(dto),
			success: function (data) {
				ErrorHandler.runSuccess(data)
				window.location.reload()
			},
			error: function (data) {
				ErrorHandler.runError(data)
			}
		})
	}

	declineArrangerRequest(id) {

		let dto = {
			"accepted": false
		}

		$.ajax({
			url: `/user-management/users/${id}/arrangerRequest`,
			method: "PUT",
			contentType: "application/json",
			headers: {
				'Authorization': localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
			data: JSON.stringify(dto),
			success: function (data) {
				ErrorHandler.runSuccess(data)
				window.location.reload()
			},
			error: function (data) {
				ErrorHandler.runError(data)
			}
		})
	}

	render() {
		const { isLoading } = this.state;

		let users = this.state.filteredUsers;

		if (localStorage.getItem("login") == null || localStorage.getItem("role") !== roleAdmin || localStorage.getItem("id") == null) {
			return <ErrorNotifier />
		}

		if (isLoading) {
			return <Waiter />;
		}

		const userList = users.map(user => {

			let role = ""
			if (user.role === "ADMIN") {
				role = <span class="badge bg-danger" style={{ minWidth: "100%" }}>Admin</span>
			} else if (user.role === "USER") {
				role = <span class="badge bg-success" style={{ minWidth: "100%" }}>User</span>

			} else if (user.role === "ARRANGER") {
				role = <span class="badge bg-warning" style={{ minWidth: "100%" }}>Arranger</span>
			}

			let enabled = user.enabled
				? <span class="badge bg-success" style={{ minWidth: "100%" }}>Enabled</span>
				: <span class="badge bg-danger" style={{ minWidth: "100%" }}>Disabled</span>

			let arrangerRoleRequested = user.arrangerRoleRequested
				? <ButtonGroup style={{ minWidth: "100%" }}>
					<button size="sm" style={{ minWidth: "50%" }} class="badge btn-success" onClick={() => this.acceptArrangerRequest(user.id)}>Accept</button>
					<button size="sm" style={{ minWidth: "50%" }} class="badge btn-danger" onClick={() => this.declineArrangerRequest(user.id)}>Decline</button>
				</ButtonGroup>
				: <span class="badge bg-danger" style={{ minWidth: "100%" }}>Not Requested</span>

			return <tr key={user.id}>
				<td>{user.login}</td>
				<td>{user.email}</td>
				<td>{role}</td>
				<td>{enabled}</td>
				<td>{arrangerRoleRequested}</td>
				<td>
					<ButtonGroup style={{ minWidth: "100%" }}>
						<Button size="sm" style={{ minWidth: "33%" }} color="dark" tag={Link} to={`/guest/${user.login}`}>Review</Button>
						<Button size="sm" style={{ minWidth: "33%" }} color="success" tag={Link} to={"/user-management/users/" + user.id}>Edit</Button>
						<Button size="sm" style={{ minWidth: "33%" }} color="danger" onClick={() => this.remove(user.id)}>Delete</Button>
					</ButtonGroup>
				</td>
			</tr>
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
					<Row className="ps-3">
						{toggler}
					</Row>
					<Row className="p-3">
						{this.state.searchBarEnabled ? this.searchBar() : ""}
					</Row>
					<div class="ps-3">
						<Table>
							<thead>
								<tr>
									<th width="10%">Login</th>
									<th width="40%">Email</th>
									<th width="10%">Role</th>
									<th width="7%">Is Enabled</th>
									<th width="10%">Is Arranger Role Requested</th>
									<th width="20%">Operations</th>
								</tr>
							</thead>
							<tbody>
								{userList}
							</tbody>
						</Table>
					</div>
				</Container>
				<ErrorNotifier />
			</div>
		);
	}

	clearFilter() {
		this.setState({
			filterLogin: null,
			filterEmail: null,
			filterRole: null,
			filterEnabled: null,
			filterIsArrangerRoleRequested: null
		}, () => this.filter())
	}

	handleChangeValue(event) {
		const target = event.target;
		const value = target.value
		const name = target.name

		this.setState({
			[name]: value
		}, () => this.filter());
	}
	

	handleChangeValueBoolThrice(event) {
		const target = event.target;
		const name = target.name
		const value = this.state[name]

		this.setState({
			[name]: !value
		}, () => this.filter());
	}

	filter() {
		let users = this.state.users;

		users = users.filter(user => {
			return (this.state.filterLogin == null || user.login.includes(this.state.filterLogin))
				&& (this.state.filterEmail == null || user.email.includes(this.state.filterEmail))
				&& (this.state.filterRole == null || user.role == this.state.filterRole)
				&& (this.state.filterEnabled == null || user.enabled == this.state.filterEnabled)
				&& (this.state.filterIsArrangerRoleRequested == null || user.arrangerRoleRequested == this.state.filterIsArrangerRoleRequested)
		})

		this.setState({ filteredUsers: users })
	}

	searchBar() {

		return <Form >
			<InputGroup>
				<Input placeholder='Login' style={{ maxWidth: "30%" }} value={this.state.filterLogin} onChange={this.handleChangeValue} name="filterLogin"></Input>
				<Input placeholder='Email' style={{ maxWidth: "70%" }} value={this.state.filterEmail} onChange={this.handleChangeValue} name="filterEmail"></Input>
			</InputGroup>
			<ButtonGroup className='mt-3'>
				<Button onClick={this.handleChangeValue} name="filterRole" value="USER" color={this.state.filterRole == "USER" ? "success" : "outline-success"}>User</Button>
				<Button onClick={this.handleChangeValue} name="filterRole" value="ARRANGER" color={this.state.filterRole == "ARRANGER" ? "warning" : "outline-warning"}>Arranger</Button>
				<Button onClick={this.handleChangeValue} name="filterRole" value="ADMIN" color={this.state.filterRole == "ADMIN" ? "danger" : "outline-danger"}>Admin</Button>
			</ButtonGroup>
			<ButtonGroup className='mt-3 ms-3'>
				<Button onClick={this.handleChangeValueBoolThrice} name="filterEnabled"
					color={this.state.filterEnabled == null ? "outline-success" : this.state.filterEnabled ? "success" : "danger"}>
					{this.state.filterEnabled == null ? "Is Enabled" : this.state.filterEnabled ? "Enabled" : "Disabled"}
				</Button>
				<Button onClick={this.handleChangeValueBoolThrice} name="filterIsArrangerRoleRequested"
					color={this.state.filterIsArrangerRoleRequested == null ? "outline-success" : this.state.filterIsArrangerRoleRequested ? "success" : "danger"}>
					{this.state.filterIsArrangerRoleRequested == null ? "Is Requested" : this.state.filterIsArrangerRoleRequested ? "Requested" : "Not Requested"}
					</Button>
				<Button color="secondary" onClick={this.clearFilter}>Clear Filter</Button>
			</ButtonGroup>
		</Form >
	}

}

export default UserList;