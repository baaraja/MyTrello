import React, { useState } from 'react';
import { Button, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from './auth/auth';

const Logout = ({ setUser }) => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        setShowToast(true);
        navigate('/login');
    };

    return (
        <div>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
            <ToastContainer position="top-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Success</strong>
                    </Toast.Header>
                    <Toast.Body>Logged out successfully</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}

export default Logout;
