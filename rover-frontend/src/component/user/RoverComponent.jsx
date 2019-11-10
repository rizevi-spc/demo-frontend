import React, {Component} from 'react'
import ApiService from "../../service/ApiService";

function getTokens(res, callback) {
    if (res.status === 401) {
        if (!this.state.accessToken || !this.state.refreshToken)
            this.props.history.push('/login');
        else {
            ApiService.getAccesTokenFromRefreshToken(this.state.refreshToken)
                .then((res) => {

                        this.setState({accessToken: res.data.access_token}, () => {
                            window.sessionStorage.setItem("accessToken", this.state.accessToken);
                            callback.call(this);
                        });


                    }
                ).catch(error => {
                if (error.response.status === 401) {
                    let user = {
                        username: window.sessionStorage.getItem("username"),
                        password: window.sessionStorage.getItem("password")
                    };
                    ApiService.getAccesAndRefreshTokens(user)
                        .then(res => {
                            window.sessionStorage.setItem("accessToken", res.data.access_token);
                            window.sessionStorage.setItem("refreshToken", res.data.refresh_token);
                            window.sessionStorage.getItem("accessToken");
                            window.sessionStorage.getItem("refreshToken");
                            this.setState({accessToken: res.data.access_token},
                                () => {
                                    this.setState({refreshToken: res.data.refresh_token});
                                    callback.call(this);
                                });

                        });
                }


            });
        }
    }
}

function returnError(status, error) {
    if (status === 400 || status === 500)
        window.Toast.fire({
            icon: 'error',
            title: error.response.data.message
        });
}

class RoverComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            result: '',
            cmdStr: '',
            rovers: [],
            accessToken: null,
            refreshToken: null,
            message: null
        }

        this.reloadRoverInfo = this.reloadRoverInfo.bind(this);
        this.sendCommand = this.sendCommand.bind(this);
        this.logout = this.logout.bind(this);
    }

    onChange = (e) =>
        this.setState({[e.target.name]: e.target.value});

    componentDidMount() {
        this.setState({accessToken: window.sessionStorage.getItem("accessToken")},
            () => {
                this.setState({refreshToken: window.sessionStorage.getItem("refreshToken")},
                    () => {
                        this.setState({refreshToken: window.sessionStorage.getItem("refreshToken")});
                        if (!this.state.accessToken || !this.state.refreshToken)
                            this.props.history.push('/login');
                        this.reloadRoverInfo();
                    }
                );
            });


    }

    sendCommand = (e) => {
        if (e)
            e.preventDefault();
        ApiService.sendCommand(this.state.cmdStr, this.state.accessToken)
            .then((res) => {
                this.setState({result: res.data.result})
            }).catch(error => {
            var status = error.response.status;
            returnError(status, error);
            getTokens.call(this, error.response, this.sendCommand);
        });

    }

    reloadRoverInfo = (e) => {
        if (e)
            e.preventDefault();
        ApiService.fetchRoverInfos(this.state.accessToken)
            .then((res) => {
                this.setState({rovers: res.data.result})
            }).catch(error => {
            var status = error.response.status;
            returnError(status, error);
            getTokens.call(this, error.response, this.reloadRoverInfo);
        });
    }

    logout = (e) => {
        sessionStorage.clear();
        this.props.history.push('/login');
    }

    render() {
        return (
            <div>
                <form>
                    <button className="btn btn-success" style={{float: 'right'}}
                            onClick={this.logout}>Logout
                    </button>
                    <div className="form-group">
                        <label>Command:</label>
                        <textarea name="cmdStr" placeholder="command" value={this.state.cmdStr} className="form-control"
                                  rows={5}
                                  onChange={this.onChange}/>
                    </div>
                    <div className="form-group">
                        <label>Command Result:</label>
                        <textarea contentEditable={false} name="result" placeholder="result" value={this.state.result}
                                  className="form-control" rows={5} disabled={true}
                                  onChange={this.onChange}/>
                    </div>

                    <button className="btn btn-success" onClick={this.sendCommand}>Send Command</button>
                </form>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Is Active</th>
                        <th>Port</th>
                        <th>Last Horizontal Coordinate</th>
                        <th>Last Vertical Coordinate</th>
                        <th>Last Heading Direction</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.rovers.map(
                            rover =>
                                <tr key={rover.id}>
                                    <td>{rover.id}</td>
                                    <td>{rover.active.toString()}</td>
                                    <td>{rover.port}</td>
                                    <td>{rover.lastLocationInfo.coordinateX}</td>
                                    <td>{rover.lastLocationInfo.coordinateY}</td>
                                    <td>{rover.lastLocationInfo.headingDirection}</td>
                                </tr>
                        )
                    }
                    </tbody>
                </table>

            </div>
        )
            ;
    }

}

export default RoverComponent;