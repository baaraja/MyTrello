import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ListGroup } from 'react-bootstrap';
import authService from './auth/auth';

const Dash = ({ user }) => {
    const [workspaces, setWorkspaces] = useState([]);
    const [boards, setBoards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchWorkspaces = async () => {
                try {
                    console.log('Fetching workspaces from authService');
                    const response = await authService.getWorkspaces();
                    console.log('API response (workspaces):', response);
                    setWorkspaces(response);
                } catch (error) {
                    console.error('Error fetching workspaces:', error);
                }
            };
            const fetchBoards = async () => {
                try {
                    console.log('Fetching boards from authService');
                    const response = await authService.getBoards();
                    console.log('API response (boards):', response);
                    setBoards(response);
                } catch (error) {
                    console.error('Error fetching boards:', error);
                }
            };
            fetchWorkspaces();
            fetchBoards();
        }
    }, [navigate]);

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <div>
            <h2 className="d-flex align-items-center">
                Workspaces
                <Button variant="primary" className="ms-2" onClick={() => navigate('/w/add')} style={{
                    fontSize: '1.5rem',
                    width: '25px',
                    height: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center' }}>
                    +
                </Button>
            </h2>
            {workspaces.length > 0 ? (
                <ListGroup>
                    {workspaces.map((workspace, index) => {
                        return (
                            <ListGroup.Item key={index} onClick={() => navigate(`/w/${workspace.name}`)}>
                                <strong>{capitalize(workspace.name)}</strong>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            ) : (
                <p>No workspaces found.</p>
            )}
            <h2 className="d-flex align-items-center" style={{ marginTop: '20px' }}>
                Boards
                <Button variant="primary" className="ms-2" onClick={() => navigate('/b/add')} style={{
                    fontSize: '1.5rem',
                    width: '25px',
                    height: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center' }}>
                    +
                </Button>
            </h2>
            {boards.length > 0 ? (
                <ListGroup>
                    {boards.map((board, index) => {
                        return (
                            <ListGroup.Item key={index} onClick={() => navigate(`/b/${board.name}`)}>
                                <strong>{capitalize(board.name)}</strong>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            ) : (
                <p>No boards found.</p>
            )}
        </div>
    );
}

export default Dash;
