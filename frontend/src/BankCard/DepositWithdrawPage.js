
import React from 'react';
import { Row, Col, Container, Form, Input, InputGroup, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import ErrorNotifier from '../Handler/ErrorNotifier';
import cardCss from '../card.css'
import DepositPage from './DepositPage';
import WithdrawPage from './WithdrawPage';
import BankClient from './BankClient/BankClient';
import { dispense } from "Localization/Dispenser";

class DepositWithdrawPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: "1"
        }

        this.bankClient = new BankClient()

        this.toggle = this.toggle.bind(this)
    }

    toggle(tab) {
        this.setState({ activeTab: tab })
    }

    render() {
        return <div>
            <AppNavbar />
            <Container>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            onClick={() => this.toggle("1")}
                            active={this.state.activeTab == "1"}>
                            {dispense("deposit")}
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            onClick={() => this.toggle("2")}
                            active={this.state.activeTab == "2"}>
                            {dispense("withdraw")}
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent className='mt-3' activeTab={this.state.activeTab}>
                    <TabPane tabId={"1"}>
                        <DepositPage bankClient={this.bankClient} />
                    </TabPane>
                    <TabPane tabId={"2"}>
                        <WithdrawPage bankClient={this.bankClient} />
                    </TabPane>
                </TabContent>
            </Container>
            <ErrorNotifier />
        </div>
    }
}

export default DepositWithdrawPage