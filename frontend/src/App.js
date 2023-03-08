import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/login/Login'
import UserPage from './components/userpage/UserPage'
import Protected from './components/Protected';
import Header from './components/header/Header';
function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Protected Component={Login} />} />
        <Route path="/user" element={<Protected Component={UserPage} />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
