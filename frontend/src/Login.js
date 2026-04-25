import React, { useState } from "react";
import axios from "axios";

function Login({ setUser, setShowRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    axios.post("http://localhost:5000/login", { username, password })
      .then(res => setUser(res.data))
      .catch(() => alert("Invalid Login"));
  };

  return (
    <div className="box">
      <h2>Student Login</h2>
      <input placeholder="Username" onChange={e=>setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
      <p onClick={()=>setShowRegister(true)}>New Student? Register</p>
    </div>
  );
}

export default Login;