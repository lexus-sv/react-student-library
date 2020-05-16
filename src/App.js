import React from 'react';
import './App.css';
import Header from "./components/Header";
import {BrowserRouter, Route, Switch} from "react-router-dom"
import {Col, Container, Row} from "react-bootstrap";
import Welcome from "./components/Welcome";
import Footer from "./components/Footer";
import Student from "./components/Student";
import StudentList from "./components/StudentList";


function App() {
    const marginTop = {
        marginTop:"20px"
    };

    return (
        <BrowserRouter>
            <div>
                <Header/>
                <Container>
                    <Row>
                        <Col lg={12} style={marginTop}>
                            <Switch>
                                <Route path="/" exact component={Welcome}/>
                                <Route path="/add" exact component={Student}/>
                                <Route path="/edit/:id" exact component={Student}/>
                                <Route path="/list" exact component={StudentList}/>
                            </Switch>
                        </Col>
                    </Row>
                </Container>
                <Footer/>
            </div>
        </BrowserRouter>
    );
}


export default App;
