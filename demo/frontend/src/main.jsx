import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import LoginPage from './components/Login.jsx'
import CoursePage from './components/Course.jsx'
import RegistrationPage from './components/Register.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
