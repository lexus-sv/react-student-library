import React, {Component} from "react";
import {Button, ButtonGroup, Card, Image, Table} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faEdit,
    faFastBackward,
    faFastForward,
    faList,
    faStepBackward,
    faStepForward,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import {Link} from "react-router-dom";
import MyToast from "./MyToast";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

export default class StudentList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            students: [],
            currentPage: 1,
            studentsPerPage: 10
        }
    }

    componentDidMount() {
        axios.get("http://localhost:8080/students/")
            .then(response => response.data)
            .then((data) => {
                this.setState({students: data});
            });
    }

    deleteStudent = (studentId) => {
        axios.delete("http://localhost:8080/students/" + studentId)
            .then(response => {
                if (response.data != null) {
                    this.setState({"show": true, "method": "post"});
                    setTimeout(() => this.setState({"show": false}), 3000);
                    this.setState({
                        students: this.state.students.filter(s => s.id !== studentId)
                    });
                } else {
                    this.setState({"show": false});
                }
            })
    };

    changePage = event =>{
        if(!isNaN(event.target.value))
        this.setState({
            [event.target.name]: parseInt(event.target.value)
        });
        else {
            this.setState({
                currentPage: 1
            })
        }
    };

    firstPage = () => {
        if(this.state.currentPage > 1) {
            this.setState({
                currentPage: 1
            });
        }
    };

    prevPage = () => {
        if(this.state.currentPage > 1) {
            this.setState({
                currentPage: this.state.currentPage - 1
            });
        }
    };

    lastPage = () => {
        if(this.state.currentPage < Math.ceil(this.state.students.length / this.state.studentsPerPage)) {
            this.setState({
                currentPage: Math.ceil(this.state.students.length / this.state.studentsPerPage)
            });
        }
    };

    nextPage = () => {
        if(this.state.currentPage < Math.ceil(this.state.students.length / this.state.studentsPerPage)) {
            this.setState({
                currentPage: this.state.currentPage + 1
            });
        }
    };

    render() {
        const {students, currentPage, studentsPerPage} = this.state;
        const lastIndex = currentPage*studentsPerPage;
        const firstIndex = lastIndex-studentsPerPage;
        const currentStudents = students.slice(firstIndex, lastIndex);
        const totalPages = Math.ceil(students.length/studentsPerPage);
        return (
            <div>
                <div style={{"display": this.state.show ? "block" : "none"}}>
                    <MyToast show={this.state.show}
                             message={this.state.method === "put" ? "Student Updated Successfully." : "Book Deleted Successfully."}
                             type={"danger"}/>
                </div>
                <Card className="border border-dark text-white bg-dark">
                    <Card.Header><FontAwesomeIcon icon={faList}/> Student list</Card.Header>
                    <Card.Body>
                        <Table bordered hover striped variant="dark">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Group</th>
                                <th>BookNumber</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                currentStudents.length === 0 ?
                                    <tr align="center">
                                        <td colSpan="7">No students available.</td>
                                    </tr> :
                                    currentStudents.map((student) => (
                                        <tr key={student.id}>
                                            <td>{student.name}</td>
                                            <td>{student.group.name}</td>
                                            <td>{student.studentBookNumber}</td>
                                            <td>
                                                <ButtonGroup>
                                                    <Link to={"edit/" + student.id}
                                                          className="btn btn-sm btn-outline-primary"><FontAwesomeIcon
                                                        icon={faEdit}/></Link>{' '}
                                                    <Button size="sm" variant="outline-danger"
                                                            onClick={this.deleteStudent.bind(this, student.id)}><FontAwesomeIcon
                                                        icon={faTrash}/></Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    ))
                            }
                            </tbody>
                        </Table>
                    </Card.Body>
                    {students.length > 0 ?
                        <Card.Footer>
                            <div style={{"float":"left"}}>
                                Showing Page {currentPage} of {totalPages}
                            </div>
                            <div style={{"float":"right"}}>
                                <InputGroup size="sm">
                                    <InputGroup.Prepend>
                                        <Button type="button" variant="outline-info" disabled={currentPage === 1}
                                                onClick={this.firstPage}>
                                            <FontAwesomeIcon icon={faFastBackward} /> First
                                        </Button>
                                        <Button type="button" variant="outline-info" disabled={currentPage === 1}
                                                onClick={this.prevPage}>
                                            <FontAwesomeIcon icon={faStepBackward} /> Prev
                                        </Button>
                                    </InputGroup.Prepend>
                                    <FormControl className={"page-num bg-dark"} name="currentPage" value={currentPage}
                                                 onChange={this.changePage} style={{"width":"45px", "textAlign":"center", "color":"#17a2b8", "border":"1px solid #17a2b8"}}/>
                                    <InputGroup.Append>
                                        <Button type="button" variant="outline-info" disabled={currentPage === totalPages}
                                                onClick={this.nextPage}>
                                            <FontAwesomeIcon icon={faStepForward} /> Next
                                        </Button>
                                        <Button type="button" variant="outline-info" disabled={currentPage === totalPages}
                                                onClick={this.lastPage}>
                                            <FontAwesomeIcon icon={faFastForward} /> Last
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </div>
                        </Card.Footer> : null
                    }
                </Card>
                <div style={{padding: "30px"}}>
                </div>
            </div>
        );
    }
}