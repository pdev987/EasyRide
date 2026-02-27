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
def filter_cars(
    seats: int = None,
    min_price: float = None,
    max_price: float = None,
    fueltype: str = None,
    cartype: str = None,
    gearboxtype: str = None,
    min_review: float = None,
    limit: int = 5
):
    """
    Filter cars based on user requirements.
    Return list of matching cars.
    Always returns list of dictionaries.
    """

    temp_df = df.copy()

    if seats is not None:
        if seats <= 0:
            return []
        temp_df = temp_df[temp_df["noSeats"] == seats]

    if min_price is not None:
        if min_price < 0:
            return []
        temp_df = temp_df[temp_df["price"] >= min_price]

    if max_price is not None:
        if max_price < 0:
            return []
        temp_df = temp_df[temp_df["price"] <= max_price]

    if fueltype is not None:
        temp_df = temp_df[temp_df["fuelType"] == fueltype]

    if cartype is not None:
        temp_df = temp_df[temp_df["carType"] == cartype]

    if gearboxtype is not None:
        temp_df = temp_df[temp_df["gearBoxType"] == gearboxtype]

    if min_review is not None:
        if not (0 <= min_review <= 5):
            return []
        temp_df = temp_df[temp_df["review"] >= min_review]

    if temp_df.empty:
        return []

    return temp_df.head(limit).to_dict(orient="records")


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
    filter_cars,
    render_car_component_UI,
    company_info
]
