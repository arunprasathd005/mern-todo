import React, { useEffect, useState } from 'react';

const Todo = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditid] = useState(-1);
  const apiUrl = "http://localhost:8000"; // base url

  // edit
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleSubmit = () => { // check inputs
    setError(""); // clear error message on submit
    if (title.trim() !== '' && description.trim() !== '') {
      fetch(apiUrl + "/todos", { // make POST request
        method: "POST",
        headers: {
          'Content-Type': 'application/json' // data in JSON format
        },
        body: JSON.stringify({ title, description })
      }).then((res) => {
        if (res.ok) {
          res.json().then((newTodo) => {
            setTodos([...todos, newTodo]); // update state with new todo
          });
          setTitle("");
          setDescription("");
          setMessage("Item added successfully");
          setTimeout(() => {
            setMessage("");
          }, 3000);
        } else {
          setError("Unable to create todo item");
        }
      }).catch(() => {
        setError("Unable to create todo item");
      });
    }
  };

  useEffect(() => {
    getItems(); // fetch items on component mount
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos") // send GET request
      .then((res) => res.json()) // parse response as JSON
      .then((res) => {
        setTodos(res); // update state with fetched todos
      });
  };

  const handleEdit = (item) => {
    setEditid(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = () => {
    setError(""); // clear error message on submit
    if (editTitle.trim() !== '' && editDescription.trim() !== '') {
      fetch(apiUrl + "/todos/" + editId, { // make PUT request
        method: "PUT",
        headers: {
          'Content-Type': 'application/json' // data in JSON format
        },
        body: JSON.stringify({ title: editTitle, description: editDescription })
      }).then((res) => {
        if (res.ok) {
          const updatedTodos = todos.map((item) => {
            if (item._id === editId) {
              item.title = editTitle;
              item.description = editDescription;
            }
            return item;
          });
          setTodos(updatedTodos); // update state with updated todos
          setEditTitle("");
          setEditDescription("");
          setMessage("Item updated successfully");
          setTimeout(() => {
            setMessage("");
          }, 3000);
          setEditid(-1);
        } else {
          setError("Unable to update todo item");
        }
      }).catch(() => {
        setError("Unable to update todo item");
      });
    }
  };

  const handleEditCancel = () => {
    setEditid(-1);
  };

  const handleDelete = (_id) => {
    if (window.confirm("Are you sure to delete?")) {
      fetch(apiUrl + '/todos/' + _id, {
        method: "DELETE"
      }).then((res) => {
        if (res.ok) {
          const updatedTodos = todos.filter((item) => item._id !== _id);
          setTodos(updatedTodos); // update state with remaining todos
          setMessage("Item deleted successfully");
          setTimeout(() => {
            setMessage("");
          }, 3000);
        } else {
          setError("Unable to delete todo item");
        }
      }).catch(() => {
        setError("Unable to delete todo item");
      });
    }
  };

  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>Todo project with MERN stack</h1>
      </div>
      <div className='row'>
        <h3>Add Item</h3>
        {message && <p className='text-success'>{message}</p>}
        <div className='form-group d-flex gap-2'>
          <input placeholder='Title' onChange={(e) => setTitle(e.target.value)} value={title} type="text" className='form-control' />
          <input placeholder='Description' onChange={(e) => setDescription(e.target.value)} value={description} type="text" className='form-control' />
          <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className='text-danger'>{error}</p>}
      </div>
      <div className='row mt-3'>
        <h3>Tasks</h3>
        <ul className='list-group'>
          {
            todos.map((item) =>
              <li key={item._id} className='list-group-item bg-info d-flex justify-content-between align-items-center my-2'>
                <div className='d-flex flex-column me-2'>
                  {
                    editId === -1 || editId !== item._id ?
                      <>
                        <span className='fw-bold'>{item.title}</span>
                        <span>{item.description}</span>
                      </> :
                      <>
                        <div className='form-group d-flex gap-2'>
                          <input placeholder='Title' onChange={(e) => setEditTitle(e.target.value)} value={editTitle} type="text" className='form-control' />
                          <input placeholder='Description' onChange={(e) => setEditDescription(e.target.value)} value={editDescription} type="text" className='form-control' />
                        </div>
                      </>
                  }
                </div>
                <div className='d-flex gap-2'>
                  {editId === -1 || editId !== item._id ?
                    <button className='btn btn-warning' onClick={() => handleEdit(item)}>Edit</button> :
                    <button className='btn btn-dark' onClick={() => handleUpdate()}>Update</button>}
                  {editId === -1 ?
                    <button className='btn btn-danger' onClick={() => handleDelete(item._id)}>Delete</button> :
                    <button className='btn btn-danger' onClick={handleEditCancel}>Cancel</button>}
                </div>
              </li>
            )
          }
        </ul>
      </div>
    </>
  );
};

export default Todo;
