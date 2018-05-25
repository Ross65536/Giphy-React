import React, { Component } from 'react';
import { Grid, Navbar, Jumbotron, Button } from 'react-bootstrap';

import './App.css'

class App extends Component {
    render() {
        return (
            <div>
                {/* Header */}
                <Navbar inverse fixedTop>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/">Giphy-React</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <form id="header-search" class="navbar-form navbar-right" role="search">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Search" />
                        </div>
                        <button type="submit" class="btn btn-default">
                            <span class="glyphicon glyphicon-search"></span>
                        </button>
                    </form>
                </Navbar>
                {/* Body */}
                <Jumbotron>
                    <Grid>
                        <h1>Hiya</h1>
                        <p> Hi</p>
                    </Grid>
                </Jumbotron>
            </div>
        );
    }
}

export default App;