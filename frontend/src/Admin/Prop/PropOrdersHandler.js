import React, { Component } from 'react';
import ErrorNotifier from '../../Handler/ErrorNotifier.js';
import ErrorHandler from '../../Handler/ErrorHandler.js';
import AppNavbar from '../../AppNavbar.js';
import { Container, Alert } from 'reactstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col, Input } from 'reactstrap';
import { ButtonGroup, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import $ from "jquery"
import MoneyFormatter from '../../Formatter/MoneyFormatter.js';
import Waiter from '../../Waiter.js';
import CreateProp from "./CreateProp"
import InstantFormatter from '../../Formatter/InstantFormatter.js';

const roleAdmin = "ROLE_ADMIN"

let thisObj

class PropOrdersHandler extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            propOrders: [],
            filteredPropOrders: [],
            isLoading: true,
            selectedPropOrders: new Map(),
            mode: "ALL",
            answerMode: false,
        };

        thisObj = this;
        this.select = this.select.bind(this)
        this.bulkAccept = this.bulkAccept.bind(this)
        this.bulkDelete = this.bulkDelete.bind(this)
        this.bulkDeliver = this.bulkDeliver.bind(this)
        this.updateOrders = this.updateOrders.bind(this)
        this.changeMode = this.changeMode.bind(this)
        this.filterPropOrders = this.filterPropOrders.bind(this)
        this.toggleAnswerMode = this.toggleAnswerMode.bind(this)
        this.bulkRollback = this.bulkRollback.bind(this)
        // this.changePropOrderAnswer = this.changePropOrderAnswer.bind(this)
    }

    toggleAnswerMode() {
        this.setState({ answerMode: !this.state.answerMode })
    }

    async remove(id) {
        $.ajax({
            url: `/prop-management/orders/${id}`,
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                // let updatedPropOrders = [...thisObj.state.propOrders].filter(i => i.id !== id);
                // thisObj.setState({ propOrders: updatedPropOrders }, () => {thisObj.filterPropOrders()});
                thisObj.updateOrders()
                ErrorHandler.runSuccess(data)
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }

    select(propOrder) {
        let selectedPropOrders = this.state.selectedPropOrders;

        if (!selectedPropOrders.get(propOrder.id)) {
            selectedPropOrders.set(propOrder.id, propOrder)
        }
        else {
            selectedPropOrders.delete(propOrder.id)
        }

        this.setState({ selectedPropOrders: selectedPropOrders })
    }

    bulkAccept() {
        let map = this.state.selectedPropOrders;


        map.forEach((value, key) => {
            let id = key;
            let dto = {
                message: $(`#answer${key}`).val(),
                status: "ACCEPTED"
            }

            $.ajax({
                url: `/prop-management/orders/${id}`,
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
                },
                data: JSON.stringify(dto),
                success: function (data) {
                    // let updatedPropOrders = [...thisObj.state.propOrders].filter(i => i.id !== id);
                    // thisObj.setState({ propOrders: updatedPropOrders });
                    thisObj.updateOrders();
                    ErrorHandler.runSuccess(data)
                },
                error: function (data) {
                    ErrorHandler.runError(data)
                }
            })
        })

        map.clear()

        this.setState({ selectedPropOrders: map }, () => this.updateOrders())
    }

    bulkDeliver() {
        let map = this.state.selectedPropOrders;


        map.forEach((value, key) => {
            let id = key;
            let dto = {
                message: $(`#answer${key}`).val(),
                status: "DELIVERED"
            }

            $.ajax({
                url: `/prop-management/orders/${id}`,
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
                },
                data: JSON.stringify(dto),
                success: function (data) {
                    // let updatedPropOrders = [...thisObj.state.propOrders].filter(i => i.id !== id);
                    // thisObj.setState({ propOrders: updatedPropOrders });
                    thisObj.updateOrders();
                    ErrorHandler.runSuccess(data)
                },
                error: function (data) {
                    ErrorHandler.runError(data)
                }
            })
        })

        map.clear()

        this.setState({ selectedPropOrders: map }, () => this.updateOrders())
    }

    bulkDelete() {
        let map = this.state.selectedPropOrders;

        map.forEach((value, key) => {
            this.remove(key)
        })

        map.clear()

        this.setState({ selectedPropOrders: map })
    }


    bulkRollback() {
        let map = this.state.selectedPropOrders;


        map.forEach((value, key) => {
            let id = key;
            let dto = {
                message: $(`#answer${key}`).val(),
                status: "ORDERED"
            }

            $.ajax({
                url: `/prop-management/orders/${id}`,
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
                },
                data: JSON.stringify(dto),
                success: function (data) {
                    // let updatedPropOrders = [...thisObj.state.propOrders].filter(i => i.id !== id);
                    // thisObj.setState({ propOrders: updatedPropOrders });
                    thisObj.updateOrders();
                    ErrorHandler.runSuccess(data)
                },
                error: function (data) {
                    ErrorHandler.runError(data)
                }
            })
        })

        map.clear()

        this.setState({ selectedPropOrders: map }, () => this.updateOrders())
    }

    changeMode(event) {
        let target = event.target;
        this.setState({ mode: target.value }, () => { thisObj.filterPropOrders() })
    }

    render() {
        const { isLoading } = this.state;
        let propOrders = this.state.filteredPropOrders

        if (localStorage.getItem("login") == null || localStorage.getItem("role") !== roleAdmin || localStorage.getItem("id") == null) {
            return <ErrorNotifier />
        }

        if (isLoading) {
            return <Waiter />;
        }

        const propOrdersList = propOrders.map(propOrder => {

            if (!this.state.answerMode) {

                let status;
                if (propOrder.status == "ORDERED")
                    status = <span style={{minWidth:"100%"}} class="badge bg-warning">Ordered</span>
                else if (propOrder.status == "ACCEPTED")
                        status = <span style={{minWidth:"100%"}} class="badge bg-success">Accepted</span>
                else if (propOrder.status == "DELIVERED")
                            status = <span style={{minWidth:"100%"}} class="badge bg-secondary">Delivered</span>

                return <tr key={propOrder.id} class={this.state.selectedPropOrders.get(propOrder.id) ? "bg-success" : ""} >
                    <td><Input
                        type="checkbox"
                        onChange={() => this.select(propOrder)}
                        checked={this.state.selectedPropOrders.get(propOrder.id)}
                    /></td>
                    <td onClick={() => this.select(propOrder)}>{propOrder.prop.name}</td>
                    <td onClick={() => this.select(propOrder)}>{propOrder.pieces ? propOrder.pieces : InstantFormatter.formatInstantMs(propOrder.orderedDate)}</td>
                    <td onClick={() => this.select(propOrder)}>{MoneyFormatter.fromatDollars(propOrder.cost)}</td>
                    <td onClick={() => this.select(propOrder)}>{InstantFormatter.formatInstant(propOrder.creationTime)}</td>
                    <td onClick={() => this.select(propOrder)}>{propOrder.userLogin}</td>
                    <td onClick={() => this.select(propOrder)}>{status}</td>
                </tr>
            } else {
                return <tr key={propOrder.id} class={this.state.selectedPropOrders.get(propOrder.id) ? "bg-success" : ""} >
                    <td><Input
                        type="checkbox"
                        onChange={() => this.select(propOrder)}
                        checked={this.state.selectedPropOrders.get(propOrder.id)}
                    /></td>
                    <td onClick={() => this.select(propOrder)}>{propOrder.prop.name}</td>
                    <td onClick={() => this.select(propOrder)}>{propOrder.comment}</td>
                    <td><Input id={"answer" + propOrder.id} defaultValue={propOrder.answer}></Input></td>
                </tr>
            }
        });

        return (
            <div>
                <AppNavbar />
                <Container fluid>
                    <div class="mt-3 p-3">
                        <Button disabled={this.state.selectedPropOrders.size == 0} color='danger' onClick={this.bulkDelete}>Bulk Delete</Button>
                        <Button disabled={this.state.selectedPropOrders.size == 0} className="ms-3" color='warning' onClick={this.bulkRollback}>Bulk Rollback</Button>
                        <Button disabled={this.state.selectedPropOrders.size == 0} className="ms-3" color='success' onClick={this.bulkAccept}>Bulk Accept</Button>
                        <Button disabled={this.state.selectedPropOrders.size == 0} className="ms-3" color='success' onClick={this.bulkDeliver}>Bulk Deliver</Button>
                        <Button className="ms-3" color={this.state.answerMode ? "success" : "outline-success"} onClick={this.toggleAnswerMode}>Answer Mode</Button>
                        <ButtonGroup className='ms-3'>
                            <Button onClick={this.changeMode} color={this.state.mode == "ALL" ? "success" : "outline-success"} value="ALL" >All</Button>
                            <Button onClick={this.changeMode} color={this.state.mode == "ORDERED" ? "success" : "outline-success"} value="ORDERED">Ordered</Button>
                            <Button onClick={this.changeMode} color={this.state.mode == "ACCEPTED" ? "success" : "outline-success"} value="ACCEPTED">Accepted</Button>
                            <Button onClick={this.changeMode} color={this.state.mode == "DELIVERED" ? "success" : "outline-success"} value="DELIVERED">Delivered</Button>
                        </ButtonGroup>
                    </div>
                    <div class="mt-3 p-3">
                        <Table>
                            <thead>

                                {!this.state.answerMode ? <tr>
                                    <th width="3%"></th>
                                    <th width="15%">Name</th>
                                    <th width="10%">Pieces/Date</th>
                                    <th width="10%">Cost</th>
                                    <th width="15%">Creation Time</th>
                                    <th width="15%">Requester</th>
                                    <th width="15%">Status</th>
                                </tr> : <tr>
                                    <th width="3%"></th>
                                    <th width="15%">Name</th>
                                    <th width="41%">Comment</th>
                                    <th width="41%">Answer</th>
                                </tr>}
                            </thead>
                            <tbody>
                                {propOrdersList}
                            </tbody>
                        </Table>
                    </div>
                </Container>
                <ErrorNotifier />
            </div>
        );
    }

    async componentDidMount() {
        this.updateOrders();
    }

    updateOrders() {
        $.ajax({
            url: "/prop-management/orders",
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                thisObj.setState({ propOrders: data.propOrders, isLoading: false }, () => { thisObj.filterPropOrders() });
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }

    filterPropOrders() {
        let filtered = this.state.propOrders;

        if (this.state.mode != "ALL") {
            filtered = filtered.filter(item => {
                return item.status == this.state.mode
            })
        }

        this.setState({ filteredPropOrders: filtered })
    }
}

export default PropOrdersHandler