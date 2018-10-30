import React, { Component } from 'react';
import './App.css';
import {Tab, Row, Col, Nav, NavItem} from 'react-bootstrap';
import AccountDataGrid from "./AccountDataGrid";
import OperationsDataGrid from "./OperationsDataGrid";
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
    position: 'bottom center',
    timeout: 5000,
    offset: '30px',
    transition: 'scale',
    dataUrl: 'http://localhost:8080'
}

class App extends Component {
    render() {
        return (
            <AlertProvider template={AlertTemplate} {...options}>
                <div>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                        <Row className="clearfix">
                            <Col sm={2}>
                                <Nav bsStyle="pills" stacked>
                                    <NavItem eventKey="first">Счета</NavItem>
                                    <NavItem eventKey="second">Операции</NavItem>
                                </Nav>
                            </Col>
                            <Col sm={10} id="content_col">
                                <Tab.Content animation>
                                    <Tab.Pane eventKey="first"><AccountDataGrid url={options.dataUrl}/></Tab.Pane>
                                    <Tab.Pane eventKey="second"><OperationsDataGrid url={options.dataUrl}/></Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>
            </AlertProvider>
        );
    }
};

export default App;
