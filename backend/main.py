import asyncio
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from car_paths import car_router
from chat_ws_path import ws_router

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(car_router)
app.include_router(ws_router)


# ==================== delete checkpoint every 2 hr============
DB_FILE = "./checkpoints.db"


async def daily_cleanup():
    while True:
        await asyncio.sleep(2 * 3600)  # 24 hours
        if os.path.exists(DB_FILE):
            os.remove(DB_FILE)
            print("[Cleanup] Deleted SQLite DB")


@app.on_event("startup")
async def startup_task():
    asyncio.create_task(daily_cleanup())
