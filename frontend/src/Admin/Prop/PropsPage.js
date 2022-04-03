import React, { Component } from 'react';
import ErrorNotifier from '../../Handler/ErrorNotifier.js';
import ErrorHandler from '../../Handler/ErrorHandler.js';
import AppNavbar from '../../AppNavbar.js';
import { Container, Alert } from 'reactstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { ButtonGroup, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import $ from "jquery"
import MoneyFormatter from '../../Formatter/MoneyFormatter.js';
import Waiter from '../../Waiter.js';
import CreateProp from "./CreateProp"

const roleAdmin = "ROLE_ADMIN"

let thisObj

class PropsPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			props: [],
			selectedProps: [],
			isLoading: true,
			filterValue: "",
			createMode: false,
			propEdit: {
				editModeId: null,
				editModeName: null,
				editModeDescription: null,
				editModeCost: null,
				editModeCostType: null,
				editModePropType: null,
			}
		};

		thisObj = this;

		this.filterProps = this.filterProps.bind(this);
		this.toggleCreateMode = this.toggleCreateMode.bind(this);
		this.addProp = this.addProp.bind(this)
		this.editMode = this.editMode.bind(this)
		this.saveProp = this.saveProp.bind(this)
		this.editModeChangeValue = this.editModeChangeValue.bind(this)
		this.cancelEditing = this.cancelEditing.bind(this)
	}

	filterProps(e) {
		let value = e.target.value;
		let selectedProps = [...this.state.props].filter((prop) => {
			return prop.name.includes(value);
		})

		this.setState({ selectedProps: selectedProps, filterValue: value });
	}

	async remove(id) {
		$.ajax({
			url: `/prop-management/props/${id}`,
			method: "DELETE",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
			success: function (data) {
				let updatedProps = [...thisObj.state.props].filter(i => i.id !== id);
				thisObj.setState({ props: updatedProps });
				let selectedUpdatedProps = [...thisObj.state.selectedProps].filter(i => i.id !== id);
				thisObj.setState({ selectedProps: selectedUpdatedProps });
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

	addProp(prop) {
		let props = this.state.props
		props.push(prop)
		this.setState({ props: props }, () => {
			let selectedProps = [...thisObj.state.props].filter((prop) => {
				console.log("ALKERT " + prop.name.includes(thisObj.state.filterValue) + " + " + prop + " + " + thisObj.state.filterValue)
				return prop.name.includes(thisObj.state.filterValue);
			})

			thisObj.setState({ selectedProps: selectedProps });
		})
	}

	editMode(prop) {
		this.setState({
			propEdit: {
				editModeId: prop.id,
				editModeName: prop.name,
				editModeDescription: prop.description,
				editModeCost: prop.cost,
				editModeCostType: prop.costType,
				editModePropType: prop.propType,
			}
		});
	}

	cancelEditing(){
		thisObj.setState({
			propEdit: {
				editModeId: null
			}
		})
	}

	saveProp(prop) {
		let dto = {
			id: this.state.propEdit.editModeId,
			name: this.state.propEdit.editModeName,
			description: this.state.propEdit.editModeDescription,
			cost: this.state.propEdit.editModeCost,
			costType: this.state.propEdit.editModeCostType,
			propType: this.state.propEdit.editModePropType,
		}

		$.ajax({
			url: `/prop-management/props/${this.state.propEdit.editModeId}`,
			contentType: "application/json; charset=UTF-8",
			method: "put",
			data: JSON.stringify(dto),
			headers: {
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
			success: function (data) {
				ErrorHandler.runStringMessage("Prop was changed")
				thisObj.setState({
					propEdit: {
						editModeId: null
					}
				})

				prop.name = dto.name
				prop.description = dto.description
				prop.cost = dto.cost
				prop.costType = dto.costType
				prop.propType = dto.propType

				let updatedProps = [...thisObj.state.props];
				thisObj.setState({ props: updatedProps });
				let selectedProps = [...thisObj.state.props].filter((prop) => {
					return prop.name.includes(thisObj.state.filterValue);
				})

				thisObj.setState({ selectedProps: selectedProps });
			},
			error: function (data) {
				ErrorHandler.runError(data)
			}
		})
	}

	editModeChangeValue(e) {
		let target = e.target
		let propEdit = this.state.propEdit;

		if (target.name == "editModeCostType") {
			target.value = this.state.propEdit.editModeCostType == "PIECE" ? "DAY" : "PIECE";
		} else if (target.name == "editModePropType") {
			target.value = this.state.propEdit.editModePropType == "PLACE" ? "THING" : "PLACE"
		}

		propEdit[target.name] = target.value;

		this.setState({ propEdit: propEdit })
	}

	render() {
		const { isLoading } = this.state;
		let props = this.state.selectedProps

		if (localStorage.getItem("login") == null || localStorage.getItem("role") !== roleAdmin || localStorage.getItem("id") == null) {
			return <ErrorNotifier />
		}

		if (isLoading) {
			return <Waiter />;
		}

		const propsList = props.map(prop => {
			let types = <div>
				<span style={{ minWidth: "50%" }} class={"badge " + (prop.costType == "PIECE" ? "bg-success" : "bg-warning text-dark")}>{prop.costType}</span>
				<span style={{ minWidth: "50%" }} class={"badge " + (prop.propType == "PLACE" ? "bg-success" : "bg-warning text-dark")}>{prop.propType}</span>
			</div>

			let typesEdit = <div>
				<button onClick={this.editModeChangeValue} name="editModeCostType" style={{ minWidth: "50%" }} class={"badge " + (this.state.propEdit.editModeCostType == "PIECE" ? "btn-success" : "btn-warning text-dark")}>{this.state.propEdit.editModeCostType}</button>
				<button onClick={this.editModeChangeValue} name="editModePropType" style={{ minWidth: "50%" }} class={"badge " + (this.state.propEdit.editModePropType == "PLACE" ? "btn-success" : "btn-warning text-dark")}>{this.state.propEdit.editModePropType}</button>
			</div>

			return <tr key={prop.id}>
				<td style={{ whiteSpace: 'nowrap' }}>{this.state.propEdit.editModeId == prop.id ? <input value={this.state.propEdit.editModeName} name="editModeName" onChange={this.editModeChangeValue}></input> : prop.name}</td>
				<td>{this.state.propEdit.editModeId == prop.id ? <input value={this.state.propEdit.editModeDescription} name="editModeDescription" style={{ minWidth: "100%" }} onChange={this.editModeChangeValue}></input> : prop.description}</td>
				<td>{this.state.propEdit.editModeId == prop.id ? <input value={this.state.propEdit.editModeCost} name="editModeCost" onChange={this.editModeChangeValue} type="number"></input> : MoneyFormatter.fromatDollars(prop.cost)}</td>
				<td>{this.state.propEdit.editModeId == prop.id ? typesEdit : types}
				</td>
				<td>
					<ButtonGroup style={{ minWidth: "100%" }}>

						{this.state.propEdit.editModeId == prop.id
							? <ButtonGroup style={{ minWidth: "50%" }}><Button size="sm" color="warning" style={{ minWidth: "50%" }} onClick={() => this.saveProp(prop)} >Save</Button>
								<Button size="sm" color="success" style={{ minWidth: "50%" }} onClick={() => this.cancelEditing()} >Cancel</Button>
								</ButtonGroup>
							: <Button size="sm" color="success" style={{ minWidth: "50%" }} onClick={() => this.editMode(prop)}>Quick Edit</Button>
						}
						<Button size="sm" color="danger" style={{ minWidth: "50%" }} onClick={() => this.remove(prop.id)}>Delete</Button>
					</ButtonGroup>
				</td>
			</tr>
		});

		return (
			<div>
				<AppNavbar />
				<Container fluid>
					{this.state.createMode ? <CreateProp addProp={this.addProp} toggle={this.toggleCreateMode} /> :
						<div class="propsList mt-3 p-3">
							<Button color='success' onClick={this.toggleCreateMode} >Create Prop</Button>
							<div class="input-group propNameInput">
								<div class="input-group-prepend">
									<span class="input-group-text" id="basic-addon1">🔎</span>
								</div>
								<input type="text" class="form-control" value={this.state.filterValue} onChange={this.filterProps} placeholder="Prop Name" aria-label="Prop Name" aria-describedby="basic-addon1" />
							</div>
						</div>
					}

					<div class="mt-3 p-3">
						<Table>
							<thead>
								<tr>
									<th width="15%">Name</th>
									<th width="40%">Description</th>
									<th width="10%">Cost</th>
									<th width="10%">Type</th>
									<th width="25%">Operations</th>
								</tr>
							</thead>
							<tbody>
								{propsList}
							</tbody>
						</Table>
					</div>
				</Container>
				<ErrorNotifier />
			</div>
		);
	}

	async componentDidMount() {
		$.ajax({
			url: "/prop-management/props",
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			},
			success: function (data) {
				thisObj.setState({ props: data.props, selectedProps: data.props, isLoading: false });
			},
			error: function (data) {
				ErrorHandler.runError(data)
			}
		})
	}
}

export default PropsPage