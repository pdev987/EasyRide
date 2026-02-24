import React from "react"
import { useSearchParams, Link } from "react-router-dom"
import CarCard from "../../components/CarCard"
import { tempApiUrl } from "../../App"
import "../../styles/cars.css"

export default function Cars() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [cars, setCars] = React.useState([])
  const [loadingPage, setLoadingPage] = React.useState(false)
  const [error, setError] = React.useState(null)

  const carTypeFilter = searchParams.get("carType")

  React.useEffect(() => {
    const url = `${tempApiUrl}/api/v1/getcars/9`
    setLoadingPage(true)
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        setCars(data)
        setLoadingPage(false)
      }).catch((e) => setError(e))
  }, [])

  if (loadingPage) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Error occured on fetching data...</h1>
  }

  const carsToDisplay = carTypeFilter
    ? cars.filter(car => car.carType === carTypeFilter)
    : cars

  const carCards = carsToDisplay.map(car => <CarCard key={car.id} car={car} />)

  function handleCarTypeFilter(key, value) {
    setSearchParams(prevParams => {
      if (value === null) {
        prevParams.delete(key)
      } else {
        prevParams.set(key, value)
      }
      return prevParams
    })
  }

  return (
    <div className="cars-main-container">
      <h1>Explore our fleet of {cars.length} cars.</h1>
      <div className="cars-type-filter-buttons">
        <button
          onClick={() => handleCarTypeFilter("carType", "sedan")}
          className={
            `car-type ${carTypeFilter === "sedan" ? "button-selected" : ""}`
          }
        >Sedan</button>
        <button
          onClick={() => handleCarTypeFilter("carType", "suv")}
          className={
            `car-type ${carTypeFilter === "suv" ? "button-selected" : ""}`
          }
        >SUV</button>
        <button
          onClick={() => handleCarTypeFilter("carType", "hatchBack")}
          className={
            `car-type ${carTypeFilter === "hatchBack" ? "button-selected" : ""}`
          }
        >HatchBack</button>
        <button
          onClick={() => handleCarTypeFilter("carType", "electric")}
          className={
            `car-type ${carTypeFilter === "electric" ? "button-selected" : ""}`
          }
        >Electric</button>

        {carTypeFilter
          ? (<button onClick={() => handleCarTypeFilter("carType", null)} className="car-type clear-filters">Clear Filters</button>) :
          null}

        <div className="car-list">
          {carCards}
        </div>
      </div>
    </div >
  )
}
