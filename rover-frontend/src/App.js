import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import LoginComponent from "./component/user/LoginComponent";
import RoverComponent from "./component/user/RoverComponent";
import Swal from 'sweetalert2/dist/sweetalert2.js'

import 'sweetalert2/src/sweetalert2.scss'

function App() {


       componentWillMount: {
        window.Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    }
    return (
        <div className="container">
            <Router>
                <div className="col-md-6">
                    <div style={{float: 'left'}}>
                        <img alt={'logo'} style={{float: 'left'}} src="/img/nasa.png" width="20%"/>
                        <h1 style={style}>Nasa Rover Application</h1>
                    </div>
                    <Switch>
                        <Route path="/" exact component={RoverComponent} appProps={{
                            window: sessionStorage.getItem(
                                "accessToken"
                            )
                        }}/>
                        <Route path="/login" component={LoginComponent}/>
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

const style = {
    color: 'red',
    margin: '1em'
}

export default App;
