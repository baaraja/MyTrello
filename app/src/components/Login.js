import React, { useState } from 'react';
import { Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from './auth/auth';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { username } = await authService.login(email, password);
            console.log('Logged in as:', username);
            setUser(username);
            setShowSuccessToast(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage(error.response ? error.response.data.message : error.message);
            setShowErrorToast(true);
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '75vh' }}>
            <Form onSubmit={handleSubmit} style={{ width: '800px', fontSize: '1.5rem' }}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        style={{ fontSize: '1.5rem' }}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" style={{ marginTop: '20px' }}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        style={{ fontSize: '1.5rem' }}
                    />
                </Form.Group>

                <div className="d-flex justify-content-center" style={{ marginTop: '20px' }}>
                    <Button variant="primary" type="submit" className="mt-3 mb-3" style={{ width: '200px', fontSize: '1.25rem' }}>
                        Login
                    </Button>
                </div>

                <ToastContainer position="top-end" className="p-3">
                    <Toast onClose={() => setShowErrorToast(false)} show={showErrorToast} delay={5000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">Error</strong>
                        </Toast.Header>
                        <Toast.Body>{errorMessage}</Toast.Body>
                    </Toast>
                    <Toast onClose={() => setShowSuccessToast(false)} show={showSuccessToast} delay={5000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">Success</strong>
                        </Toast.Header>
                        <Toast.Body>Logged in successfully</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Form>
        </div>
    );
};

export default Login;
