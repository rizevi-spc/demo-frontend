import axios from 'axios';

const SECURE_API_BASE_URL = 'http://localhost:8080/api';
const API_BASE_URL = 'http://localhost:8080';

class ApiService {

    fetchRoverInfos(accessToken) {
        return axios.get(SECURE_API_BASE_URL + '/fetchRoverInfo', {headers: {"Authorization": 'Bearer '+accessToken}});
    }

    getAccesAndRefreshTokens(user) {
        var params = new URLSearchParams();
        params.append("username", user.username);
        params.append("password", user.password);
        params.append("grant_type", "password");
        params.append("client_id", "clientIdPassword");

        return axios.post("" + API_BASE_URL + '/oauth/token', {}, {
            auth: {
                username: 'clientIdPassword',
                password: 'secret'
            }, headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            params
        });
    }

    getAccesTokenFromRefreshToken(refreshToken) {
        var params = new URLSearchParams();
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", refreshToken);

        return axios.post("" + API_BASE_URL + '/oauth/token', {}, {
            auth: {
                username: 'clientIdPassword',
                password: 'secret'
            }, headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            params
        });
    }


    sendCommand(cmdStr, accessToken) {
        const params = new URLSearchParams();
        params.append('commandStr', cmdStr);
        return axios.get(SECURE_API_BASE_URL + "/command", {
            params, headers: {"Authorization": 'Bearer '+accessToken}
        });
    }

}

export default new ApiService();