import React from 'react'
import CardReactFormContainer from 'card-react';
import { Row, Col, Container, Form, Input, InputGroup, Nav, NavItem, NavLink, TabContent, TabPane, Button } from 'reactstrap';
import { dispense } from "Localization/Dispenser";

class WithdrawPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            cents: 0,
            CCnumber_withdraw: "",
            CCcvc_withdraw: "",
            CCname_withdraw: "",
            CCexpiry_withdraw: "",
            valid: false
        }

        this.bankClient = props.bankClient;
        this.handleChange = this.handleChange.bind(this)
        this.validateBankCardAndCents = this.validateBankCardAndCents.bind(this)
    }

    validateBankCardAndCents() {
        let valid = this.state.CCnumber_withdraw.length == 19
            && this.state.CCname_withdraw.length > 4
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

            <h2 className='my-3'>{dispense("withdraw")}</h2>

            <Row>
                <Col xs="4" style={{ display: "flex", }}>
                    <CardReactFormContainer
                        container="card-wrapper-withdraw"
                        formInputsNames={
                            {
                                number: 'CCnumber_withdraw',
                                expiry: 'CCexpiry_withdraw',
                                cvc: 'CCcvc_withdraw',
                                name: 'CCname_withdraw'
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
                                <Input onChange={this.handleChange} maxLength={19}
                                    placeholder={dispense("cardNumber")} type="text" name="CCnumber_withdraw" style={{ width: "300px" }} />
                                <Input onChange={this.handleChange} maxLength={3}
                                    placeholder="CVC" type="text" name="CCcvc_withdraw" style={{ width: "100px" }} disabled/>
                            </InputGroup>
                            <InputGroup>
                                <Input onChange={this.handleChange} 
                                    placeholder={dispense("fullName")} type="text" name="CCname_withdraw" style={{ width: "300px" }} />
                                <Input onChange={this.handleChange} maxLength={7}
                                    placeholder="MM/YY" type="text" name="CCexpiry_withdraw" style={{ width: "100px" }} disabled/>
                            </InputGroup>
                            <InputGroup className="mt-3">
                                <Input placeholder="Cents" type="number" name="cents" value={this.state.cents} onChange={this.handleChange} style={{ width: "200px" }} />
                                <Button disabled={!this.state.valid} onClick={() => this.bankClient.withdraw(localStorage.getItem("login"), this.state.cents)} color="success">{dispense("withdraw")}</Button>
                            </InputGroup>
                        </Form>
                    </CardReactFormContainer>
                </Col>

                <Col xs="4">
                    <div id="card-wrapper-withdraw"></div>
                </Col>
            </Row>
        </div>
    }
}

export default WithdrawPage