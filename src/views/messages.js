import React, { useState, useEffect, useRef  } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled'
import history from '../history'
import {
  Layout,
  Button,
} from 'antd';
import SendBird from 'sendbird'
import SendBirdMessage from '../components/sendbird-message';
import {
  connect,
  deleteMessage,
  enterChannel,
  getMessage,
  getChannel,
  openChannel,
  updateMessage,
  sendMessage,
} from '../utils/sendbird';

import {
  MessageTextFormCreate,
  MessageLinkFormCreate,
  MessageImageFormCreate,
  MessageConfirmationCreate,
  MessageFlightTicketListCreate,
} from '../custom-messages';

const { Header, Content, Footer } = Layout;

const APP_ID = process.env.REACT_APP_APP_ID;
const CHANNEL_ID = process.env.REACT_APP_CHANNEL_ID;

const Container = styled.div`
  padding: 12px;
`;

const HeaderTitle = styled.div`
  color: white;
  font-size: 36px;
  float: left;
`;
const MessageArea = styled.div`
  div {
    margin-bottom: 4px;
  }
  
`;

const SingleInputForm = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: stretch;
`;

const SingleInputForm_Input = styled.div`
  flex-grow: 1;
`;

const SingleInputForm_Button = styled.div`

`;

const SingleInputForm_Button = styled.div`

`;

export default function Messages({ userId }) {
  if (!userId) {
    console.log('Please set userId');
    history.push('/login')
  }

  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState(null);

  const query = useRef(null);
  let currentQuery = query.current;


  async function registerFunc(messageText) {
    const registeredMessage = await sendMessage(channel, messageText);
    addMessageInModel(registeredMessage);
  }

  async function updateFunc(message, messageText) {
    const updatedMessage = await updateMessage(channel, message, messageText);
    updateMessageInModel(updatedMessage);
  }

  async function deleteFunc(message) {
    await deleteMessage(channel, message);
    // TODO deleteイベントが自分のブラウザでも発生してまう問題の調査
    deleteMessageInModel(message.messageId);
  }

  // Model Operations
  function addMessageInModel(newOne) {
    setMessages(msgs => {
      let targetIndex = null;

      for (const index in msgs) {
        if (msgs[index].messageId == newOne.messageId) {
          targetIndex = Number(index);  // index is string
          break;
        }
      }

      return targetIndex === null
        ? [
          ...msgs,
          newOne,
        ]
        : msgs;
    });
  }

  function updateMessageInModel(updatedOne) {
    setMessages(msgs => {
      let targetIndex;
      for (const index in msgs) {
        if (msgs[index].messageId === updatedOne.messageId) {
          targetIndex = Number(index); // index is string
          break;
        }
      }

      return targetIndex === null
        ? msgs
        : [
          ...msgs.slice(0, targetIndex),
          updatedOne,
          ...msgs.slice(targetIndex + 1)
        ];
    });
  }

  function deleteMessageInModel(deletedMessageId) {
    setMessages(msgs => {
      let targetIndex = null;

      for (const index in msgs) {
        if (msgs[index].messageId == deletedMessageId) {
          targetIndex = Number(index);  // index is string
          break;
        }
      }

      return targetIndex === null
        ? msgs
        : [
          ...msgs.slice(0, targetIndex),
          ...msgs.slice(targetIndex + 1)
        ];
    })
  }


  useEffect(() => {
    let unmounted = false;
    query.current = currentQuery;

    (async () => {
      const sb = new SendBird({appId: APP_ID});
      const user = await connect(sb, userId);
      const openedChannel = await openChannel(sb, CHANNEL_ID);
      await enterChannel(openedChannel);
      setChannel(openedChannel);

      const EVENT_HANDLER_ID = uuid4();

      const ChannelHandler = new sb.ChannelHandler();
  

      // Add event handlers for sync in other browser
      ChannelHandler.onMessageReceived = (_, message) => addMessageInModel(message);
      ChannelHandler.onMessageUpdated = (_, message) => updateMessageInModel(message);
      ChannelHandler.onMessageDeleted = (_, messageId) => deleteMessageInModel(messageId);
      sb.addChannelHandler(EVENT_HANDLER_ID, ChannelHandler);


      if (!query.current) {
        query.current = openedChannel.createPreviousMessageListQuery();
      }
      const messages = await getMessage(query.current);

      console.log(messages)
      if(!unmounted && messages) {
        setMessages(messages);
      }
    })();

    // clean up
    return () => unmounted = true;
  }, []);


  return (
    <Layout>
      <Header>
        <HeaderTitle>
          Message
        </HeaderTitle>
        <Link to='/login'>
          <Button>
            Logout
          </Button>
        </Link>
      </Header>
      <Content>
        <Container>
          <MessageArea>
            {messages.map(m =>
              <SendBirdMessage
                m={m}
                key={m.messageId}
                viewerUserId={userId}
                updateFunc={updateFunc}
                deleteFunc={deleteFunc}
              />
            )}
          </MessageArea>
          <MessageTextFormCreate
            registerFunc={registerFunc}
          />
          <MessageLinkFormCreate
            registerFunc={registerFunc}
          />
          <MessageImageFormCreate
            registerFunc={registerFunc}
          />
          <MessageConfirmationCreate
            registerFunc={registerFunc}
          />
          <MessageFlightTicketListCreate
            registerFunc={registerFunc}
          />
        </Container>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}


function uuid4() {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = ((d + Math.random() * 16) % 16) | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

