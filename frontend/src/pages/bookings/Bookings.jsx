import React from "react"
import { FaCalendarAlt } from "react-icons/fa"
import { useParams } from "react-router-dom"
import { tempApiUrl } from "../../App"
import { FaC, FaPerson, FaRegStar } from "react-icons/fa6"
import { MdOutlineSettings } from "react-icons/md"
import { BsFuelPump } from "react-icons/bs"
import Confetti from "react-confetti"
import "../../styles/booking.css"

export default function Bookings() {
  const { id } = useParams()
  const [daysInfo, setDaysInfo] = React.useState(null)
  const [car, setCar] = React.useState([])
  const pricingComponentRef = React.useRef(null)

  React.useEffect(() => {
    const url = `${tempApiUrl}/api/v1/car/${id}`
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        setCar(data)
      })
  }, [id])

  React.useEffect(() => {
    if (pricingComponentRef.current) {
      pricingComponentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    }
  }, [daysInfo])


  function calculateDaysDifference(date1, date2) {
    const msDate1 = new Date(date1).getTime()
    const msDate2 = new Date(date2).getTime()

    const difference = Math.abs(msDate1 - msDate2)

    const differenceInDays = Math.ceil(difference / (1000 * 60 * 60 * 24))

    return differenceInDays
  }

  function handleDateSelection(e) {
    e.preventDefault()
    const date1 = e.target[1].value
    const date2 = e.target[3].value
    const differenceDays = calculateDaysDifference(date1, date2)
    const dateObject = {
      "date1": date1,
      "date2": date2,
      "difference": differenceDays
    }
    setDaysInfo(dateObject)

  }
  return (
    < div className="bookings-main-container" >

      {(id && car) ? <>

        <div className="container-block-0">
          <h1>Complete Your Booking</h1>
          <p>Review your selection and provide rental details to finalize your reservation.</p>
        </div>

        <div className="test-container">

          <div className="booking-car-info-container">
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
            </div>
          </div>

          <div className="schedule-container">
            <div className="text-container">
              <FaCalendarAlt />
              <h4>Rental Schedule</h4>
            </div>
            <form onSubmit={handleDateSelection}>
              <fieldset>
                <label htmlFor="pickDate">Pick Up</label>
                <input id="pickDate" placeholder="Pickup Date" name="pick-up" type="date" required />
              </fieldset>
              <fieldset>
                <label htmlFor="dropDate">Drop Off</label>
                <input id="dropDate" placeholder="Drop Date" name="drop-date" type='date' required />
              </fieldset>
              <button>Select Dates</button>
            </form>
          </div>
        </div>

        <div className="container-block-2">
          {daysInfo && <div ref={pricingComponentRef}>
            <h3>Price Summary</h3>
            <div className="pick-date">
              <p>Pick Up Date</p>
              <p>{daysInfo.date1}</p>
            </div>
            <div className="drop-date">
              <p>Drop Date</p>
              <p>{daysInfo.date2}</p>
            </div>

            <div className="total-pricing">
              <h3>Total Price for <span>{daysInfo.difference}</span> days Incluing tax.</h3>
              <p>{`\u20B9${car.price * daysInfo.difference}`}</p>
            </div>

            <button>Confirm Booking</button>
          </div>
          }
        </div>
      </> : <h1>Select the Car to Book. Please visit the "Cars" page.</h1>
      }
    </div >

  )
}
