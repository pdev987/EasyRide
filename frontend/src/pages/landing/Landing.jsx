import React from "react"
import { FaSearch, FaCalendarAlt, FaKey } from "react-icons/fa"
import { Link } from "react-router-dom"
import coverImage from "../../assets/coverImage.webp"
import "../../styles/landing.css"
import CarCard from "../../components/CarCard"
import { base_url } from "../../api"

export default function Landing() {
  const [cars, setCars] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    const url = `${base_url}/cars?limit=3`
    setLoading(true)
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        setCars(data)
        setLoading(false)
      }).catch((e) => setError(e))
  }, [])

  const carFleetCards = cars.map((car, index) => <CarCard key={index} car={car} />)
  if (loading) {
    return <h1>Loading</h1>
  }

  if (error) {
    return <h1>Error occured</h1>
  }

  return (
    <div className="cover-main-container">

      <div className="cover-ai-card">
        <Link to="ai">AI Assistant</Link>
        <p>Get personalized car rental recommendations in seconds.
          Chat with our AI to compare prices,
          see transparent fees and book instantly.
        </p>
      </div>

      <div className="cover-info-container">
        <div className="cover-text">
          <h1>Rent Your Next <span>Adventure</span></h1>
          <p>Experience the freedom of the open road
            with our premium fleet of vehicles
            tailored for your journey.
          </p>
          <Link className="browse-car-button" to="cars">Browse All Cars</Link>
        </div>
        <img className="cover-image" src={coverImage} alt="Cover Image" />
      </div>

      <div className="why-choose-text">
        <h3>Why Choose Our Service</h3>
        <p> We provide the best car rental Experience
          with focus on quality, price, and customer satisfaction.
        </p>
      </div>

      <div className="why-choose-cards">

        <div className="why-choose-sub-card">
          <FaSearch />
          <h4>Reliable Support</h4>
          <p>
            24/7 dedicated support and immediate
            roadside assistance for total peace of
            mind during your journey.
          </p>
        </div>

        <div className="why-choose-sub-card">
          <FaCalendarAlt />
          <h4>Reliable Support</h4>
          <p>
            24/7 dedicated support and immediate
            roadside assistance for total peace of
            mind during your journey.
          </p>
        </div>

        <div className="why-choose-sub-card">
          <FaKey />
          <h4>Reliable Support</h4>
          <p>
            24/7 dedicated support and immediate
            roadside assistance for total peace of
            mind during your journey.
          </p>
        </div>
      </div>

      <div className="our-fleet-container">
        <div className="feature-fleet-container">
          <div className="heading">
            <h3>Our Featured Fleet</h3>
            <p>Explore our most popular vehicles Choosen by travellers like you</p>
          </div>

          <div className="cards-container">
            {cars && carFleetCards}
          </div>

        </div>
        <Link className="our-fleet-car-link" to="cars">View All Cars</Link>
      </div>
      {/*
      <div className="cover-process">
        <div className="cover-cards">
          <div className="cover-cards-icon">
            <FaSearch />
          </div>
          <div className="cover-cards-text-info">
            <h3>Search</h3>
            <p>
              Find the perfect ride for your
              destination. Filter by Vehicle type.
            </p>
          </div>
        </div>

        <div className="cover-cards">
          <div className="cover-cards-icon">
            <FaCalendarAlt />
          </div>
          <div className="cover-cards-text-info">
            <h3>Book</h3>
            <p>
              Secure your vechile in seconds
              with instant confirmation and
              flexible cancellation.
            </p>
          </div>
        </div>

        <div className="cover-cards">
          <div className="cover-cards-icon">
            <FaKey />
          </div>
          <div className="cover-cards-text-info">
            <h3>Drive</h3>
            <p>
              Pick up your keys from our
              convenient locations and hit the
              open road.
            </p>
          </div>
        </div>
      </div>*/}

    </div >
  )
}
