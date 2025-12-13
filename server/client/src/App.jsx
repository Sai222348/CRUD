import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// ✅ Backend LIVE URL
const API_URL = "https://crud-backend-uxdq.onrender.com";

function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });

  // Get all users
  const getUsers = async () => {
    await axios.get(`${API_URL}/users`)
      .then((res) => {
        setUsers(res.data);
        setFilterUsers(res.data);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Search functionality
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchText) ||
      user.city.toLowerCase().includes(searchText)
    );
    setFilterUsers(filteredUsers);
  };

  // Delete functionality
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      await axios.delete(`${API_URL}/users/${id}`)
        .then((res) => {
          setUsers(res.data);
          setFilterUsers(res.data);
        });
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    getUsers();
  };

  // Add record
  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsModalOpen(true);
  };

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.id) {
      await axios.patch(`${API_URL}/users/${userData.id}`, userData);
    } else {
      await axios.post(`${API_URL}/users`, userData);
    }

    closeModal();
    setUserData({ name: "", age: "", city: "" });
  };

  // Update record
  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="container">
        <h3>CRUD Application with React.js Frontend and Node.js Backend</h3>

        <div className="input-search">
          <input
            type="search"
            placeholder="Search Text Here"
            onChange={handleSearchChange}
          />
          <button className="btn green" onClick={handleAddRecord}>
            Add Record
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>
                <td>
                  <button
                    className="btn green"
                    onClick={() => handleUpdateRecord(user)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn red"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h2>{userData.id ? "Update Record" : "Add Record"}</h2>

              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleData}
                />
              </div>

              <div className="input-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={userData.age}
                  onChange={handleData}
                />
              </div>

              <div className="input-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={userData.city}
                  onChange={handleData}
                />
              </div>

              <button className="btn green" onClick={handleSubmit}>
                {userData.id ? "Update User" : "Add User"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
