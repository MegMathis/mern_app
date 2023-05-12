import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

function Header(props) {
  const navigate = useNavigate();

  const logout = async (e) => {
    e.preventDefault();

    await axios.get("/auth/logout");

    props.setUser(null);
    navigate("/");
  };

  return (
    <header>
      <h3>&#127864; Drink Recipe App</h3>

      <nav>
        <NavLink to="/">Home</NavLink>
        {props.user ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink onClick={logout} to="/auth/logout">
              Log Out
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <span>|</span>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
