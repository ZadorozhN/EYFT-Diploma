import axios from "axios"
import { map } from "jquery"
import React from "react"
import { Table, Button, Input, Container, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import AppNavbar from '../../AppNavbar'
import ErrorNotifier from '../../Handler/ErrorNotifier'
import { useHistory } from 'react-router-dom';
import MoneyFormatter from '../../Formatter/MoneyFormatter'
import ErrorHandler from "../../Handler/ErrorHandler"
import classnames from 'classnames';
import $ from "jquery"
import Waiter from "../../Waiter"
import { toHaveStyle } from "@testing-library/jest-dom/dist/matchers"

Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(currentDate)
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

class ArrangementProps extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            props: [],
            isLoading: true,
            cart: [],
            daysMap: new Map(),
            costTypeMap: new Map(),
            piecesMap: new Map(),
            activeTab: "1"
        }

        this.addToCart = this.addToCart.bind(this)
        this.removeFromCart = this.removeFromCart.bind(this)
        this.addToDays = this.addToDays.bind(this)
        this.removeFromDays = this.removeFromDays.bind(this)
        this.purchase = this.purchase.bind(this)
        this.handlePiecesChange = this.handlePiecesChange.bind(this)
        this.getAllProps = this.getAllProps.bind(this)
        this.toggle = this.toggle.bind(this);
        this.clearCart = this.clearCart.bind(this);
    }

    clearCart() {
        this.setState({
            cart: []
        })
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    addToCart(event) {
        let propId = event.target.value;
        let updatedCart = this.state.cart;
        updatedCart.push(propId);
        this.setState({ cart: updatedCart })
    }

    removeFromCart(event) {
        let propId = event.target.value;
        let updatedCart = this.state.cart;
        let foundIndex = updatedCart.find((prop) => {
            return prop.id == propId;
        })
        updatedCart.splice(foundIndex, 1)
        this.setState({ cart: updatedCart })
    }

    render() {
        if (this.state.isLoading) {
            return <Waiter />
        }

        let props = this.state.props.map((prop) => {
            let removeButton = <Button style={{ minWidth: "100%" }}
                color="danger" value={prop.id} onClick={this.removeFromCart}>
                Remove from cart
            </Button>

            let addButton = <Button style={{ minWidth: "100%" }}
                color="success" value={prop.id} onClick={this.addToCart}>
                Add to cart
            </Button>

            let isAddedToCart = this.state.cart.includes(prop.id.toString())

            return <tr key={prop.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{prop.name}</td>
                <td>{prop.description}</td>
                <td>{MoneyFormatter.fromatDollars(prop.cost)}</td>
                <td><span style={{ minWidth: "100%" }} class={"badge " + (prop.costType == "PIECE" ? "bg-success" : "bg-warning")}>{prop.costType}</span></td>
                <td><span style={{ minWidth: "100%" }} class={"badge " + (prop.propType == "PLACE" ? "bg-success" : "bg-warning")}>{prop.propType}</span></td>
                <td>{isAddedToCart ? removeButton : addButton}</td>
            </tr>
        })

        let totalCost = 0;

        let cartProps = this.state.cart
            .map((propId) => {
                return this.state.props.find(prop => prop.id == propId);
            })
            .map((prop) => {
                let now = new Date();

                let daysArray = getDates(new Date(), new Date().addDays(31))

                let orderedDays = prop.propOrders.map((order) => new Date(order.orderedDate).toLocaleDateString())

                let days = daysArray.map((day) => {
                    let orderedButton = <Button propId={prop.id} color="danger" style={{ margin: 1 }}>{day.toLocaleDateString()}</Button>
                    let removeFromDaysButton = <Button propId={prop.id} color="success" style={{ margin: 1 }} onClick={this.removeFromDays} value={day.toLocaleDateString()}>{day.toLocaleDateString()}</Button>;
                    let addToDaysButton = <Button propId={prop.id} color="warning" style={{ margin: 1 }} onClick={this.addToDays} value={day.toLocaleDateString()}>{day.toLocaleDateString()}</Button>

                    if (orderedDays.includes(day.toLocaleDateString())) {
                        return orderedButton
                    }

                    if (!this.state.daysMap.get(prop.id.toString())) {
                        return addToDaysButton
                    }

                    return this.state.daysMap.get(prop.id.toString()).includes(day.toLocaleDateString())
                        ? removeFromDaysButton
                        : addToDaysButton
                })

                let orderedDaysAmount = this.state.daysMap.get(prop.id.toString());
                if (orderedDaysAmount) {
                    orderedDaysAmount = orderedDaysAmount.length
                } else {
                    orderedDaysAmount = 0
                }

                let piecesAmount = this.state.piecesMap.get(prop.id.toString());
                if (!piecesAmount) {
                    piecesAmount = 0
                }

                totalCost += prop.costType == "DAY" ? prop.cost * orderedDaysAmount : prop.cost * piecesAmount
                return <tr key={prop.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{prop.name}</td>
                    <td>{MoneyFormatter.fromatDollars(prop.cost)}</td>
                    <td><span class={"badge " + (prop.costType == "PIECE" ? "bg-success" : "bg-warning")}>{prop.costType}</span></td>
                    <td><Input propId={prop.id} placeholder="Comment" id={`comment-${prop.id}`}></Input></td>
                    {prop.costType == "DAY" ? <td>{days}</td> : <td><Input onChange={this.handlePiecesChange} propId={prop.id}
                        value={this.state.piecesMap.get(prop.id.toString())} placeholder="Amount"></Input></td>}
                </tr>
            })

        return <div>
            <AppNavbar />
            <Container fluid>
                <div className="p-3">
                    <Nav tabs >
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggle('1'); }}
                            >
                                Market 🏪
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggle('2'); }}
                            >
                                Cart 🛒
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <Table className="mt-4">
                                <thead>
                                    <tr>
                                        <th width="15%">Name</th>
                                        <th width="40%">Description</th>
                                        <th width="10%">Cost</th>
                                        <th width="10%">Cost Type</th>
                                        <th width="10%">Prop Type</th>
                                        <th width="20%">Operations</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props}
                                </tbody>
                            </Table>
                        </TabPane>
                        <TabPane tabId="2">
                            <h3 className="mt-4">Total cost {MoneyFormatter.fromatDollars(totalCost)}</h3>
                            <Table className="mt-1">
                                <thead>
                                    <tr>
                                        <th width="10%">Name</th>
                                        <th width="7%">Cost</th>
                                        <th width="5%">Pay for</th>
                                        <th width="20%">Comment</th>
                                        <th width="35%">Order</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartProps}
                                </tbody>
                            </Table>
                            <div style={{ display: "flex", justifyContent: "space-between" }} className="mt-3">
                                <Button className="" style={{ minWidth: "45%" }}
                                    color="success" onClick={this.purchase} disabled={totalCost == 0 || totalCost > localStorage.getItem("cents")}>Purchase</Button>
                                <Button className="ms-3" style={{ minWidth: "45%" }}
                                    color="warning" onClick={this.clearCart} disabled={this.state.cart.length == 0}>Clear Cart</Button>
                            </div>
                        </TabPane>
                    </TabContent>
                </div>
            </Container>
            <ErrorNotifier />
        </div>
    }

    componentDidMount() {
        this.getAllProps();
    }

    getAllProps() {
        axios({
            method: 'get',
            url: '/props',
            headers: {
                'Authorization': localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            }
        }).then((res) => {
            res.data.props.map(prop => {
                this.state.costTypeMap.set(prop.id.toString(), prop.costType)
            })

            this.setState({ props: res.data.props, isLoading: false })
        })
    }

    addToDays(event) {
        let day = event.target.value;
        let propId = event.target.attributes.propId.value;
        let daysMap = this.state.daysMap;

        let propDays = daysMap.get(propId)
        if (propDays == null) {
            propDays = [day];
        } else {
            propDays.push(day);
        }
        daysMap.set(propId, propDays)
        this.setState({ daysMap: daysMap })
    }

    removeFromDays(event) {
        let day = event.target.value;
        let propId = event.target.attributes.propId.value;
        let daysMap = this.state.daysMap
        let foundIndex = daysMap.get(propId).findIndex((item) => {
            return item == day
        });

        daysMap.get(propId).splice(foundIndex, 1)

        this.setState({ daysMap: daysMap })
    }

    purchase() {
        this.state.cart.map(id => {
            let dto
            if (this.state.costTypeMap.get(id) == "DAY") {
                dto = {
                    orderedDays: this.state.daysMap.get(id),
                    comment: $(`#comment-${id}`).val()
                }
                if (!dto.orderedDays) {
                    return;
                }
            }
            if (this.state.costTypeMap.get(id) == "PIECE") {
                dto = {
                    pieces: this.state.piecesMap.get(id),
                    comment: $(`#comment-${id}`).val()
                }
                if (!dto.pieces) {
                    return;
                }
            }

            axios({
                method: 'post',
                url: `/props/${id}/orders`,
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
                },
                data: JSON.stringify(dto)
            }).then((res) => {
                // window.location.replace("/arranger/props/ordered")
            }).catch((err) => {
                ErrorHandler.runErrorStringMessage("Not enough amount of money")
            })
        })

        this.forceUpdate()
    }

    handlePiecesChange(event) {
        let amount = event.target.value;
        let propId = event.target.attributes.propId.value;
        let map = this.state.piecesMap;
        map.set(propId, amount)

        this.setState({ piecesMap: map })
    }
}

export default ArrangementProps