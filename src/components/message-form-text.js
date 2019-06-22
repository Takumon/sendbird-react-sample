
import React, { useState } from 'react';
import styled from '@emotion/styled'
import {
  Input,
  Button,
} from 'antd';
import {
  createTextMessage,
} from '../utils/message-converter';

const Container = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: stretch;
`;

const SingleInputForm_Input = styled.div`
  flex-grow: 1;
`;

const SingleInputForm_Button = styled.div`

`;

export default function MessageFormText({ registerFunc }) {

  const [newMessage, setNewMessage] = useState('');

  return (
      <Container>
        <SingleInputForm_Input>
          <Input
            type="text"
            value={newMessage}
            placeholder="New message"
            onChange={e => setNewMessage(e.target.value)}
          />
        </SingleInputForm_Input>
        <SingleInputForm_Button>
          <Button
            onClick={() => {
              registerFunc(createTextMessage(newMessage));
              // clear input field
              setNewMessage('');
            }}
            type="primary"
          >SEND!</Button>
        </SingleInputForm_Button>
      </Container>
  );
}

