import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ListGroup } from 'react-bootstrap';
import authService from './auth/auth';

const Dash = ({ user }) => {
    const [workspaces, setWorkspaces] = useState([]);
    const [boards, setBoards] = useState([]);
    const [inviting, setInviting] = useState(null);
    const [inviteUserId, setInviteUserId] = useState('');
    const [invitingBoard, setInvitingBoard] = useState(null);
    const [inviteBoardUserId, setInviteBoardUserId] = useState('');
    const [workspaceMembers, setWorkspaceMembers] = useState({});
    const [boardMembers, setBoardMembers] = useState({});
    const [hovered, setHovered] = useState(null);
    const [hoveredWorkspace, setHoveredWorkspace] = useState(null);
    const [hoveredBoard, setHoveredBoard] = useState(null);
    const [editingWorkspace, setEditingWorkspace] = useState(null);
    const [editingWorkspaceName, setEditingWorkspaceName] = useState('');
    const [editingBoard, setEditingBoard] = useState(null);
    const [editingBoardName, setEditingBoardName] = useState('');
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
            </h2>
            {workspaces.length > 0 ? (
                <ListGroup>
                    {workspaces.map((workspace, index) => {
                        return (
                            <React.Fragment key={workspace.workspaceId}>
                                <ListGroup.Item
                                    className="d-flex justify-content-between align-items-center"
                                    style={{ background: hoveredWorkspace === workspace.workspaceId ? '#f8d7da' : 'transparent' }}
                                    onMouseMove={(e) => {
                                        const el = document.elementFromPoint(e.clientX, e.clientY);
                                        if (!el) return;
                                        const overInteractive = el.closest && (el.closest('button') || el.closest('input') || el.closest('select') || el.closest('strong'));
                                        if (overInteractive) {
                                            if (hoveredWorkspace === workspace.workspaceId) setHoveredWorkspace(null);
                                            return;
                                        }
                                        if (hoveredWorkspace !== workspace.workspaceId) setHoveredWorkspace(workspace.workspaceId);
                                    }}
                                    onMouseLeave={() => setHoveredWorkspace(null)}
                                    onClick={async (e) => {
                                        const el = e.target;
                                        if (el.closest && (el.closest('button') || el.closest('strong') || el.closest('input') || el.closest('select'))) return;
                                        await authService.deleteWorkspace(workspace.workspaceId);
                                        const res = await authService.getWorkspaces();
                                        setWorkspaces(res);
                                    }}
                                >
                                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                        {editingWorkspace === workspace.workspaceId ? (
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                                                <input className="form-control form-control-sm" value={editingWorkspaceName} onChange={(e) => setEditingWorkspaceName(e.target.value)} style={{ width: 180 }} />
                                                <Button size="sm" variant="success" onClick={async (e) => { e.stopPropagation(); try { await authService.updateWorkspace(workspace.workspaceId, { name: editingWorkspaceName }); const res = await authService.getWorkspaces(); setWorkspaces(res); } catch (err) { console.error(err); } setEditingWorkspace(null); }}>Save</Button>
                                                <Button size="sm" variant="secondary" className="ms-2" onClick={(e) => { e.stopPropagation(); setEditingWorkspace(null); }}>{'Cancel'}</Button>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center' }} onClick={(e) => { e.stopPropagation(); navigate(`/w/${workspace.workspaceId}`); }}>
                                                <strong style={{ padding: '6px', borderRadius: 4 }}>{capitalize(workspace.name)}</strong>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        {inviting===workspace.workspaceId?(
                                            <span className="d-flex">
                                                <input type="number" className="form-control form-control-sm me-2" placeholder="userId" value={inviteUserId} onChange={e=>setInviteUserId(e.target.value)} />
                                                <Button size="sm" variant="success" onClick={async()=>{await authService.addUserToWorkspace(workspace.workspaceId,Number(inviteUserId));setInviting(null);setInviteUserId('');}}>OK</Button>
                                                <Button size="sm" variant="secondary" className="ms-2" onClick={()=>{setInviting(null);setInviteUserId('');}}>X</Button>
                                            </span>
                                        ):(
                                            <>
                                            <Button size="sm" variant="outline-primary" onClick={()=>{setInviting(workspace.workspaceId);}} style={{ background: '#ffffff', color: '#0d6efd', border: '1px solid #0d6efd' }}>Invite</Button>
                                            <Button size="sm" variant="light" className="ms-2" onClick={(e)=>{ e.stopPropagation(); setEditingWorkspace(workspace.workspaceId); setEditingWorkspaceName(workspace.name); }}>Edit</Button>
                                            <Button size="sm" variant="info" className="ms-2" onClick={async()=>{if(workspaceMembers[workspace.workspaceId]){setWorkspaceMembers(prev=>{const copy={...prev};delete copy[workspace.workspaceId];return copy;});}else{const res=await authService.getWorkspaceMembers(workspace.workspaceId);setWorkspaceMembers(prev=>({...prev,[workspace.workspaceId]:res}));}}}>Members</Button>
                                            </>
                                        )}
                                    </div>
                                </ListGroup.Item>
                                {workspaceMembers[workspace.workspaceId]&&(
                                    <ListGroup.Item className="ps-5">
                                        {workspaceMembers[workspace.workspaceId].map(u=>{
                                            const isHovered = hovered && hovered.type==='workspace' && hovered.parentId===workspace.workspaceId && hovered.memberId===u.id;
                                            return (
                                                <div key={u.id}
                                                    onMouseMove={(e) => {
                                                        const el = document.elementFromPoint(e.clientX, e.clientY);
                                                        if (!el) return;
                                                        if (el.closest && (el.closest('button') || el.closest('input') || el.closest('select') || el.closest('strong'))) {
                                                            return;
                                                        }
                                                        if (!isHovered) setHovered({type:'workspace',parentId:workspace.workspaceId,memberId:u.id});
                                                    }}
                                                    onMouseLeave={()=>{ if (isHovered) setHovered(null); }}
                                                    onClick={async(e)=>{ const el = e.target; if (el.closest && (el.closest('button') || el.closest('input') || el.closest('select') || el.closest('strong'))) return; await authService.removeUserFromWorkspace(workspace.workspaceId,u.id);const res=await authService.getWorkspaceMembers(workspace.workspaceId);setWorkspaceMembers(prev=>({...prev,[workspace.workspaceId]:res}));}}
                                                    style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px',borderRadius:4,background:isHovered?'#f8d7da':'transparent',cursor:'pointer'}}>
                                                    <div>{u.username} ({u.email})</div>
                                                    <div style={{color:isHovered?'#721c24':'transparent',fontWeight:700}}>Remove</div>
                                                </div>
                                            )
                                        })}
                                    </ListGroup.Item>
                                )}
                            </React.Fragment>
                        );
                    })}
                </ListGroup>
            ) : (
                <p>No workspaces found.</p>
            )}
            <h2 className="d-flex align-items-center" style={{ marginTop: '20px' }}>
                Boards
            </h2>
            {boards.length > 0 ? (
                <ListGroup>
                    {boards.map((board, index) => {
                        return (
                            <React.Fragment key={board.boardId}>
                                <ListGroup.Item
                                    className="d-flex justify-content-between align-items-center"
                                    style={{ background: hoveredBoard === board.boardId ? '#f8d7da' : 'transparent' }}
                                    onMouseMove={(e) => {
                                        const el = document.elementFromPoint(e.clientX, e.clientY);
                                        if (!el) return;
                                        const overInteractive = el.closest && (el.closest('button') || el.closest('input') || el.closest('select') || el.closest('strong'));
                                        if (overInteractive) {
                                            if (hoveredBoard === board.boardId) setHoveredBoard(null);
                                            return;
                                        }
                                        if (hoveredBoard !== board.boardId) setHoveredBoard(board.boardId);
                                    }}
                                    onMouseLeave={() => setHoveredBoard(null)}
                                    onClick={async (e) => {
                                        const el = e.target;
                                        if (el.closest && (el.closest('button') || el.closest('strong') || el.closest('input') || el.closest('select'))) return;
                                        await authService.deleteBoard(board.boardId);
                                        const res = await authService.getBoards();
                                        setBoards(res);
                                    }}
                                >
                                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                        {editingBoard === board.boardId ? (
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                                                <input className="form-control form-control-sm" value={editingBoardName} onChange={(e) => setEditingBoardName(e.target.value)} style={{ width: 180 }} />
                                                <Button size="sm" variant="success" onClick={async (e) => { e.stopPropagation(); try { await authService.updateBoard(board.boardId, { name: editingBoardName }); const res = await authService.getBoards(); setBoards(res); } catch (err) { console.error(err); } setEditingBoard(null); }}>Save</Button>
                                                <Button size="sm" variant="secondary" className="ms-2" onClick={(e) => { e.stopPropagation(); setEditingBoard(null); }}>{'Cancel'}</Button>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center' }} onClick={(e) => { e.stopPropagation(); navigate(`/b/${board.boardId}`); }}>
                                                <strong style={{ padding: '6px', borderRadius: 4 }}>{capitalize(board.name)}</strong>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        {invitingBoard===board.boardId?(
                                            <span className="d-flex">
                                                <input type="number" className="form-control form-control-sm me-2" placeholder="userId" value={inviteBoardUserId} onChange={e=>setInviteBoardUserId(e.target.value)} />
                                                <Button size="sm" variant="success" onClick={async()=>{await authService.addUserToBoard(board.boardId,Number(inviteBoardUserId));setInvitingBoard(null);setInviteBoardUserId('');}}>OK</Button>
                                                <Button size="sm" variant="secondary" className="ms-2" onClick={()=>{setInvitingBoard(null);setInviteBoardUserId('');}}>X</Button>
                                            </span>
                                        ):(
                                            <>
                                            <Button size="sm" variant="outline-primary" onClick={()=>{setInvitingBoard(board.boardId);}} style={{ background: '#ffffff', color: '#0d6efd', border: '1px solid #0d6efd' }}>Invite</Button>
                                            <Button size="sm" variant="light" className="ms-2" onClick={(e)=>{ e.stopPropagation(); setEditingBoard(board.boardId); setEditingBoardName(board.name); }}>Edit</Button>
                                            <Button size="sm" variant="info" className="ms-2" onClick={async()=>{if(boardMembers[board.boardId]){setBoardMembers(prev=>{const copy={...prev};delete copy[board.boardId];return copy;});}else{const res=await authService.getBoardMembers(board.boardId);setBoardMembers(prev=>({...prev,[board.boardId]:res}));}}}>Members</Button>
                                            </>
                                        )}
                                    </div>
                                </ListGroup.Item>
                                {boardMembers[board.boardId]&&(
                                    <ListGroup.Item className="ps-5">
                                        {boardMembers[board.boardId].map(u=>{
                                            const isHovered = hovered && hovered.type==='board' && hovered.parentId===board.boardId && hovered.memberId===u.id;
                                            return (
                                                <div key={u.id}
                                                    onMouseMove={(e) => {
                                                        const el = document.elementFromPoint(e.clientX, e.clientY);
                                                        if (!el) return;
                                                        if (el.closest && (el.closest('button') || el.closest('input') || el.closest('select') || el.closest('strong'))) {
                                                            return;
                                                        }
                                                        if (!isHovered) setHovered({type:'board',parentId:board.boardId,memberId:u.id});
                                                    }}
                                                    onMouseLeave={()=>{ if (isHovered) setHovered(null); }}
                                                    onClick={async(e)=>{ const el = e.target; if (el.closest && (el.closest('button') || el.closest('input') || el.closest('select') || el.closest('strong'))) return; await authService.removeUserFromBoard(board.boardId,u.id);const res=await authService.getBoardMembers(board.boardId);setBoardMembers(prev=>({...prev,[board.boardId]:res}));}}
                                                    style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px',borderRadius:4,background:isHovered?'#f8d7da':'transparent',cursor:'pointer'}}>
                                                    <div>{u.username} ({u.email})</div>
                                                    <div style={{color:isHovered?'#721c24':'transparent',fontWeight:700}}>Remove</div>
                                                </div>
                                            )
                                        })}
                                    </ListGroup.Item>
                                )}
                            </React.Fragment>
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
