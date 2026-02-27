import React from "react"
import { FaPerson, FaRegStar } from "react-icons/fa6"
import { MdOutlineSettings } from "react-icons/md"
import { BsFuelPump } from "react-icons/bs"
import { useParams } from "react-router-dom"

import { base_url } from "../../api"

import { Link } from "react-router-dom"
import "../../styles/carDetail.css"

export default function CarDetail() {
  const { id } = useParams()
  const [car, setCar] = React.useState()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    const url = `${base_url}/car/${id}`
    setLoading(true)
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        setCar(data)
        setLoading(false)
      })
      .catch((e) => setError(e))
  }, [id])


  if (loading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Error occured in Loaing Page.</h1>
  }

  return <>{car && (
    <div className="main-container">

      <div className="image-container">
        <img src={car.imageUrl} alt={car.name} />
      </div>

      <div className="car-info-container">

        <div className="container-1">
          <div className="text-and-review">
            <h1>{car.name}</h1>
            <p><span><FaRegStar /></span>{car.review}</p>
          </div>
          <div className="price-container">
            <p><span>{car.price}</span>/day</p>
          </div>
        </div>

        <div className="container-2">
          <div className="spec">
            <FaPerson />
            <p>{car.noSeats} Seats</p>
          </div>
          <div className="spec">
            <MdOutlineSettings />
            <p>{car.gearBoxType}</p>
          </div>

          <div className="spec">
            <BsFuelPump />
            <p>{car.fuelType}</p>
          </div>
        </div>
        <div className="container-3">
          <h6>Description</h6>
          <p>{car.description ? car.description : null}</p>
        </div>
        <Link className="container-4" to={`/bookings/${car.id}`}>Rent Now</Link>
      </div>
    </div >)
  }</>
}
