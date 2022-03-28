import React from 'react';
import $ from 'jquery';
import ErrorHandler from '../../Handler/ErrorHandler'
import ErrorNotifier from '../../Handler/ErrorNotifier'
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, ButtonGroup } from 'reactstrap';
import AppNavbar from '../../AppNavbar';

const roleAdmin = "ROLE_ADMIN"

let thisObj

class PropEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prop: {
                id: "",
                name: "",
                description: "",
                propType: "",
                cost: "",
                costType: ""
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        thisObj = this
    }

    async componentDidMount() {
        $.ajax({
            url: `/prop-management/props/${this.props.match.params.id}`,
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                thisObj.setState({ prop: data });
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })
    }

    handleChange(e) {
        const target = e.target;
        const name = target.name;
        let value = target.value;
        let prop = { ...this.state.prop };

        prop[name] = value;
        this.setState({ prop: prop });
    }

    handleSubmit(event) {
        $.ajax({
            url: `/prop-management/props/${this.props.match.params.id}`,
            contentType: "application/json; charset=UTF-8",
            method: "put",
            data: JSON.stringify(this.state.prop),
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function (data) {
                thisObj.props.history.push('/prop-management/props');
                ErrorHandler.runSuccess(data)
            },
            error: function (data) {
                ErrorHandler.runError(data)
            }
        })

        event.preventDefault();
    }

    render() {
        const { prop: prop } = this.state;

        if (localStorage.getItem("login") == null || localStorage.getItem("role") !== roleAdmin || localStorage.getItem("id") == null) {
            return <ErrorNotifier />
        }

        return <div>
            <AppNavbar />
            <Container>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup className="mt-3">
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" id="name" value={prop.name || ''}
                            onChange={this.handleChange} autoComplete="event" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="description">Description</Label>
                        <Input type="text" name="description" id="description" value={prop.description || ''}
                            onChange={this.handleChange} autoComplete="description" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="cost">Cost (Cents)</Label>
                        <Input type="number" name="cost" id="cost" value={prop.cost || ''}
                            onChange={this.handleChange} autoComplete="cost" />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="description">Prop Type</Label><br />
                        <ButtonGroup>
                            <Button color={this.state.prop.propType == "THING" ? "success" : "outline-success"}
                                onClick={this.handleChange} name="propType" value="THING" >Thing</Button>
                            <Button color={this.state.prop.propType == "PLACE" ? "success" : "outline-success"}
                                onClick={this.handleChange} name="propType" value="PLACE" >Place</Button>
                        </ButtonGroup>
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Label for="description">Cost Type</Label><br />
                        <ButtonGroup>
                            <Button color={this.state.prop.costType == "PIECE" ? "success" : "outline-success"}
                                onClick={this.handleChange} name="costType" value="PIECE" >Piece</Button>
                            <Button color={this.state.prop.costType == "DAY" ? "success" : "outline-success"}
                                onClick={this.handleChange} name="costType" value="DAY" >Day</Button>
                        </ButtonGroup>
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <Button color="success" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/prop-management/props">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
            <ErrorNotifier />
        </div>
    }
}

export default PropEdit