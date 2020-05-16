import React, {Component} from "react";
import {Card, Form, Button, Col, Nav} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit, faList, faPlusSquare, faSave, faUndo} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import MyToast from "./MyToast";
import {Link} from "react-router-dom";

export default class Student extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.state = {show: false};
        this.submitStudent = this.submitStudent.bind(this);
        this.onStudentChange = this.onStudentChange.bind(this);
    };



    initialState = {
       id:'', name: '', group: '', sbn: '', groupId: '', groups: []
    };

    componentDidMount() {
        this.getGroups();
        const studentId = +this.props.match.params.id;
        if(studentId!=null){
            this.findStudentById(studentId);
        }
    }

    findStudentById = (studentId)=>{
        axios.get("http://localhost:8080/students/"+studentId)
            .then(response=>{
                if(response!==null){
                    this.setState({
                        id: response.data.id,
                        name: response.data.name,
                        groupId: response.data.group.id,
                        group: response.data.group.name,
                        sbn: response.data.studentBookNumber
                    })
                }
            }).catch(error =>{
            console.log("Error - "+error)
        });
    };

    submitStudent(event) {
        event.preventDefault();
        const student = {
            name: this.state.name,
            studentBookNumber: this.state.sbn,
            group: this.state.groups.filter(g => g.name === this.state.group)[0].id
        };
        let querystring = require('querystring');
        axios.post("http://localhost:8080/students/", querystring.stringify(student))
            .then(response => {
                if (response.data != null) {
                    this.setState({"show": true, "method": "post"});
                    setTimeout(() => this.setState({"show": false}), 3000);
                } else {
                    this.setState({"show": false});
                }
            });
        this.setState({name: '', sbn: ''})
    };

    onStudentChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    resetStudent = () => {
        this.setState({name: '', sbn: ''})
    };

    getGroups() {
        axios.get("http://localhost:8080/groups/")
            .then(response => response.data)
            .then((data) => {
                this.setState({groups: data, group: data[0].name});
            });
    }

    studentList = () => {
        return this.props.history.push("/list");
    };

    updateStudent = event =>{
        event.preventDefault();
        const student = {
            id: this.state.id,
            name: this.state.name,
            studentBookNumber: this.state.sbn,
            group: this.state.groups.filter(g => g.name === this.state.group)[0].id
        };
        let querystring = require('querystring');
        axios.put("http://localhost:8080/students/"+student.id, querystring.stringify(student))
            .then(response => {
                if (response.data != null) {
                    this.setState({"show": true, "method":"put"});
                    setTimeout(() => this.setState({"show": false}), 3000);
                    setTimeout(() => this.studentList(), 3000);
                } else {
                    this.setState({"show": false});
                }
            });
        this.setState({name: '', sbn: ''})
    };

    render() {

        const {name, group, sbn} = this.state;

        return (
            <div>
                <div style={{"display": this.state.show ? "block" : "none"}}>
                    <MyToast show={this.state.show}
                             message={this.state.method === "put" ? "Book Updated Successfully." : "Book Saved Successfully."}
                             type={"success"}/>
                </div>
                <Card className="border border-dark text-white bg-dark">
                    <Card.Header><FontAwesomeIcon icon={this.state.id ? faEdit : faPlusSquare}/>{this.state.id ? " Edit student" : " Add student"}</Card.Header>
                    <Form id="studentFormId" onSubmit={this.state.id ? this.updateStudent : this.submitStudent} onReset={this.resetStudent}>
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control required type="text" name="name"
                                                  autoComplete="off"
                                                  className="bg-dark text-white"
                                                  value={name}
                                                  onChange={this.onStudentChange}
                                                  placeholder="Enter name"/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridGroup">
                                    <Form.Label>Group</Form.Label>
                                    <Form.Control required as="select" name="group"
                                                  className="bg-dark text-white"
                                                  value={group}
                                                  onChange={this.onStudentChange}
                                                  placeholder="Enter group">
                                        {this.state.groups !== undefined ? this.state.groups.map((g) => (
                                            <option>{g.name}</option>
                                        )) : <option>No groups are available</option>}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridSBN">
                                    <Form.Label>Student book number</Form.Label>
                                    <Form.Control required
                                                  type="text" name="sbn"
                                                  autoComplete="off"
                                                  className="bg-dark text-white"
                                                  value={sbn}
                                                  onChange={this.onStudentChange}
                                                  placeholder="Enter sbn"/>
                                </Form.Group>
                            </Form.Row>

                        </Card.Body>
                        <Card.Footer style={{'textAlign': 'right'}}>
                            <Button size="sm" variant="success" type="submit">
                                <FontAwesomeIcon icon={faSave}/> {this.state.id ? "Update" : "Save"}
                            </Button>{' '}
                            <Button size="sm" variant="info" type="reset">
                                <FontAwesomeIcon icon={faUndo}/> Reset
                            </Button>
                            {' '}
                            <Button size="sm" variant="info" type="button" onClick={this.studentList.bind()}>
                                <FontAwesomeIcon icon={faList}/> Student list
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </div>
        );
    }
}