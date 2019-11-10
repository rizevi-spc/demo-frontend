import React, {Component} from 'react'
import ApiService from "../../service/ApiService";

class LoginComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            message: null,
            access_token: null,
            refresh_token: null
        }
        this.login = this.login.bind(this);
    }

    login = (e) => {
        e.preventDefault();
        let user = {username: this.state.username, password: this.state.password};
        ApiService.getAccesAndRefreshTokens(user)
            .then(res => {
                window.sessionStorage.setItem("username", this.state.username);
                window.sessionStorage.setItem("password", this.state.password);
                window.sessionStorage.setItem("accessToken", res.data.access_token);
                window.sessionStorage.setItem("refreshToken", res.data.refresh_token);
                this.setState({message: 'Login successfull.'});
                this.props.history.push('/');
                window.Toast.fire({
                    icon: 'success',
                    title: 'Signed in successfully'
                });
            }).catch(error => {
            var status = error.response.status;
            if (status === 500)
                window.Toast.fire({
                    icon: 'error',
                    title: error.response.data.message
                });
            else if (status === 400 || status === 401)
                window.Toast.fire({
                    icon: 'error',
                    title: 'Invalid user or password'
                });
        });
    }


    onChange = (e) =>
        this.setState({[e.target.name]: e.target.value});

    render() {
        return (
            <div>
                <h2 className="text-center">Researcher Login</h2>
                <form>
                    <div className="form-group">
                        <label>User Name:</label>
                        <input type="text" placeholder="username" name="username" className="form-control"
                               value={this.state.username} onChange={this.onChange}/>
                    </div>

                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" placeholder="password" name="password" className="form-control"
                               value={this.state.password} onChange={this.onChange}/>
                    </div>

                    <button className="btn btn-success" onClick={this.login}>Login</button>
                </form>
            </div>
        );
    }
}

export default LoginComponent;