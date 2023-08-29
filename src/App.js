import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Card = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const App = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = name => {
    const newTask = { id: Date.now(), name };
    setTasks([...tasks, newTask]);
    navigate("/list-tasks")
  };

  const handleDeleteTask = id => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <Container>
      <Routes>
        <Route exact path="/" element={<Navigate replace to="/list-tasks" />}>
        </Route>
        <Route path="/list-tasks" element={<TaskList tasks={tasks} handleDeleteTask={handleDeleteTask} />}>
        </Route>
        <Route path="/create-task" element={<TaskForm onSubmit={handleAddTask} />}>
        </Route>
         <Route path="/bulk-delete" element={<BulkDeleteForm tasks={tasks} onDelete={setTasks} />}>
        </Route>
      </Routes>
    </Container>
  );
};

const TaskForm = ({ onSubmit }) => {
  const [taskName, setTaskName] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    if (taskName) {
      console.log(taskName)
      onSubmit(taskName);
      setTaskName('');
      
    }
  };

  return (
    <>
      <h1>Create Task</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
          placeholder="Enter task name"
        />
        <button type="submit">Add Task</button>
      </form>
  </>
  );
};

const TaskList = ({tasks, handleDeleteTask}) => {
  return(
    <>
      {tasks?.map(task => (
        <Card key={task.id}>
          {task.name}
          <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
        </Card>
      ))}
      <Link to="/create-task">Create Task</Link>
      <Link to="/bulk-delete">Bulk Delete</Link>
    </>
  )
}

const BulkDeleteForm = ({ tasks, onDelete }) => {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const handleToggleTask = taskId => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const handleDeleteSelected = () => {
    const updatedTasks = tasks.filter(task => !selectedTasks.includes(task.id));
    onDelete(updatedTasks);
    setSelectedTasks([]);
  };
  return (
    <div>
      {tasks.map(task => (
        <Card key={task.id}>
          <input
            type="checkbox"
            checked={selectedTasks.includes(task.id)}
            onChange={() => handleToggleTask(task.id)}
          />
          {task.name}
        </Card>
      ))}
      <button onClick={handleDeleteSelected} disabled={selectedTasks.length === 0}>
        Delete Selected
      </button>
    </div>
  );
};

export default App;
