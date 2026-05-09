from fastapi import APIRouter
router = APIRouter()

@router.post("/")
def checkin():
    return {"status": "ok"}