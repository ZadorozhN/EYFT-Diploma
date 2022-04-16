
import React from "react";
import CardReactFormContainer from 'card-react';
import { Row, Col, Container, Form, Input, InputGroup, Nav, NavItem, NavLink, TabContent, TabPane, Button } from 'reactstrap';

class DepositPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cents: 0,
            CCnumber_deposit: "",
            CCcvc_deposit: "",
            CCname_deposit: "",
            CCexpiry_deposit: "",
            valid: false
        }

        this.bankClient = props.bankClient;

        this.handleChange = this.handleChange.bind(this)
        this.validateBankCardAndCents = this.validateBankCardAndCents.bind(this)
    }

    validateBankCardAndCents() {
        let valid = this.state.CCnumber_deposit.length == 19
            && this.state.CCcvc_deposit.length == 3
            && this.state.CCname_deposit.length > 4
            && this.state.CCexpiry_deposit.length >= 7
            && this.state.cents > 0 && this.state.cents < 1000000000;

        this.setState({ valid: valid })
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({ [name]: value }, () =>
            this.validateBankCardAndCents())
    }

    render() {
        return <div>

            <h2 className='my-3'>Deposit</h2>
            <Row>
                <Col xs="4" style={{ display: "flex", }}>
                    <CardReactFormContainer
                        container="card-wrapper-deposit"
                        formInputsNames={
                            {
                                number: 'CCnumber_deposit',
                                expiry: 'CCexpiry_deposit',
                                cvc: 'CCcvc_deposit',
                                name: 'CCname_deposit'
                            }
                        }
                        initialValues={
                            {
                                number: '',
                                cvc: '',
                                expiry: '',
                                name: ''
                            }
                        }
                        classes={
                            {
                                valid: 'valid-input',
                                invalid: 'invalid-input'
                            }
                        }
                    >
                        <Form className='mb-5'>
                            <InputGroup className='mb-3'>
                                <Input onChange={this.handleChange}
                                    placeholder="Card number"
                                    maxLength={19} type="text" name="CCnumber_deposit" style={{ width: "300px" }} />
                                <Input onChange={this.handleChange}
                                    placeholder="CVC"
                                    maxLength={3} type="text" name="CCcvc_deposit" style={{ width: "100px" }} />
                            </InputGroup>
                            <InputGroup>
                                <Input onChange={this.handleChange}
                                    placeholder="Full name"
                                    type="text" name="CCname_deposit" style={{ width: "300px" }} />
                                <Input onChange={this.handleChange}
                                    placeholder="MM/YY" maxLength={7}
                                    type="text" name="CCexpiry_deposit" style={{ width: "100px" }} />
                            </InputGroup>
                            <InputGroup className="mt-3">
                                <Input placeholder="Cents" type="number" name="cents" value={this.state.cents} onChange={this.handleChange} style={{ width: "200px" }} />
                                <Button disabled={!this.state.valid}
                                    onClick={() => this.bankClient.deposit(localStorage.getItem("login"), this.state.cents)} color="success">Deposit</Button>
                            </InputGroup>
                        </Form>
                    </CardReactFormContainer>
                </Col>

                <Col xs="4">
                    <div id="card-wrapper-deposit"></div>
                </Col>
            </Row>
        </div>
    }

}

export default DepositPage;