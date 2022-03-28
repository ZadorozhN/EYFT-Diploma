import axios from "axios"
import { map } from "jquery"
import React from "react"
import { Table, Button, Input, Container, Badge, ButtonGroup } from 'reactstrap'
import AppNavbar from '../../AppNavbar'
import ErrorHandler from '../../Handler/ErrorHandler'
import ErrorNotifier from '../../Handler/ErrorNotifier'
import MoneyFormatter from '../../Formatter/MoneyFormatter'
import Waiter from '../../Waiter'

let thisObj

class MyProps extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            propOrders: [],
            filteredPropOrders: [],
            isLoading: true,
            infoMode: true,
            mode: "ALL",
            filterName: "",
            sortCost: "None"
        }

        this.cancelBook = this.cancelBook.bind(this)
        this.toggleMode = this.toggleMode.bind(this)
        this.changeMode = this.changeMode.bind(this)
        this.filterPropOrders = this.filterPropOrders.bind(this)
        this.changeFilterName = this.changeFilterName.bind(this)
        this.changeSortCost = this.changeSortCost.bind(this)

        thisObj = this
    }

    changeSortCost() {
        let value = this.state.sortCost;
        switch (value) {
            case "None": value = "Asc"
                break;
            case "Asc": value = "Desc"
                break;
            case "Desc": value = "None"
                break;
            default: value = "def"
                break;
        }

        this.setState({ sortCost: value }, () => this.filterPropOrders())
    }

    changeFilterName(event) {
        let value = event.target.value;

        this.setState({ filterName: value }, () => this.filterPropOrders());
    }

    filterPropOrders() {
        let filtered = this.state.propOrders;

        if (this.state.mode != "ALL") {
            filtered = filtered.filter(item => {
                return item.status == this.state.mode
            })
        }

        filtered = filtered.filter(item => {
            return item.prop.name.includes(this.state.filterName)
        })

        if (this.state.sortCost == "Asc")
            filtered = filtered.sort((a, b) => a.cost - b.cost)
        else if (this.state.sortCost == "Desc")
            filtered = filtered.sort((a, b) => b.cost - a.cost)

        this.setState({ filteredPropOrders: filtered })
    }

    changeMode(event) {
        let target = event.target;
        this.setState({ mode: target.value }, () => { thisObj.filterPropOrders() })
    }

    cancelBook(id) {
        axios({
            method: 'delete',
            url: `/arranger/props/ordered/${id}`,
            headers: {
                'Content-Type': "application/json",
                'Authorization': localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            }
        }).then((res) => {
            let propOrders = this.state.propOrders;
            let updatedPropOrders = propOrders.filter((item) => item.id != id);
            this.setState({ propOrders: updatedPropOrders }, () => this.filterPropOrders())
            ErrorHandler.runSuccess(res.data)
        }).catch((err) => {
            ErrorHandler.runStringMessage("Already deleted")
        })
    }

    toggleMode() {
        this.setState({ infoMode: !this.state.infoMode })
    }

    render() {
        if (this.state.isLoading) {
            return <Waiter />
        }

        let propOrders = this.state.filteredPropOrders.map((propOrder) => {
            let date;
            let pieces;
            let costType;
            if (propOrder.orderedDate) {
                date = new Date(propOrder.orderedDate).toLocaleDateString();
                costType = "DAY"
            } else {
                pieces = propOrder.pieces
                costType = "PIECES"
            }

            let status = null;
            if (propOrder.status == "ORDERED") {
                status = <span style={{ minWidth: "100%" }} class="badge bg-warning">Ordered</span>
            }
            if (propOrder.status == "ACCEPTED") {
                status = <span style={{ minWidth: "100%" }} class="badge bg-success">Accepted</span>
            }
            if (propOrder.status == "DELIVERED") {
                status = <span style={{ minWidth: "100%" }} class="badge bg-secondary">Delivered</span>
            }

            if (this.state.infoMode) {
                return <tr>
                    <td>{propOrder.prop.name}</td>
                    <td>{costType == "DAY" ? date : pieces}</td>
                    <td>{MoneyFormatter.fromatDollars(propOrder.cost)}</td>
                    <td>{status}</td>
                    <td><Button color="danger" propOrderId={propOrder.id} onClick={() => this.cancelBook(propOrder.id)}
                        disabled={propOrder.status != "ORDERED"} style={{ minWidth: "100%" }}>
                        Cancel booking
                    </Button></td>
                </tr>
            }
            return <tr>
                <td>{propOrder.prop.name}</td>
                <td>{propOrder.comment}</td>
                <td>{propOrder.answer}</td>
                <td><Button color="danger" propOrderId={propOrder.id} onClick={() => this.cancelBook(propOrder.id)}
                    disabled={propOrder.status != "ORDERED"} style={{ minWidth: "100%" }}>
                    Cancel booking
                </Button></td>
            </tr>
        })

        let modeView;

        if (this.state.infoMode) {
            modeView = <tr>
                <th width="20%">Prop Name</th>
                <th width="20%">Pieces</th>
                <th width="20%">Total Cost</th>
                <th width="20%">Status</th>
                <th width="20%">Operations</th>
            </tr>
        } else {
            modeView = <tr>
                <th width="20%">Prop name</th>
                <th width="40%">Comment</th>
                <th width="40%">Answer</th>
                <th width="20%">Operations</th>
            </tr>
        }

        return <div>
            <AppNavbar />
            <Container fluid>
                <div class="mt-3 ms-3">
                    <Button style={{ minWidth: '15%' }}
                        onClick={this.toggleMode} color={this.state.infoMode ? "success" : "warning"}>
                        {this.state.infoMode ? "Info Mode" : "Comment Mode"}
                    </Button>
                </div>
                <div class="mt-3 ms-3" style={{ "display": "flex" }}>
                    <div class="input-group" style={{ maxWidth: '55%' }}>
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">🔎</span>
                        </div>
                        <input type="text" class="form-control" value={this.state.filterName} onChange={this.changeFilterName} placeholder="Prop Name" aria-label="Category Name" aria-describedby="basic-addon1" />
                    </div>
                    <ButtonGroup className='ms-3'>
                        <Button onClick={this.changeMode} color={this.state.mode == "ALL" ? "success" : "outline-success"} value="ALL" >All</Button>
                        <Button onClick={this.changeMode} color={this.state.mode == "ORDERED" ? "success" : "outline-success"} value="ORDERED">Ordered</Button>
                        <Button onClick={this.changeMode} color={this.state.mode == "ACCEPTED" ? "success" : "outline-success"} value="ACCEPTED">Accepted</Button>
                        <Button onClick={this.changeMode} color={this.state.mode == "DELIVERED" ? "success" : "outline-success"} value="DELIVERED">Delivered</Button>
                    </ButtonGroup>
                    <Button className="ms-3"
                        onClick={this.changeSortCost}
                        color={this.state.sortCost == "None" ? "outline-success" : "success"}>
                        Cost Sort {this.state.sortCost == "None" ? "" : this.state.sortCost == "Asc" ? "🔻" : "🔺"}
                    </Button>
                </div>
                <div>
                    <Table className="mt-4 ms-3">
                        <thead>
                            {modeView}
                        </thead>
                        <tbody>
                            {propOrders}
                        </tbody>
                    </Table>
                </div>
            </Container>
            <ErrorNotifier />
        </div>
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: `/arranger/props/ordered`,
            headers: {
                'Content-Type': "application/json",
                'Authorization': localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
        }).then((res) => {
            this.setState({ propOrders: res.data.propOrders, isLoading: false }, () => this.filterPropOrders())
        })
    }
}

export default MyProps