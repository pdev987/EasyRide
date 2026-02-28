# from langchain.tools import tool
# import pandas as pd
# import os


import pandas as pd
import os
from langchain.tools import tool
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "cars.csv")

df = pd.read_csv(CSV_PATH)


@tool
def database_metadata():
    """
    Get car dataset metatdata using this tool.
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


columns_to_send = ["name", "id"]


@tool
def company_info() -> str:
    """
    Company info tool
    """
    info = """EasyRent company is has its headquartress on Dasarahalli, Banglore, Karnataka.
            We operate around 50 cars. And provide Exceptional service.
            We only operate inside India.
            """
    return info


@tool
def get_car_information_by_id(id: int) -> dict:
    """
    use this tool to get information about the car using its id
    """
    df_filtered = df[df["id"] == id]
    if not df_filtered.empty:
        return df_filtered.to_dict(orient="record")
    else:
        raise ValueError("Invalid car ID selected")


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


@tool
def get_cars_and_ids() -> dict:
    """
    get all the available cars and its ids.
    """
    return df.loc[:, columns_to_send].to_dict(orient="records")


tools = [
    database_metadata,
    render_car_component_UI,
    company_info,
    database_metadata,
    get_cars_and_ids
]
