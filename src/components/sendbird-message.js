import React, { useState  } from 'react';
import styled from '@emotion/styled'
import { 
  Button,
  Input,
} from 'antd';
import Text from '../messages/text.view';
import {
  toCustom,
  createTextMessage,
  CUSTOM_MESSAGE_TYPE,
} from '../utils/message-converter';


const Container = styled.div`
  display: flex;
  align-items: stretch;
`;


const AvatorArea = styled.div`
  width: 36px;
  border-radius: 16px;
  border: 1px solid gray;
  overflow: hidden;
  margin-right: 1rem;
`;

const MessageArea = styled.div`
  flex-grow: 1;
  margin-right: 1rem;
`;

const ButtonArea = styled.div`
`;

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
      <Container>
        <AvatorArea>
          {postUser}
        </AvatorArea>
        {editable
          ? (<>
            <MessageArea>
              <Input
                type="text"
                value={updatedMessages}
                onChange={e => setUpdatedMessages(e.target.value)}
              />
            </MessageArea>
            <ButtonArea>
              <Button
                onClick={e => {
                  setEditable(false);
                  setUpdatedMessages('');
                }}
              >CANCEL</Button>
              <Button
                onClick={() => {
                  // TODO タイプごとに汎用化
                  updateFunc(m, createTextMessage(updatedMessages));
                  setEditable(false);
                  setUpdatedMessages('');
                }}
              >UPDATE</Button>
            </ButtonArea>
          </>)
          : (<>
            <MessageArea>
              <CustomMessage
                m={m}
                viewerUserId={viewerUserId}
              />
            </MessageArea>
            <ButtonArea>
              <Button
                onClick={e => {
                  setEditable(true);
                  setUpdatedMessages(m.customMessage.content);
                }} 
              >EDITE</Button>
              <Button
                onClick={() => deleteFunc(m)}
                type="danger"
              >DELETE</Button>
            </ButtonArea>
          </>)
        }
      </Container>
  );
}


function CustomMessage({
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
