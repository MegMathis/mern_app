import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("/auth/authenticated").then((res) => {
      setUser(res.data.user);
    });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard setUser={setUser} user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/register"
          element={
            !user ? (
              <Register setUser={setUser} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
