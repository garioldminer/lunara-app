from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, readings, wheel, checkin

app = FastAPI(title="Lunara API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router,    prefix="/api/users")
app.include_router(readings.router, prefix="/api/readings")
app.include_router(wheel.router,    prefix="/api/wheel")
app.include_router(checkin.router,  prefix="/api/checkin")

@app.get("/health")
def health():
    return {"status": "ok", "app": "Lunara API"}
