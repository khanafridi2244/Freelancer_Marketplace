import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import TaskList from './pages/TaskList.jsx';
import TaskDetail from './pages/TaskDetail.jsx';
import PostTask from './pages/PostTask.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/post-task" element={<PostTask />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;