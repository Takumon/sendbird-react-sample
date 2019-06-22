import React, { useState  } from 'react';
import Text from '../messages/text.view';
import {
  toCustom,
  CUSTOM_MESSAGE_TYPE,
} from '../utils/message-converter';
export default function SendBirdMessage({
  m,
  viewerUserId,
  updateFunc,
  deleteFunc
}) {
  const [updatedMessages, setUpdatedMessages] = useState('');
  const [editable, setEditable] = useState(false);

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
            <MessageRapper
              m={m}
              viewerUserId={viewerUserId}
            />
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


function MessageRapper({
  m,
  viewerUserId,
}) {
  const message = toCustom(m)
  switch(message.customMessage.type) {
    case CUSTOM_MESSAGE_TYPE.TEXT:
      return <Text m={message} />
    case CUSTOM_MESSAGE_TYPE.LINK:
      // 型チェック
      // TODO
      break;
    case CUSTOM_MESSAGE_TYPE.IMAGE:
      // 型チェック
      // TODO
      break;
    case CUSTOM_MESSAGE_TYPE.CHOICE:
      // 型チェック
      // TODO
      break;
    case CUSTOM_MESSAGE_TYPE.ORIGINAL:
      // 型チェック
      // TODO
      break;
    default:
      // return (
      //   <Text m ={{
      //     type: CUSTOM_MESSAGE_TYPE.TEXT,
      //     message: JSON.stringify({
      //       content: m.message,
      //     }),
      //   }} />
      // );
      throw new Error(`Invalid message type = ${m.type}`)
  }
}
