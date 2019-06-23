
import React from 'react';
import Carousel from './carousel';

export default function FlightTicketListView({ m, registerFunc }) {

  const {
    title,
    contents,
  } = m.customMessage;

  console.log(contents);

  return (
    <>
      <div>{title}</div>
      <Carousel
        registerFunc={registerFunc}
        contents={contents}
      />
    </>
  );
}
