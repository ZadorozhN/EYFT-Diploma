import React, { Component } from 'react';
import '../App.css';
import AppNavbar from '../AppNavbar.js';
import { Link } from 'react-router-dom';
import { Container, Alert } from 'reactstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import MePage from './MePage';
import MeJoinedEvents from './MeJoinedEvents';
import MeEventsToJoin from './MeEventsToJoin';
import ErrorNotifier from '../Handler/ErrorNotifier';
import Constants from '../Const/Constants';
import MePhotos from './MePhotos';
import MeChangePresonalData from './MeChangePresonalData';
import MessengerCore from '../Messanger/MessengerCore';

class PersonalPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1'
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

        if(localStorage.getItem("login") == null 
        || !Constants.isAnyRole((localStorage.getItem("role"))) 
        || localStorage.getItem("id") == null){
            return <ErrorNotifier/>
        }

        return (
            <div>
                <AppNavbar />
                <Container fluid>
                    <Row>
                        <Col xs="4">
                            <MePage />
                        </Col>

                        <Col xs="8">
                            <div>
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '1' })}
                                            onClick={() => { this.toggle('1'); }}
                                        >
                                            Joined Events
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '2' })}
                                            onClick={() => { this.toggle('2'); }}
                                        >
                                            Events To Join
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '3' })}
                                            onClick={() => { this.toggle('3'); }}
                                        >
                                            Photos
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '4' })}
                                            onClick={() => { this.toggle('4'); }}
                                        >
                                            Personal Data
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '5' })}
                                            onClick={() => { this.toggle('5'); }}
                                        >
                                            Messenger
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={this.state.activeTab}>
                                    <TabPane tabId="1">
                                        <MeJoinedEvents/>
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <MeEventsToJoin/>
                                    </TabPane>
                                    <TabPane tabId="3">
                                        <MePhotos/>
                                    </TabPane>
                                    <TabPane tabId="4">
                                        <MeChangePresonalData/>
                                    </TabPane>
                                    <TabPane tabId="5">
                                        <MessengerCore/>
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

export default PersonalPage;