from typing import Optional, Generator
import pandas as pd
from sqlmodel import SQLModel, Field, create_engine, Session, select


# -----------------------------
# Database Config
# -----------------------------
DATABASE_URL = "sqlite:///cars.db"
engine = create_engine(DATABASE_URL, echo=True)


# -----------------------------
# Model
# -----------------------------
class Car(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    name: str
    imageUrl: str
    noSeats: int
    carType: str
    fuelType: str
    gearBoxType: str
    review: float
    price: float
    description: str


# -----------------------------
# Create Tables
# -----------------------------
def create_db():
    SQLModel.metadata.create_all(engine)


# -----------------------------
# Dependency (for FastAPI)
# -----------------------------
def get_session() -> Generator:
    with Session(engine) as session:
        yield session


# -----------------------------
# Load CSV Data
# -----------------------------
def load_data_from_csv(file_name: str = "cars.csv"):
    df = pd.read_csv(file_name)

    with Session(engine) as session:
        # Prevent duplicate loading
        existing = session.exec(select(Car)).first()
        if existing:
            print("Data already exists. Skipping CSV load.")
            return

        cars = [
            Car(
                name=row["name"],
                imageUrl=row["imageUrl"],
                noSeats=int(row["noSeats"]),
                carType=row["carType"],
                fuelType=row["fuelType"],
                gearBoxType=row["gearBoxType"],
                review=float(row["review"]),
                price=float(row["price"]),
                description=row["description"],
            )
            for _, row in df.iterrows()
        ]

        session.add_all(cars)
        session.commit()
        print("CSV data loaded successfully.")
