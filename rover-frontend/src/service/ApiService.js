import axios from 'axios';

const USER_API_BASE_URL = 'http://localhost:8080';

class ApiService {

    fetchRoverInfos() {
        return axios.get(USER_API_BASE_URL + '/fetchRoverInfo');
    }

    fetchUserById(userId) {
        return axios.get(USER_API_BASE_URL + '/' + userId);
    }

    deleteUser(userId) {
        return axios.delete(USER_API_BASE_URL + '/' + userId);
    }

    getAccesAndRefreshTokens(user) {
        var params = new URLSearchParams();
        params.append("username", user.username);
        params.append("password", user.password);
        params.append("grant_type", "password");
        params.append("client_id", "clientIdPassword");

        return axios.post("" + USER_API_BASE_URL + '/oauth/token', {}, {
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

        return axios.post("" + USER_API_BASE_URL + '/oauth/token', {}, {
            auth: {
                username: 'clientIdPassword',
                password: 'secret'
            }, headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            params
        });
    }

    editUser(user) {
        return axios.put(USER_API_BASE_URL + '/' + user.id, user);
    }

    sendCommand(cmdStr) {
        const params = new URLSearchParams();
        params.append('commandStr', cmdStr);
        return axios.get(USER_API_BASE_URL + "/command", {
            params
        });
    }

}

export default new ApiService();