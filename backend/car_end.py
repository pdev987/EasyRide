import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Literal, List

car_df = pd.read_csv("cars.csv")
image_base_url = "http://localhost:8000/static/images/"

car_router = APIRouter(prefix="/api/v1")


class CarInfo(BaseModel):
    id: int
    name: str
    imageUrl: str
    noSeats: int
    carType: Literal['SUV', 'Hatchback', 'Luxury', 'Sedan', 'MPV']
    fuelType: Literal["Diesel", "Petrol"]
    gearBoxType: Literal["Manual", "Auto"]
    review: float
    price: float
    description: str


def get_car(id: int) -> dict:
    df_filtered = car_df[car_df["id"] == id]

    if not df_filtered.empty:
        car_row = df_filtered.iloc[0].to_dict()
    else:
        # default to id 1
        car_row = car_df[car_df["id"] == 1].iloc[0].to_dict()

    # car_row["imageUrl"] = image_base_url + f"car{car_row['id']}.webp"
    return car_row


@car_router.get("/health")
async def get_health():
    return {"status": "healthy"}


@car_router.get("/cars", response_model=List[CarInfo])
async def get_cars(limit: int = 10):
    """
    Returns the first 'limit' cars from the dataset.
    """
    if limit <= 0:
        return {"error": "Limit must be greater than 0"}

    limit = min(limit, car_df.shape[0])
    cars_list = [get_car(id) for id in range(1, limit + 1)]
    return cars_list


@car_router.get("/car/{id}", response_model=CarInfo)
async def get_car_by_id(id: int):
    return get_car(id)
