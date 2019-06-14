import React, { useState, useEffect, useRef  } from 'react';
import SendBird from 'sendbird'

const APP_ID = process.env.REACT_APP_APP_ID;
const USER_ID = process.env.REACT_APP_USER_ID;
const CHANNEL_ID = process.env.REACT_APP_CHANNEL_ID;

const uuid4 = () => {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = ((d + Math.random() * 16) % 16) | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

function Message({m, viewerUserId}) {
  const postUser = m.sender.userId === viewerUserId
    ? 'Mine'
    : m.sender.userId
  
  return <li>{postUser} : {m.message}</li>
}

function SendBirdMessage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [channel, setChannel] = useState(null);

  const query = useRef(null);
  let currentQuery = query.current;


  useEffect(() => {
    let unmounted = false;
    query.current = currentQuery;

    (async () => {
      const sb = new SendBird({appId: APP_ID});
      const user = await connect(sb, USER_ID);
      const openedChannel = await openChannel(sb, CHANNEL_ID);
      await enterChannel(openedChannel);
      setChannel(openedChannel);

      const EVENT_HANDLER_ID = uuid4();

      const ChannelHandler = new sb.ChannelHandler();
  
      ChannelHandler.onMessageReceived = (channel, message) => {
        console.log('onMessageReceived', channel, message);
        setMessages(msgs => msgs.concat([message]));
      };

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

  return (
    <>
      <ul>
        {messages.map(m =>
          <Message m={m} viewerUserId={m.sender.userId} />
        )}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
      />
      <button onClick={async () => {
        const message = await sendMessage(channel, newMessage);
        setMessages(msgs => msgs.concat([message]));
      }}>SEND!</button>
    </>
  );
}

export default SendBirdMessage;



async function connect(sb, userId) {
  return new Promise((resolve, reject) => {
    if(!sb) {
      reject(`Incollect argument. sb is required.`);
    }
    if(!userId) {
      reject(`Incollect argument. userId is required.`);
    }

    sb.connect(userId, (user, error) => {
      error
        ? reject(error)
        : resolve(user);
    });
  });
}

function openChannel(sb, channelId) {
  return new Promise((resolve, reject) => {
    if(!sb) {
      reject(`Incollect argument. sb is required.`);
    }
    if(!channelId) {
      reject(`Incollect argument. channelId is required.`);
    }

    sb.OpenChannel.getChannel(channelId, (openedChannel, error) => {
      error
        ? reject(error)
        : resolve(openedChannel);
    });
  });
}



function enterChannel(channel) {
  return new Promise((resolve, reject) => {
    if(!channel) {
      reject(`Incollect argument. channel is required.`);
    }

    channel.enter(function(response, error) {
      error
        ? reject(error)
        : resolve('OK!');
    })
  });
}

function sendMessage(channel, message) {
  return new Promise((resolve, reject) => {
    if(!channel) {
      reject(`Incollect argument. channel is required.`);
    }

    if(!message) {
      reject(`Incollect argument. message is required.`);
    }

    channel.sendUserMessage(message, (msg, error) => {
      error
        ? reject(error)
        : resolve(msg);
    });
  });
}

function getMessage(query) {
  return new Promise((resolve, reject) => {
    if(!query) {
      reject(`Incollect argument. query is required.`);
    }

    if (query.hasMore && !query.isLoading) {
      query.load(50, false, (messageList, error) => {
        error
          ? reject(error)
          : resolve(messageList);
      });
    } else {
      resolve([]);
    }
  });
}

