import React from "react"
import { useSearchParams, Link } from "react-router-dom"
import CarCard from "../../components/CarCard"
import { base_url } from "../../api"
import "../../styles/cars.css"

export default function Cars() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [cars, setCars] = React.useState([])
  const [loadingPage, setLoadingPage] = React.useState(false)
  const [error, setError] = React.useState(null)

  const carTypeFilter = searchParams.get("carType")
  console.log(carTypeFilter)

  React.useEffect(() => {
    const url = `${base_url}/cars?limit=50`
    console.log(url)
    setLoadingPage(true)
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        setCars(data)
        console.log(data)
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
          onClick={() => handleCarTypeFilter("carType", "Sedan")}
          className={
            `car-type ${carTypeFilter === "Sedan" ? "button-selected" : ""}`
          }
        >Sedan</button>
        <button
          onClick={() => handleCarTypeFilter("carType", "SUV")}
          className={
            `car-type ${carTypeFilter === "SUV" ? "button-selected" : ""}`
          }
        >SUV</button>
        <button
          onClick={() => handleCarTypeFilter("carType", "Hatchback")}
          className={
            `car-type ${carTypeFilter === "Hatchback" ? "button-selected" : ""}`
          }
        >HatchBack</button>
        {/* <button
          onClick={() => handleCarTypeFilter("carType", "electric")}
          className={
            `car-type ${carTypeFilter === "electric" ? "button-selected" : ""}`
          }
        >Electric</button>*/}

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
