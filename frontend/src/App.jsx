// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from "./components/Layout"
import Landing from "./pages/Landing/Landing"
import './styles/App.css'

function App() {
  // const [count, setCount] = useState(0)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
