import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard({ user, setUser }) {
  const [category, setCategory] = useState("Water");
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);

  const load = () => {
    axios.get(`http://localhost:5000/all/${user.id}/${user.role}`)
      .then(res => setData(res.data));
  };

  useEffect(() => { load(); }, []);

  const submit = () => {
    axios.post("http://localhost:5000/add", {
      userId: user.id,
      category,
      description
    }).then(() => {
      setDescription("");
      load();
    });
  };

  const resolve = (id) => {
    axios.put(`http://localhost:5000/update/${id}`)
      .then(load);
  };

  return (
    <div className="box">
      <h2>Welcome {user.name} ({user.role})</h2>
      <button onClick={()=>setUser(null)}>Logout</button>

      {/* STUDENT ONLY */}
      {user.role === "student" && (
        <>
          <select onChange={e=>setCategory(e.target.value)}>
            <option>Water</option>
            <option>Electricity</option>
            <option>Room</option>
            <option>Lift</option>
            <option>Food</option>
            <option>Other</option>
          </select>

          <input
            placeholder="Complaint description"
            value={description}
            onChange={e=>setDescription(e.target.value)}
          />

          <button onClick={submit}>Submit</button>
        </>
      )}

      {/* COMPLAINT LIST */}
      <h3>Complaints</h3>
      {data.map(c => (
        <div key={c.id}>
          {user.role === "admin"
            ? `${c.name} (Room ${c.room}) - ${c.category} - ${c.description}`
            : `${c.category} - ${c.description}`
          }
          {" "} - {c.status}

          {user.role === "admin" && c.status === "Pending" && (
            <button onClick={() => resolve(c.id)}>Resolve</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;