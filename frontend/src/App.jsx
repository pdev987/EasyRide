// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from "./components/Layout"
import Landing from "./pages/Landing/Landing"
import Cars from "./pages/cars/Cars"
import './styles/App.css'


export const tempApiUrl = "http://localhost:8000"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="cars" element={<Cars />} />
          <Route path="booking/:id" element={<h1>Bookings page</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
