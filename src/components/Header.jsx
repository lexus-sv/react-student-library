import React from "react";
import {Navbar, Nav} from 'react-bootstrap'
import {Link} from 'react-router-dom'

export default function Header() {
        return (
            <div className="header">
                <Navbar bg="dark" expand="lg" variant="dark">
                    <Link to={""} className="navbar-brand">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png" alt="brand" />StudentProject
                    </Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Link to={"add"} className="nav-link">Add Student</Link>
                            <Link to={"list"} className="nav-link">Students list</Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
}