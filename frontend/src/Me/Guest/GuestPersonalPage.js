import React, { Component } from 'react';
import '../../App.css';
import AppNavbar from '../../AppNavbar.js';
import { Container, Alert } from 'reactstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import ErrorNotifier from '../../Handler/ErrorNotifier';
import GuestMePage from './GuestMePage';
import GuestMePhotos from './GuestMePhotos';
import GuestMeArrangedEvents from './GuestMeArrangedEvents';
import classnames from 'classnames';
import Constants from '../../Const/Constants';
import { dispense } from 'Localization/Dispenser'

class GuestPersonalPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1',
            user: null
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {

        return (
            <div>
                <AppNavbar />
                <Container fluid>
                    <Row>
                        <Col xs="4">
                            <GuestMePage setUser={(data) => {
                                this.setState({ user: data }, () => {
                                    if (this.state.user == null || !Constants.isArrangerOrHigher("ROLE_" + this.state.user.role)) {
                                        this.toggle('2')
                                    }
                                })
                            }
                            } />
                        </Col>

                        <Col xs="8">
                            <div>
                                <Nav tabs>
                                    {this.state.user != null && Constants.isArrangerOrHigher("ROLE_" + this.state.user.role)? 
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: this.state.activeTab === '1' })}
                                                onClick={() => { this.toggle('1'); }}
                                            >
                                                {dispense('arrangedEvents')} ????
                                            </NavLink>
                                        </NavItem> : ""}
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '2' })}
                                            onClick={() => { this.toggle('2'); }}
                                        >
                                            {dispense('photos')} ????
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={this.state.activeTab}>
                                    {this.state.user != null && Constants.isArrangerOrHigher("ROLE_" + this.state.user.role) ?
                                        <TabPane tabId="1">
                                            <GuestMeArrangedEvents />
                                        </TabPane> : ""}
                                    <TabPane tabId="2">
                                        <GuestMePhotos />
                                    </TabPane>
                                </TabContent>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <ErrorNotifier />
            </div>
        );
    }

}

export default GuestPersonalPage;