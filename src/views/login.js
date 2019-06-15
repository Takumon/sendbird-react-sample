import React, { useState, useEffect, useRef  } from 'react';
import { Link } from 'react-router-dom';
import history from '../history'


export default function Login({ setUserId }) {
  const [userIdForm, setUserIdForm] = useState('');

  function login(_userId) {
    setUserId(_userId);
    history.push('/channel');
  }

  return (
    <>
      UserId : <input
        type="text"
        value={userIdForm}
        onChange={e => setUserIdForm(e.target.value)}
      />
      <button
        onClick={() => {
          login(userIdForm);
          setUserIdForm('');
        }}
      >LOGIN</button>
    </>
  );
}
