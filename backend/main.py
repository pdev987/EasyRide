import asyncio
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from car_end import car_router
from chat_ws_end import ws_router

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/assets", StaticFiles(directory="dist/assets/"), name="assets")
# app.mount("/", StaticFiles(directory=("dist")), name="react")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(car_router)
app.include_router(ws_router)

current_dir = os.path.dirname(os.path.abspath(__file__))
dist_path = os.path.join(current_dir, "dist")


@app.get("/{full_path:path}")
def serve_react_app(full_path: str):
    return FileResponse(os.path.join(dist_path, "index.html"))


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
