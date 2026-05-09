from fastapi import APIRouter
router = APIRouter()

@router.get("/spin")
def spin_wheel():
    return {"result": "⭐"}