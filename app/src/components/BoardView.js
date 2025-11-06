import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Form, Col, Row } from 'react-bootstrap';
import authService from './auth/auth';

// Reformatted for readability only — no behavioral changes.
const BoardView = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

  const [hoveredList, setHoveredList] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);

  const fetch = async () => {
    const res = await authService.getListsByBoard(Number(boardId));
    setLists(res || []);

    const m = await authService.getBoardMembers(Number(boardId));
    setMembers(m || []);
  };

  useEffect(() => {
    if (!boardId) {
      navigate('/');
      return;
    }
    fetch();
  }, [boardId]);

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newListName) return;
    await authService.createList(newListName, Number(boardId));
    setNewListName('');
    fetch();
  };

  const handleAddCard = async (listId, title) => {
    if (!title) return;
    await authService.createCard(title, '', listId);
    fetch();
  };

  const handleDeleteList = async (listId) => {
    await authService.deleteList(listId);
    fetch();
  };

  const handleAssign = async (cardId, userId) => {
    await authService.updateCard(cardId, { userId: Number(userId) });
    fetch();
  };

  const handleDeleteCard = async (cardId) => {
    await authService.deleteCard(cardId);
    fetch();
  };

  const onDragStart = (e, cardId) => {
    e.dataTransfer.setData('text/plain', cardId);
  };

  const onDragOver = (e) => e.preventDefault();

  const onDrop = async (e, toListId) => {
    e.preventDefault();
    const cardId = Number(e.dataTransfer.getData('text/plain'));
    if (!cardId) return;
    await authService.updateCard(cardId, { listId: toListId });
    fetch();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Board {boardId}</h2>

        <div>
          <Button
            variant="info"
            className="me-2"
            onClick={async () => {
              if (showMembers) {
                setShowMembers(false);
              } else {
                const m = await authService.getBoardMembers(Number(boardId));
                setMembers(m || []);
                setShowMembers(true);
              }
            }}
          >
            Members
          </Button>

          <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
        </div>
      </div>

      {showMembers && (
        <div className="mb-3">
          {members.map((m) => {
            const isHovered = hoveredMember === m.id;
            return (
              <div
                key={m.id}
                onMouseEnter={() => setHoveredMember(m.id)}
                onMouseLeave={() => setHoveredMember(null)}
                onClick={async () => {
                  await authService.removeUserFromBoard(Number(boardId), m.id);
                  const m2 = await authService.getBoardMembers(Number(boardId));
                  setMembers(m2 || []);
                }}
                className="d-flex justify-content-between align-items-center mb-1"
                style={{ padding: 6, borderRadius: 4, background: isHovered ? '#f8d7da' : 'transparent', cursor: 'pointer' }}
              >
                <div>{m.username} ({m.email})</div>
                <div style={{ color: isHovered ? '#721c24' : 'transparent', fontWeight: 700 }}>Remove</div>
              </div>
            );
          })}
        </div>
      )}

      <Form onSubmit={handleAddList} className="mb-3 d-flex">
        <Form.Control
          placeholder="New list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <Button type="submit" className="ms-2">Add</Button>
      </Form>

      <Row className="g-3" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {lists.map((list) => (
          <Col key={list.listId} style={{ display: 'inline-block', verticalAlign: 'top', width: 300 }}>
            <Card
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, list.listId)}
              style={{ background: hoveredList === list.listId ? '#f8d7da' : 'transparent' }}
            >
              <Card.Body>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 6, borderRadius: 4 }}>
                  <Card.Title
                    className="mb-0"
                    onMouseEnter={() => setHoveredList(list.listId)}
                    onMouseLeave={() => setHoveredList(null)}
                    onClick={async () => { await handleDeleteList(list.listId); }}
                    style={{ cursor: 'pointer', background: hoveredList === list.listId ? '#f8d7da' : 'transparent', padding: '6px', borderRadius: 4 }}
                  >
                    {list.name}
                  </Card.Title>

                  <div style={{ color: hoveredList === list.listId ? '#721c24' : 'transparent', fontWeight: 700 }} />
                </div>

                {list.cards.map((card) => (
                  <div key={card.cardId}
                    draggable
                    onDragStart={e=>onDragStart(e,card.cardId)}
                    className="mb-2 border rounded"
                    style={{cursor:'pointer',background:hoveredCard===card.cardId?'#f8d7da':'#ffffff',height:36,padding:'8px',boxSizing:'border-box',display:'flex',alignItems:'center',overflow:'hidden'}}>
                    <div className="d-flex justify-content-between" style={{alignItems:'center',width:'100%'}}>
                      <div
                        onClick={async()=>{await handleDeleteCard(card.cardId)}}
                        onMouseEnter={()=>setHoveredCard(card.cardId)}
                        onMouseLeave={()=>setHoveredCard(null)}
                        style={{background:hoveredCard===card.cardId?'#f8d7da':'transparent'}}
                      >
                        {card.title}
                      </div>

                      <div className="d-flex align-items-center" style={{ height: '100%' }}>
                        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', overflow: 'visible' }} onClick={(e) => e.stopPropagation()}>
                          <div className="btn btn-light d-flex align-items-center" style={{ height: '100%', padding: '0 12px', borderRadius: '0 6px 6px 0', background: '#f1f3f5', border: '1px solid #e9ecef', color: '#212529', display: 'flex', justifyContent: 'center', minWidth: 200, marginRight: -41, lineHeight: 3 }}>
                            {members.find((m) => m.id === card.userId)?.username || 'Unassigned'}
                          </div>

                          <select
                            value={card.userId || ''}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => { e.stopPropagation(); handleAssign(card.cardId, e.target.value); }}
                            style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', border: 'none', background: 'transparent' }}
                          >
                            <option value="">Unassigned</option>
                            {members.map((m) => (
                              <option key={m.id} value={m.id}>{m.username}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ color: hoveredCard === card.cardId ? '#721c24' : 'transparent', fontWeight: 700, display: 'flex', alignItems: 'center', marginLeft: 8 }}>Del</div>
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{ background: 'transparent', paddingTop: 0, paddingBottom: 0 }}>
                  <AddCardInline onAdd={(title) => handleAddCard(list.listId, title)} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const AddCardInline = ({ onAdd }) => {
  const [val, setVal] = useState('');

  return (
    <div className="d-flex mt-0 align-items-center" onClick={(e) => e.stopPropagation()} style={{ width: '100%', gap: 8 }}>
      <input
        className="form-control form-control-sm"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        placeholder="Card title"
        style={{ width: '100%', background: '#ffffff', borderRadius: 6, padding: '4px 8px', boxSizing: 'border-box', height: 32 }}
      />

      <Button size="sm" className="ms-2" onClick={(e) => { e.stopPropagation(); onAdd(val); setVal(''); }}>Add</Button>
    </div>
  );
};

export default BoardView;
