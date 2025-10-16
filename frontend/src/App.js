import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [age,setAge] = useState("");
  const [editingId, setEditingId] = useState(null);

  // get all users
  const fetchUsers = () => {
    axios.get('http://127.0.0.1:5000/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error("GET /users error:", err));
  }

  useEffect(()=>{
    fetchUsers();
  },[]);

  
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  
  const isValidAge = (age) => {
    return /^\d+$/.test(age) && Number(age) > 0;
  }

  
  const saveUser = () => {
    if(!name || !email || !age) return alert("Fill all fields!");
    if(!isValidEmail(email)) return alert("Invalid email format!");
    if(!isValidAge(age)) return alert("Age must be a  number!");

    if(editingId === null){
      // Create
      axios.post('http://127.0.0.1:5000/users', {name,email,age})
        .then(res => {
          setName(""); setEmail(""); setAge("");
          fetchUsers();
        })
        .catch(err => console.error("POST /users error:", err));
    } else {
      // Update
      axios.put(`http://127.0.0.1:5000/users/${editingId}`, {name,email,age})
        .then(res => {
          setName(""); setEmail(""); setAge("");
          setEditingId(null);
          fetchUsers();
        })
        .catch(err => console.error("PUT /users error:", err));
    }
  }

  // Edit user
  const editUser = (user) => {
    setName(user[1]);
    setEmail(user[2]);
    setAge(user[3]);
    setEditingId(user[0]);
  }

  // Delete user
  const deleteUser = (id) => {
    axios.delete(`http://127.0.0.1:5000/users/${id}`)
      .then(res => fetchUsers())
      .catch(err => console.error("DELETE /users error:", err));
  }

  return (
    <div style={{padding:"20px", fontFamily:"Arial"}}>
      <h1 style={{textAlign:"center"}}> CRUD OPERATION</h1>

      <div style={{marginBottom:"20px", display:"flex", gap:"10px"}}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Age" value={age} onChange={e=>setAge(e.target.value)} />
        <button onClick={saveUser}>
          {editingId ? "Update User" : "Add User"}
        </button>
      </div>

      <table border="1" cellPadding="10" style={{width:"100%", borderCollapse:"collapse"}}>
        <thead style={{background:"#f0f0f0"}}>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u[0]}>
              <td>{u[0]}</td>
              <td>{u[1]}</td>
              <td>{u[2]}</td>
              <td>{u[3]}</td>
              <td>
                <button onClick={()=>editUser(u)} style={{marginRight:"5px"}}>Edit</button>
                <button onClick={()=>deleteUser(u[0])}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
