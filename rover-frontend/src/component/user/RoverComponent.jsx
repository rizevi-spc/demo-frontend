import React, {Component} from 'react'
import ApiService from "../../service/ApiService";

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
        e.preventDefault();
        ApiService.sendCommand(this.state.cmdStr)
            .then((res) => {
                if (res.status === 401) {
                    if (!this.state.accessToken || this.state.refreshToken)
                        this.props.history.push('/login');
                    else {
                        ApiService.getAccesTokenFromRefreshToken(this.state.refreshToken)
                            .then((res) => {
                                    if (res.status === 401) {
                                        let user = {
                                            username: window.sessionStorage.getItem("username"),
                                            password: window.sessionStorage.getItem("password")
                                        };
                                        ApiService.getAccesAndRefreshTokens(user)
                                            .then(res => {
                                                window.sessionStorage.setItem("username", this.state.username);
                                                window.sessionStorage.setItem("password", this.state.password);
                                                window.sessionStorage.setItem("accessToken", res.data.access_token);
                                                window.sessionStorage.setItem("refreshToken", res.data.refresh_token);
                                            });
                                    } else {
                                        this.setState({accessToken: res.data.access_token});
                                        window.sessionStorage.setItem("accessToken", this.state.accessToken);
                                    }

                                }
                            );
                    }
                }

                this.setState({result: res.data.result})
            })
        ;
    }

    reloadRoverInfo() {
        ApiService.fetchRoverInfos()
            .then((res) => {
                if (res.status === 401)
                    this.props.history.push('/login');
                this.setState({rovers: res.data.result})
            });
    }


    render() {
        return (
            <div>
                <form>
                    <div className="form-group">
                        <label>Command:</label>
                        <textarea name="cmdStr" placeholder="command" value={this.state.cmdStr}
                                  onChange={this.onChange}/>
                    </div>
                    <div className="form-group">
                        <label>Command Result:</label>
                        <textarea contentEditable={false} name="result" placeholder="result" value={this.state.result}
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