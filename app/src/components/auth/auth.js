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

const createWorkspace = async (name, description) => {
    const token = localStorage.getItem('token');
    const response = await api.post('/w/create', { name, description }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const createBoard = async (name, description, workspaceId) => {
    const token = localStorage.getItem('token');
    const response = await api.post('/b/create', { name, description, workspaceId }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

const addUserToWorkspace = async (workspaceId, userId) => {
    const token = localStorage.getItem('token');
    const response = await api.put(`/w/addUser/${workspaceId}`, { userId }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

const addUserToBoard = async (boardId, userId) => {
    const token = localStorage.getItem('token');
    const response = await api.put(`/b/addUser/${boardId}`, { userId }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

const removeUserFromWorkspace = async (workspaceId, userId) => {
    const token = localStorage.getItem('token');
    const response = await api.put(`/w/removeUser/${workspaceId}`, { userId }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

const removeUserFromBoard = async (boardId, userId) => {
    const token = localStorage.getItem('token');
    const response = await api.put(`/b/removeUser/${boardId}`, { userId }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

const getWorkspaceMembers = async (workspaceId) => {
    const token = localStorage.getItem('token');
    const response = await api.get(`/w/members/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

const getBoardMembers = async (boardId) => {
    const token = localStorage.getItem('token');
    const response = await api.get(`/b/members/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

const getListsByBoard = async (boardId) => {
    const token = localStorage.getItem('token');
    const response = await api.get(`/l/board/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

const createList = async (name, boardId) => {
    const token = localStorage.getItem('token');
    const response = await api.post('/l/create', { name, boardId }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

const deleteList = async (listId) => {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/l/delete/${listId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

const deleteWorkspace = async (workspaceId) => {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/w/delete/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

const createCard = async (title, description, listId) => {
    const token = localStorage.getItem('token');
    const response = await api.post('/c/create', { title, description, listId }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

const deleteCard = async (cardId) => {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/c/delete/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

const deleteBoard = async (boardId) => {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/b/delete/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

const updateCard = async (cardId, data) => {
    const token = localStorage.getItem('token');
    const response = await api.put(`/c/update/${cardId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

const authService = {
    register,
    login,
    logout,
    getWorkspaces,
    getBoards,
    createWorkspace,
    createBoard,
    addUserToWorkspace,
    addUserToBoard,
    getWorkspaceMembers,
    getBoardMembers,
    getListsByBoard,
    createList,
    deleteList,
    createCard,
    deleteCard,
    updateCard,
    removeUserFromWorkspace,
    removeUserFromBoard,
    deleteWorkspace,
    deleteBoard,
};

export default authService;
