import React, { Component } from 'react';
import '../App.css';
import {Alert} from 'reactstrap';

class ErrorNotifier extends Component {
  render() {
    return (
        <div class="fixed-bottom">
            <Alert className="sm mb-0" color="danger" id="alert-danger" style={{display: 'none' }}>
            </Alert>
            
            <Alert className="sm mb-0" color="success" id="alert-success" style={{display: 'none' }}>
            </Alert>
        </div>
    );
  }
}

export default ErrorNotifier;