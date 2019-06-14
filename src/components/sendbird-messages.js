import React, { useState, useEffect, useRef  } from 'react';
import SendBird from 'sendbird'
import SendBirdMessage from './sendbird-message';

const APP_ID = process.env.REACT_APP_APP_ID;
const USER_ID = process.env.REACT_APP_USER_ID;
const CHANNEL_ID = process.env.REACT_APP_CHANNEL_ID;



export default function SendBirdMessage() {
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
      const user = await connect(sb, USER_ID);
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
      <ul>
        {messages.map(m =>
          <SendBirdMessage
            m={m}
            viewerUserId={m.sender.userId}
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




function connect(sb, userId) {
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

function updateMessage(channel, message, messageText) {
  return new Promise((resolve, reject) => {
    if(!channel) {
      reject(`Incollect argument. channel is required.`);
    }

    if(!message) {
      reject(`Incollect argument. message is required.`);
    }

    if(!messageText) {
      reject(`Incollect argument. messageText is required.`);
    }

    channel.updateUserMessage(
      message.messageId,
      messageText,
      message.data,
      message.customType,
      (msg, error) => {
        error
          ? reject(error)
          : resolve(msg);
      }
    );
  });
}


function deleteMessage(channel, message) {
  return new Promise((resolve, reject) => {
    if(!channel) {
      reject(`Incollect argument. channel is required.`);
    }

    if(!message) {
      reject(`Incollect argument. message is required.`);
    }

    channel.deleteMessage(Object.assign({}, message), (res, error) => {
      error
        ? reject(error)
        : resolve('OK');
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

function uuid4() {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = ((d + Math.random() * 16) % 16) | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

