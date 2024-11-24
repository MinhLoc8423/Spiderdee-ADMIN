import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Login from './users/Login';
import Dashboard from './dashboard/List';
import Add from './products/Add';
import Edit from './products/Edit';
import List from './products/List';
import List1 from './categories/List';
import Add1 from './categories/Add';
import Edit1 from './categories/Edit';
import Order from './orders/List';
import Profile from './profile/Profile';
import ResetPassword from './users/ResetPassword';
import Customers from './customers/User';


function App() {

  const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  }

  const saveUserToLocalStorage = (userInfo) => {
    if (!userInfo) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      return;
    }
    localStorage.setItem('user', JSON.stringify(userInfo));
    setUser(userInfo);
  }

  const [user, setUser] = useState(getUserFromLocalStorage());

  const checkTokenValidity = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Corrected function usage
        const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây
        if (decodedToken.exp < currentTime) {
          saveUserToLocalStorage(null);
        }
      } catch (error) {
        saveUserToLocalStorage(null);
      }
    } else {
      saveUserToLocalStorage(null);
    }
  };

  useEffect(() => {
    checkTokenValidity();
  }, [user]);

  const ProtectedRoute = () => {
    if (user) {
      return <Outlet />
    }
    return <Navigate to="/login" />
  }

  const PublicRoute = () => {
    if (user) {
      return <Navigate to="/" />
    }
    return <Outlet />
  }

  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login saveUser={saveUserToLocalStorage} />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard user={user} saveUser={saveUserToLocalStorage} />} />
            <Route path="/products" element={<List user={user} saveUser={saveUserToLocalStorage} />} />
            <Route path="/products/add-product" element={<Add user={user} saveUser={saveUserToLocalStorage} />} />
            <Route path="/products/edit-product/:id" element={<Edit />} />
            <Route path="/categories" element={<List1 user={user} saveUser={saveUserToLocalStorage} />} />
            <Route path="/categories/add-category" element={<Add1 user={user} />} />
            <Route path="/categories/edit-category/:id" element={<Edit1 />} />
            <Route path="/orders" element={<Order user={user} saveUser={saveUserToLocalStorage} />} />
            <Route path="/users" element={<Profile user={user} saveUser={saveUserToLocalStorage} />} />
            <Route path="/customers" element={<Customers user={user} saveUser={saveUserToLocalStorage} />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
