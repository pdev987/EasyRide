from langchain.tools import tool
import pandas as pd

df = pd.read_csv("cars.csv")


@tool
def database_metadata():
    """
    Returns car dataset basic inforamtion
    which provide more insite into available cars
    and thier properties.
    Which is helpfull for other tool calls,
    the tool provides information like,
    min/max for id_range, price, seats, reviews
    available cars baed on car type, fuel type and gear box type
    """

    metadata = {
        "price": {
            "min": float(df["price"].min()),
            "max": float(df["price"].max()),
            "prices": list[df["price"].unique()]
        },
        "noseats": {
            "min": int(df["noSeats"].min()),
            "max": int(df["noSeats"].max())
        },
        "review": {
            "min": float(df["review"].min()),
            "max": float(df["review"].max())
        },
        "cartype": list(df["carType"].unique()),
        "fueltype": list(df["fuelType"].unique()),
        "gearboxtype": list(df["gearBoxType"].unique())
    }
    return metadata


@tool
def get_by_seats(noseats: int, num_of_cars: int = None):
    """
    Filter cars by number of seats.

    Args:
        noseats (int): Number of seats the car must have.
        num_of_cars (int, optional): Maximum number of cars to return. If None, return all matching cars.

    Returns:
        list[dict]: List of car dictionaries matching the seat requirement.
                    Each dict contains keys like id, name, price, cartype, fueltype, gearboxtype, review.
                    Returns a message string if no cars match.
    """
    temp_df = df[df["noSeats"] == noseats]
    if temp_df.empty:
        return "No cars available with this number of seats"
    if num_of_cars is not None and num_of_cars < len(temp_df):
        temp_df = temp_df.iloc[:num_of_cars]
    return temp_df.to_dict()


# -----------------------
# Filter by Car Type
# -----------------------
@tool
def get_by_cartype(cartype: str, num_of_cars: int = None):
    """
    Filter cars by car type.

    Args:
        cartype (str): Car type to filter (e.g., SUV, Sedan, Hatchback).
        num_of_cars (int, optional): Maximum number of cars to return.

    Returns:
        list[dict]: List of car dictionaries of the given car type.
                    Returns a message string if no cars match.
    """
    temp_df = df[df["carType"] == cartype]
    if temp_df.empty:
        return "No cars available of this type"
    if num_of_cars is not None and num_of_cars < len(temp_df):
        temp_df = temp_df.iloc[:num_of_cars]
    return temp_df.to_dict()


@tool
def get_by_fueltype(fueltype: str, num_of_cars: int = None):
    """
    Filter cars by fuel type.

    Args:
        fueltype (str): Fuel type to filter (e.g., Petrol, Diesel, Electric).
        num_of_cars (int, optional): Maximum number of cars to return.

    Returns:
        list[dict]: List of car dictionaries matching the fuel type.
                    Returns a message string if no cars match.
    """
    temp_df = df[df["fuelType"] == fueltype]
    if temp_df.empty:
        return "No cars available with this fuel type"
    if num_of_cars is not None and num_of_cars < len(temp_df):
        temp_df = temp_df.iloc[:num_of_cars]
    return temp_df.to_dict(orient="records")


@tool
def get_by_gearboxtype(gearboxtype: str, num_of_cars: int = None):
    """
    Filter cars by gearbox type.

    Args:
        gearboxtype (str): Gearbox type to filter (e.g., Automatic, Manual).
        num_of_cars (int, optional): Maximum number of cars to return.

    Returns:
        list[dict]: List of car dictionaries matching the gearbox type.
                    Returns a message string if no cars match.
    """
    temp_df = df[df["gearBoxType"] == gearboxtype]
    if temp_df.empty:
        return "No cars available with this gearbox type"
    if num_of_cars is not None and num_of_cars < len(temp_df):
        temp_df = temp_df.iloc[:num_of_cars]
    return temp_df.to_dict(orient="records")


@tool
def get_by_price(min_price: float = None, max_price: float = None, num_of_cars: int = None):
    """
    Filter cars by price range.

    Args:
        min_price (float, optional): Minimum price to filter.
        max_price (float, optional): Maximum price to filter.
        num_of_cars (int, optional): Maximum number of cars to return.

    Returns:
        list[dict]: List of car dictionaries within the given price range.
                    Returns a message string if no cars match.
    """
    temp_df = df.copy()
    if min_price is not None:
        temp_df = temp_df[temp_df["price"] >= min_price]
    if max_price is not None:
        temp_df = temp_df[temp_df["price"] <= max_price]
    if temp_df.empty:
        return "No cars available in this price range"
    if num_of_cars is not None and num_of_cars < len(temp_df):
        temp_df = temp_df.iloc[:num_of_cars]
    return temp_df.to_dict(orient="records")


@tool
def get_by_review(min_review: float, num_of_cars: int = None):
    """
    Filter cars by minimum review score.

    Args:
        min_review (float): Minimum review score required (e.g., 4.5).
        num_of_cars (int, optional): Maximum number of cars to return.

    Returns:
        list[dict]: List of car dictionaries with review >= min_review.
                    Returns a message string if no cars match.
    """
    temp_df = df[df["review"] >= min_review]
    if temp_df.empty:
        return "No cars available with this review score"
    if num_of_cars is not None and num_of_cars < len(temp_df):
        temp_df = temp_df.iloc[:num_of_cars]
    return temp_df.to_dict(orient="records")


@tool
def company_info() -> str:
    """
    Call this tool to get basic infomation about the company.
    """
    info = """EasyRent company is has its headquartress on Dasarahalli, Banglore, Karnataka.
            We operate around 50 cars. And provide Exceptional service.
            We only operate inside India.
            """
    return info


@tool
def render_car_component_UI(id: int) -> int:
    """
    use the recomended car "id" as input to this tool call
    Use this tool to render the Car UI component for user
    call this tool only for recomended cars
    """
    df_filtered = df[df["id"] == id]
    if not df_filtered.empty:
        return int(id)
    else:
        raise ValueError("Invalid car ID selected")


tools = [
    render_car_component_UI,
    company_info,
    database_metadata,
    get_by_review,
    get_by_price,
    get_by_fueltype,
    get_by_gearboxtype,
    get_by_cartype,
    get_by_seats
]
