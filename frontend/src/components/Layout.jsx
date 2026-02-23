import Header from "./Header"
import Footer from "./Footer"

// outlet is part of react-router-dom
// which creates a kind of hole in the page
// which is filled with different components
// when user visits different pages.
import { Outlet } from "react-router-dom"
import "../styles/layout.css"

export default function Layout() {
  // Layout componet that wraps everything
  // because these Header and Footer are available
  // throught the app it is used kind of as template
  return (
    <div className="layout-container">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
