import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, Form, Input, InputGroup, FormGroup, } from 'reactstrap';
import { ToggleButton, Row } from 'react-bootstrap'
import AppNavbar from '../../AppNavbar.js';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import ErrorHandler from '../../Handler/ErrorHandler.js';
import ErrorNotifier from '../../Handler/ErrorNotifier'
import $ from "jquery"
import Waiter from '../../Waiter.js';
import Multiselect from 'multiselect-react-dropdown';
import MoneyFormatter from '../../Formatter/MoneyFormatter.js';

const roleAdmin = "ROLE_ADMIN"

let thisObj

class EventList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			events: [],
			isLoading: true,
			selectedFilterCategories: [],
			selectedOptionCategories: [],
			filterCategories: [],
			ownerLogin: "",
			multiselectRefTracker: React.createRef()
		};
		this.remove = this.remove.bind(this);
		this.toggleSearchBar = this.toggleSearchBar.bind(this)
		this.setFilterValue = this.setFilterValue.bind(this)
		this.setFilterOperation = this.setFilterOperation.bind(this)
		this.setSortField = this.setSortField.bind(this);
		this.setSortOrder = this.setSortOrder.bind(this);
		this.setEventState = this.setEventState.bind(this);
		this.clearFilter = this.clearFilter.bind(this)
		this.onSelect = this.onSelect.bind(this);
		this.onRemove = this.onRemove.bind(this);
		this.seacrch = this.seacrch.bind(this);
		this.handleChange = this.handleChange.bind(this)

		thisObj = this
	}

	toggleSearchBar() {
		this.setState({ searchBarEnabled: !this.state.searchBarEnabled })
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

	async clearFilter() {

		this.setState({ filterField: null });
		this.setState({ filterValue: "" });
		this.setState({ filterOperation: null });
		this.setState({ sortOrder: null });
		this.setState({ sortField: null });
		this.setState({ eventState: null });
		this.setState({ selectedFilterCategories: [] });
		this.setState({ selectedOptionCategories: [] });
		this.setState({ ownerLogin: ""})
		await this.state.multiselectRefTracker.current.resetSelectedValues()

		setTimeout(this.seacrch, 100);
	}


	onSelect(selectedList, selectedItem) {
		let categoriesNames = this.state.selectedFilterCategories;
		categoriesNames.push(selectedItem.name);
		this.setState({ selectedFilterCategories: categoriesNames })

		setTimeout(this.seacrch, 100);
	}

	onRemove(selectedList, removedItem) {
		let categoriesNames = this.state.selectedFilterCategories;

		categoriesNames = categoriesNames.filter(item => {
			return item != removedItem.name
		});

		this.setState({ selectedFilterCategories: categoriesNames })
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

	async seacrch() {
		let queryEventDto = {
			filterField: this.state.filterField,
			filterValue: this.state.filterValue,
			filterOperation: this.state.filterOperation,
			sortField: this.state.sortField,
			sortOrder: this.state.sortOrder,
			eventState: this.state.eventState,
			categoriesNames: this.state.selectedFilterCategories.map(function (el) {
				return el.trim();
			}).filter(function (el) {
				return el !== "" && el !== null;
			})
		}

		let ownerLogin = this.state.ownerLogin;

		$.ajax({
			method: "POST",
			url: "/event-management/events/filter",
			data: JSON.stringify(queryEventDto),
			headers: {
				"Content-Type": "application/json",
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
			success: function (data) {
				let events = data.events.filter(item => {
					return item.userLogin.includes(ownerLogin)
				})
				thisObj.setState({ events: events, isLoading: false });
			},
			error: function (data) {
				ErrorHandler.runError(data)
			}
		});
	}

	async componentDidMount() {
		$.ajax({
			url: "/event-management/events",
			method: "GET",
			headers: {
				'Authorization': localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
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
				thisObj.setState({ filterCategories: data.categories, isLoading: false });
			},
			error: function (data) {
				ErrorHandler.runError(data)
			}
		});
	}

	async remove(id) {
		$.ajax({
			url: `/event-management/events/${id}`,
			method: "DELETE",
			headers: {
				'Authorization': localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
			success: function (data) {
				let updatedEvents = [...thisObj.state.events].filter(i => i.id !== id);
				thisObj.setState({ events: updatedEvents });
				ErrorHandler.runSuccess(data)
			},
			error: function (data) {
				ErrorHandler.runError(data)
			}
		})
	}

	searchBar() {

		let categoriesSelector = <Multiselect
			options={this.state.filterCategories} // Options to display in the dropdown
			selectedValues={this.state.selectedOptionCategories} // Preselected value to persist in dropdown
			onSelect={this.onSelect} // Function will trigger on select event
			onRemove={this.onRemove} // Function will trigger on remove event
			displayValue="name"  // Property name to display in the dropdown options
			ref={this.state.multiselectRefTracker}
		/>
		return <Form className="mb-3">

			<Button className="mb-3"
				onClick={this.clearFilter}
				color="outline-secondary">
				Clear Filter
			</Button>

			<div style={{ display: "flex", justifyContent: "space-between" }} className="mb-3">
				{categoriesSelector}

				{/* <Input onChange={this.handleCategoriesChange} value={this.state.categoriesNames}
                    placeholder="Enter categories separated by comma" style={{ maxWidth: "25%" }}></Input> */}
			</div>

			<div style={{ display: "flex", justifyContent: "space-between" }} className="mb-3">

				<Input onChange={this.handleChange} name="ownerLogin" value={this.state.ownerLogin}
					placeholder="Owner Login" style={{ maxWidth: "20%", display: "inline" }}></Input>
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

	render() {
		const { events, isLoading } = this.state;

		if (localStorage.getItem("login") == null || localStorage.getItem("role") !== roleAdmin || localStorage.getItem("id") == null) {
			return <ErrorNotifier />
		}

		if (isLoading) {
			return <Waiter />;
		}

		const eventList = events.map(event => {

			var startInstant = new Date(event.startInstant * 1000);
			startInstant.toLocaleString('en-GB', { hour12: false })

			var endInstant = new Date(event.endInstant * 1000);
			endInstant.toLocaleString('en-GB', { hour12: false })

			var categories = event.categoriesNames.map(category => {
				return <Badge className="bg-success ms-1" style={{ minWidth: "23%" }}>{category}</Badge>
			})

			var state
			switch (event.eventState) {
				case "WAITING_FOR_START":
					state = <Badge className="bg-warning text-dark" style={{ minWidth: "100%" }}>Waiting</Badge>
					break;
				case "STARTED":
					state = <Badge className="bg-success" style={{ minWidth: "100%" }}>Started</Badge>
					break;
				case "FINISHED":
					state = <Badge className="bg-danger" style={{ minWidth: "100%" }}>Finished</Badge>
					break;
				case "CLOSED":
					state = <Badge className="bg-dark" style={{ minWidth: "100%" }}>Closed</Badge>
					break;
			}

			return <tr key={event.id}>
				<td style={{ whiteSpace: 'nowrap' }}><Link to={`/events/${event.id}`}>{event.name}</Link></td>
				<td>{event.userLogin}</td>
				<td>{MoneyFormatter.fromatDollars(event.price)}</td>
				<td>{startInstant.toLocaleString('en-GB', { hour12: false })}</td>
				<td>{endInstant.toLocaleString('en-GB', { hour12: false })}</td>
				<td>{categories}</td>
				<td>{state}</td>
				<td>
					<ButtonGroup style={{ minWidth: "100%" }}>
						<Button style={{ minWidth: "50%" }} size="sm" color="success" tag={Link} to={"/event-management/events/" + event.id} >Edit</Button>
						<Button style={{ minWidth: "50%" }} size="sm" color="danger" onClick={() => this.remove(event.id)}>Delete</Button>
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
					<Row className="ps-3 p-3">
						{this.state.searchBarEnabled ? this.searchBar() : ""}
					</Row>
					<div class="ps-3">
						<Table>
							<thead>
								<tr>
									<th width="10%">Name</th>
									<th width="7%">Owner login</th>
									<th width="5%">Price</th>
									<th width="10%">Start Instant</th>
									<th width="10%">End Instant</th>
									<th width="25%">Category</th>
									<th width="10%">Event State</th>
									<th width="20%">Operations</th>
								</tr>
							</thead>
							<tbody>
								{eventList}
							</tbody>
						</Table>
					</div>
				</Container>
				<ErrorNotifier />
			</div>
		);
	}
}

export default EventList;