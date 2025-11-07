import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from './auth/auth';

const Board = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [workspaceId, setWorkspaceId] = useState('');
    const [workspaces, setWorkspaces] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetch = async () => {
            const res = await authService.getWorkspaces();
            setWorkspaces(res);
        };
        fetch();
    }, []);
    const handleSubmit = async e => {
        e.preventDefault();
        await authService.createBoard(name, description, Number(workspaceId));
        const user = localStorage.getItem('username');
        navigate(user ? `/u/${user}/boards` : '/');
    };
    return (
        <div className="d-flex justify-content-center">
            <Form onSubmit={handleSubmit} style={{ width: '600px' }}>
                <Form.Group>
                    <Form.Label>Nom du board</Form.Label>
                    <Form.Control value={name} onChange={e => setName(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mt-3">
                    <Form.Label>Workspace</Form.Label>
                    <Form.Select value={workspaceId} onChange={e => setWorkspaceId(e.target.value)} required>
                        <option value="">Sélectionne un workspace</option>
                        {workspaces.map(ws => (
                            <option key={ws.workspaceId} value={ws.workspaceId}>{ws.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mt-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control value={description} onChange={e => setDescription(e.target.value)} />
                </Form.Group>
                <div className="mt-3">
                    <Button type="submit">Créer board</Button>
                </div>
            </Form>
        </div>
    );
};

export default Board;
