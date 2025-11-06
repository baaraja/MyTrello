import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from './auth/auth';

const Workspace = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async e => {
        e.preventDefault();
        await authService.createWorkspace(name, description);
        navigate('/');
    };
    return (
        <div className="d-flex justify-content-center">
            <Form onSubmit={handleSubmit} style={{ width: '600px' }}>
                <Form.Group>
                    <Form.Label>Nom du workspace</Form.Label>
                    <Form.Control value={name} onChange={e => setName(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mt-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control value={description} onChange={e => setDescription(e.target.value)} />
                </Form.Group>
                <div className="mt-3">
                    <Button type="submit">Créer workspace</Button>
                </div>
            </Form>
        </div>
    );
};

export default Workspace;
