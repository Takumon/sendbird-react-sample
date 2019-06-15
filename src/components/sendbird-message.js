import React, { useState  } from 'react';

export default function Message({
  m,
  viewerUserId,
  updateFunc,
  deleteFunc
}) {
  const [updatedMessages, setUpdatedMessages] = useState('');
  const [editable, setEditable] = useState(false);

  console.log(m.sender.userId, viewerUserId)
  const postUser = m.sender.userId === viewerUserId
    ? 'Mine'
    : m.sender.userId;
    
  return (
    <li>
      { editable
        ? (
          <>
            {postUser} :
            <input
              type="text"
              value={updatedMessages}
              onChange={e => setUpdatedMessages(e.target.value)}
            />
            <button
              onClick={e => {
                setEditable(false);
                setUpdatedMessages('');
              }}
            >CANCEL</button>
            <button
              onClick={() => {
                updateFunc(m, updatedMessages);
                setEditable(false);
                setUpdatedMessages('');
              }}
            >UPDATE</button>
          </>
        )
        : (
          <>
            {postUser} : {m.message}
            <button onClick={e => {
              setEditable(true);
              setUpdatedMessages(m.message);
            }} >EDITE</button>
            <button onClick={() => deleteFunc(m)} >DELETE</button>
          </>
        )
      }
    </li>
  );
}
