import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  if (user) return <Dashboard user={user} setUser={setUser} />;

  return showRegister
    ? <Register setShowRegister={setShowRegister} />
    : <Login setUser={setUser} setShowRegister={setShowRegister} />;
}

export default App;