import React, { useState, useEffect, useRef  } from 'react';
import SendBird from 'sendbird'

const APP_ID = process.env.REACT_APP_APP_ID;
const USER_ID = process.env.REACT_APP_USER_ID;
const CHANNEL_ID = process.env.REACT_APP_CHANNEL_ID;

function SendBirdMessage() {
  const [messages, setMessages] = useState([]);
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
    <ul>
      {messages.map(m => <li>{m.message}</li>)}
    </ul>
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

