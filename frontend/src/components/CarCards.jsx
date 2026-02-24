import React from "react"
import CarCard from "./CarCard"

export default function CarCards({ cars }) {
  console.log(cars)

  const fleetCards = cars.map(car => <CarCard id={car.id} car={car} />)

  return <>{fleetCards}</>
}
