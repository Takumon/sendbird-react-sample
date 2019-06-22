export const CUSTOM_MESSAGE_TYPE = {
  TEXT: 'TEXT',
  LINK: 'LINK',
  IMAGE: 'IMAGE',
  CHOICE: 'CHOICE',
  OTHER: 'OTHER',
};

/*
ModelとViewを用意する
いま考えられるのはこんな感じ
*/
const messageType = {
  type: CUSTOM_MESSAGE_TYPE,
  TEXT: {
      content: String,
  },
  LINK: {
      content: String,
      url: String,
  },
  IMAGE: {
      content: String,
      baseUrlData: String,
  },
  CHOICE: {
      question: String,
      select: [String],
  },
  ORIGINAL: {
      name: String,
  },
};


export function toCustom(m) {
  m.customMessage = JSON.parse(m.message);
  return m;
}

export function toOriginal(m) {
  const result = Object.assign({}, m);
  delete result.customMessage;
  return result;
}

export function createTextMessage(messageText) {
  return JSON.stringify({
    type: CUSTOM_MESSAGE_TYPE.TEXT,
    content: messageText,
  });
}
