import axios from 'axios';

export const getAuthToken = async () => {
    let token = localStorage.getItem('jwtToken');
    if (!token) {
        token = await refreshAuthToken();
    } else {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (Date.now() >= payload.exp * 1000) {
            token = await refreshAuthToken();
        }
    }
    // console.log("token: ", token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return token;
};

const refreshAuthToken = async () => {
    try {
        const response = await axios.post('http://localhost:3000/login', { username: 'admin', password: 'password' });
        const newToken = response.data.token;
        localStorage.setItem('jwtToken', newToken);
        return newToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};
