import React, { useState } from "react";
import axios from "axios";

function Register({ setShowRegister }) {
  const [form, setForm] = useState({});

  const handle = e => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const register = () => {
    axios.post("http://localhost:5000/register", form)
      .then(() => {
        alert("Registered Successfully");
        setShowRegister(false);
      })
      .catch(err => alert(err.response.data));
  };

  return (
    <div className="box">
      <h2>Student Registration</h2>
      {["name","mobile","college","branch","hostel","block","room","username","password"].map(field=>(
        <input
          key={field}
          name={field}
          placeholder={field}
          type={field==="password" ? "password" : "text"}
          onChange={handle}
        />
      ))}
      <button onClick={register}>Register</button>
    </div>
  );
}

export default Register;