import React from 'react';

export default function Text({ m }) {
  console.log(m);
  return <div>{m.sender.userId} : {m.customMessage.content}</div>;
}
