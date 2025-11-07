import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import Dash from './components/Dash';
import Workspace from './components/Workspace';
import Board from './components/Board';
import BoardView from './components/BoardView';
import SidebarLayout from './components/SidebarLayout';
import WorkspaceView from './components/WorkspaceView';

function App() {
    const [user, setUser] = useState(localStorage.getItem('username'));

    useEffect(() => {
        const storedUser = localStorage.getItem('username');
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <Router>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">MyTrello</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>
                        </Nav>
                        <Logout setUser={setUser} />
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container className="mt-3">
                <Routes>
                    <Route path="/" element={
                        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '75vh' }}>
                            <h1 style={{ fontSize: '5rem' }}>Welcome {user}!</h1>
                            {user ? (
                                <Link to={`/u/${user}/boards`} style={{ marginTop: '20px' }}>
                                    <button className="btn btn-primary" style={{ fontSize: '1.2rem' }}>Go to Dash</button>
                                </Link>
                            ) : (
                                <p style={{ marginTop: '20px', fontSize: '1.2rem' }}>Please login...</p>
                            )}
                        </div>
                    } />

                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/register" element={<Register />} />

                    {/* Routes rendered inside the sidebar layout */}
                    <Route element={<SidebarLayout user={user} />}>
                        <Route path="/u/:user/boards" element={<Dash user={user} />} />
                        <Route path="/b/:boardId" element={<BoardView user={user} />} />
                        <Route path="/w/:workspaceId" element={<WorkspaceView user={user} />} />
                        <Route path="/w/add" element={<Workspace user={user} />} />
                        <Route path="/b/add" element={<Board user={user} />} />
                    </Route>

                    <Route path="*" element={
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '75vh' }}>
                            <strong style={{ fontSize: '8rem' }}>
                                404 not found :(
                            </strong>
                        </div>} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
