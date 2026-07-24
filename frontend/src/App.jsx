import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import TaskList from './pages/TaskList.jsx';
import TaskDetail from './pages/TaskDetail.jsx';
import PostTask from './pages/PostTask.jsx';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;