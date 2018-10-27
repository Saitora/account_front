import React, { Component } from 'react';
import './App.css';
import {Tab, Row, Col, Nav, NavItem} from 'react-bootstrap';
import AccountDataGrid from "./AccountDataGrid";
import OperationsDataGrid from "./OperationsDataGrid";

class App extends Component {
    render() {
        return (
            <div>
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Row className="clearfix">
                        <Col sm={4}>
                            <Nav bsStyle="pills" stacked>
                                <NavItem eventKey="first">Счета</NavItem>
                                <NavItem eventKey="second">Операции</NavItem>
                            </Nav>
                        </Col>
                        <Col sm={8} id="content_col">
                            <Tab.Content animation>
                                <Tab.Pane eventKey="first"><AccountDataGrid/></Tab.Pane>
                                <Tab.Pane eventKey="second"><AccountDataGrid/></Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        );
    }
};

export default App;
