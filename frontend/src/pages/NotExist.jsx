import "../styles/notExist.css"
import { Link } from "react-router-dom"

export default function NotExist() {

  return <div className="notExist-main-container">
    <h1>The page you are looking for does not exist.</h1>
    <Link to="/">Return To Home page</Link>
  </div>
}
