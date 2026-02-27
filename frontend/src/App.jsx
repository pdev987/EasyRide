// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from "./components/Layout"
import About from "./pages/About"
import Landing from "./pages/landing/Landing"
import Ai from "./pages/Ai"
import Cars from "./pages/cars/Cars"
import Bookings from "./pages/bookings/Bookings"
import CarDetail from './pages/cars/CarDetail'
import NotExist from "./pages/NotExist"
import './styles/App.css'

export const tempApiUrl = "http://localhost:8000"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="ai" element={<Ai />} />
          <Route path="cars" element={<Cars />} />
          <Route path="cars/:id" element={<CarDetail />} />
          <Route path="bookings/:id?" element={<Bookings />} />
          <Route path="about" element={<About />} />


          <Route path="*" element={<NotExist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
