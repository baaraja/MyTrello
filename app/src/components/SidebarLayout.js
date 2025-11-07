import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Outlet, useNavigate, Link, useParams } from 'react-router-dom';
import authService from './auth/auth';

const SidebarLayout = ({ user }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const load = async () => {
      try {
        const ws = await authService.getWorkspaces();
        setWorkspaces(ws || []);
        const bs = await authService.getBoards();
        setBoards(bs || []);
      } catch (err) {
        console.error('Error loading sidebar data', err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (params && params.workspaceId) {
      setSelectedWorkspace(Number(params.workspaceId));
    } else if (!selectedWorkspace && workspaces.length) {
      setSelectedWorkspace(workspaces[0].workspaceId);
    }
    if (params && params.boardId && boards.length) {
      const bid = Number(params.boardId);
      setSelectedBoard(bid);
      const found = boards.find(b => Number(b.boardId) === bid);
      if (found) setSelectedWorkspace(found.workspaceId);
    }
  }, [workspaces, params]);

  useEffect(() => {
    if (params && params.boardId && boards.length) {
      const bid = Number(params.boardId);
      setSelectedBoard(bid);
      const found = boards.find(b => Number(b.boardId) === bid);
      if (found) setSelectedWorkspace(found.workspaceId);
    }
  }, [boards, params]);

  const boardsFor = (workspaceId) => boards.filter(b => b.workspaceId === workspaceId);

  return (
    <div style={{ display: 'flex', height: '100vh', gap: 16 }}>
      <aside style={{ width: 260, borderRight: '1px solid #eee', padding: 12, boxSizing: 'border-box' }}>
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <strong style={{ lineHeight: '28px' }}>Workspaces</strong>
          <Button variant="primary" onClick={() => navigate('/w/add')} style={{
              width: 20,
              height: 20,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1
            }}
            aria-label="Add workspace"
          >
            +
          </Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {workspaces.map(w => (
            <div key={w.workspaceId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ cursor: 'pointer', padding: '6px 8px', borderRadius: 4, background: selectedWorkspace === w.workspaceId ? '#f1f3f5' : 'transparent' }} onClick={() => { setSelectedWorkspace(w.workspaceId); navigate(`/w/${w.workspaceId}`); }}>
                {w.name}
              </div>
            </div>
          ))}
        </div>
        <hr />
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <strong style={{ lineHeight: '28px' }}>Boards</strong>
          <Button variant="primary" onClick={() => navigate('/b/add')} style={{
              width: 20,
              height: 20,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1
            }}
            aria-label="Add board"
          >
            +
          </Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {boardsFor(selectedWorkspace).map(b => (
            <div key={b.boardId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div
                style={{ cursor: 'pointer', padding: '6px 8px', borderRadius: 4, background: selectedBoard === b.boardId ? '#f1f3f5' : 'transparent' }}
                onClick={() => { setSelectedBoard(b.boardId); navigate(`/b/${b.boardId}`); }}
              >
                {b.name}
              </div>
            </div>
          ))}
        </div>
      </aside>
      <main style={{ flex: 1, padding: 12, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
