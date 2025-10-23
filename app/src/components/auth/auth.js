import api from '../../api/axios';

const register = async (username, email, password) => {
    const response = await api.post('/u/signup', { username, email, password });
    return response.data;
};

const login = async (email, password) => {
    const response = await api.post('/u/signin', { email, password });
    console.log('Login response:', response.data);
    const { access_token, username } = response.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('username', username);
    return { access_token, username };
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
};

const getWorkspaces = async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/w/workspaces', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const getBoards = async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/b/boards', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

const authService = {
    register,
    login,
    logout,
    getWorkspaces,
    getBoards,
};

export default authService;
