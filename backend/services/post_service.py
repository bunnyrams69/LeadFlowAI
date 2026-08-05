from models.schemas import PostRequest, PostResponse
from datetime import datetime

# DEMO FALLBACK
def publish_post(req: PostRequest) -> PostResponse:
    return PostResponse(
        status="published",
        post_id="demo_" + str(int(datetime.now().timestamp())),
        message="Post published successfully to LinkedIn"
    )
