import React from "react"
import Car1 from "../assets/FeaturedFleetImages/Car1.webp"
import { FaPerson, FaRegStar } from "react-icons/fa6"
import { MdOutlineSettings } from "react-icons/md"
import { BsFuelPump } from "react-icons/bs"
import { Link } from "react-router-dom"
import "../styles/carCard.css"

export default function CarCard() {

  const tesla = {
    id: 0,
    name: "Tesla Model 3",
    imageUrl: Car1,
    noSeats: 5,
    fuelType: "Electric",
    gearBoxType: "Auto",
    review: 4.5,
    price: 4000
  }

  const tempData = [tesla, tesla, tesla]

  const fleetCards = tempData.map(car => {
    return (
      <div className="car-card">

        <img className="car-image" src={car.imageUrl} alt={car.name}></img>

        <div className="car-info">
          <div className="car-info-c1">
            <h4 className="car-name">{car.name}</h4>
            <div className="car-spec">
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
          </div>

          <div className="car-review">
            <FaRegStar />
            <p>{car.review}</p>
          </div>
        </div>

        <div className="car-pricing">
          <h4>{`\u20B9${car.price}`}<span>/day</span></h4>
          <Link to={`/cars/${car.id}`}>Rent Now</Link>
        </div>

      </div>
    )
  })

  return <>{fleetCards}</>
}
