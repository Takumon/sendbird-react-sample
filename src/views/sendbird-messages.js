import React, { useState, useEffect, useRef  } from 'react';
import { Link } from 'react-router-dom';
import history from '../history'
import SendBird from 'sendbird'
import SendBirdMessage from '../components/sendbird-message';
import {
  connect,
  deleteMessage,
  enterChannel,
  getMessage,
  getChannel,
  openChannel,
  sendMessage,
  updateMessage,
} from '../utils/sendbird';

const APP_ID = process.env.REACT_APP_APP_ID;
const CHANNEL_ID = process.env.REACT_APP_CHANNEL_ID;



export default function SendBirdMessages({ userId }) {
  if (!userId) {
    console.log('Please set userId');
    history.push('/login')
  }

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
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

      if(!unmounted) {
        setMessages(messages);
      }
    })();

    // clean up
    return () => unmounted = true;
  }, []);

  console.log(messages)

  return (
    <>
      <Link to='/login'>Logout</Link>
      <ul>
        {messages.map(m =>
          <SendBirdMessage
            m={m}
            viewerUserId={userId}
            updateFunc={updateFunc}
            deleteFunc={deleteFunc}
          />
        )}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
      />
      <button onClick={() => {
        registerFunc(newMessage);
        setNewMessage('');
      }}>SEND!</button>
    </>
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

