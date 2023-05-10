import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("/auth/authenticated").then((res) => {
      console.log((res) => {
        setUser(res.data.user);
      });
    });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        {user && <Route path="/dashboard" element={<Dashboard />} />}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
