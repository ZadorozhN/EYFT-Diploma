import React, { Component } from 'react';
import '../App.css';
import AppNavbar from '../AppNavbar.js';
import { Link } from 'react-router-dom';
import { Button, Container, Col, Row} from 'react-bootstrap';
import ErrorNotifier from '../Handler/ErrorNotifier';
import { Card, CardGroup, Alert, ToggleButton } from 'react-bootstrap'
import {dispense} from "Localization/Dispenser.js"

const roleArranger = "ROLE_ARRANGER"
const roleAdmin = "ROLE_ADMIN"

class ArrangerPage extends Component {
    constructor(props){
        super(props);

        this.goToArrangedEvents = this.goToArrangedEvents.bind(this);
        this.goToEventArrangement = this.goToEventArrangement.bind(this);
        this.goToPropsMarket = this.goToPropsMarket.bind(this)
        this.goToOrderedProps = this.goToOrderedProps.bind(this)
    }

    goToArrangedEvents(){
        this.props.history.push('/arranger/arranged')
    }

    goToEventArrangement(){
        this.props.history.push('/arranger/arrangement')
    }

    goToPropsMarket(){
        this.props.history.push('/arranger/props/market')
    }
    
    goToOrderedProps(){
        this.props.history.push('/arranger/props/ordered')
    }

    render() {

        if(localStorage.getItem("login") == null 
        || (localStorage.getItem("role") !== roleArranger && localStorage.getItem("role") !== roleAdmin) 
        || localStorage.getItem("id") == null){
            return <ErrorNotifier/>
        }
        
        return (
        <div>
            <AppNavbar/>
            <Container fluid>
            <div class="adminConsole">
                        <Card onClick={this.goToArrangedEvents}>
                            <Card.Img variant="top" style={{minWidth: "100%"}} src={"/arrangedEvents.png"} className="mt-0 events" />
                            <Card.Body>
                                <Card.Title>{dispense("arrangedEvents")}</Card.Title>
                                <Card.Text>{dispense("arrangerArrangedEventsDescription")}</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card onClick={this.goToEventArrangement}>
                            <Card.Img variant="top" style={{minWidth: "100%"}} src={"/arrangement.webp"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>{dispense("eventArrangement")}</Card.Title>
                                <Card.Text>{dispense("arrangerArrangeEventDescription")}</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card onClick={this.goToPropsMarket}>
                            <Card.Img variant="top" style={{minWidth: "100%"}} src={"/market.jpg"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>{dispense("orderProps")}</Card.Title>
                                <Card.Text>{dispense("arrangerOrderPropsDescription")}</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card onClick={this.goToOrderedProps}>
                            <Card.Img variant="top" style={{minWidth: "100%"}} src={"/orderedProps.jpg"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>{dispense("orderedProps")}</Card.Title>
                                <Card.Text>{dispense("arrangerOrderedPropsDescription")}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
            </Container>
            <ErrorNotifier/>
        </div>
        );
  }
}

export default ArrangerPage;