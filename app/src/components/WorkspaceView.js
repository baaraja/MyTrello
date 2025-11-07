import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import authService from './auth/auth';

const WorkspaceView = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workspaceName, setWorkspaceName] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const bs = await authService.getBoards();
        const filtered = (bs || []).filter(b => String(b.workspaceId) === String(workspaceId));
        setBoards(filtered);
        try {
          const ws = await authService.getWorkspaces();
          const w = (ws || []).find(x => String(x.workspaceId) === String(workspaceId));
          if (w && w.name) setWorkspaceName(w.name);
        } catch (err) {
          console.debug('Could not resolve workspace name', err);
        }
      } catch (err) {
        console.error('Error loading boards for workspace', err);
      }
      setLoading(false);
    };
    if (workspaceId) load();
  }, [workspaceId]);

  if (loading) return <div>Loading boards…</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>{workspaceName}</h2>
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </div>
      {boards.length === 0 ? (
        <p>No boards found for this workspace.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {boards.map(b => (
            <div key={b.boardId} className="d-flex justify-content-between align-items-center" style={{ padding: '8px', border: '1px solid #eee', borderRadius: 6 }}>
              <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/b/${b.boardId}`)}>
                {b.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspaceView;
