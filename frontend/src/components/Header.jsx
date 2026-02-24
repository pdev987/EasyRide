// FaCar is main project logo imported from react-icons
import { FaCar } from "react-icons/fa"
// impoting necessary navigation components
import { Link, NavLink } from "react-router-dom"
import "../styles/header.css"


export default function Header() {

  // active Styles area added when the route is active
  // it is provided by navLink component
  const activeStyle = {
    fontWeight: "bold",
    textDecoration: "underline",
  }

  return (
    <header>
      <div className="header-logo-project-name-container">
        {/* <FaCar className="project-logo" />*/}
        <Link to="/" className="project-name">EasyRide</Link>
      </div>
      <nav>
        <NavLink
          to="aibot"
          style={({ isActive }) => isActive ? activeStyle : null}
        >
          Ai Assistant
        </NavLink>
        <NavLink
          to="cars"
          style={({ isActive }) => isActive ? activeStyle : null}
        >
          Cars
        </NavLink>
        <NavLink
          to="bookings"
          style={({ isActive }) => isActive ? activeStyle : null}
        >
          Bookings
        </NavLink>
        <NavLink
          to="about"
          style={({ isActive }) => isActive ? activeStyle : null}
        >
          About
        </NavLink>
      </nav>
    </header>
  )
}
