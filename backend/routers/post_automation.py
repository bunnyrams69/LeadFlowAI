from fastapi import APIRouter
from typing import List
from models.schemas import PostRequest, PostResponse
from services.post_service import publish_post

router = APIRouter(prefix="/api/post", tags=["post"])
history = []

@router.post("/publish", response_model=PostResponse)
async def publish(req: PostRequest):
    res = publish_post(req)
    history.append(res)
    return res

@router.get("/history", response_model=List[PostResponse])
async def get_history():
    return history
