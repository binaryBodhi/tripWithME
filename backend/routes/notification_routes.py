from fastapi import APIRouter, Depends, HTTPException
from typing import List
from backend.models.users import User
from backend.auth.dependencies import get_current_user
from backend.repositories import notification_repository
from backend.schemas.notification_schema import NotificationResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=List[NotificationResponse])
async def get_notifications(current_user: User = Depends(get_current_user)):
    return await notification_repository.get_user_notifications(current_user.id)


@router.patch("/{notification_id}/handle")
async def mark_notification_as_handled(
    notification_id: str, 
    current_user: User = Depends(get_current_user)
):
    notif = await notification_repository.mark_as_handled(notification_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "success"}


@router.patch("/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: str, 
    current_user: User = Depends(get_current_user)
):
    notif = await notification_repository.mark_as_read(notification_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "success"}


@router.get("/unread-count")
async def get_unread_count(current_user: User = Depends(get_current_user)):
    count = await notification_repository.get_unread_count(current_user.id)
    return {"count": count}


@router.post("/mark-all-read")
async def mark_all_as_read(current_user: User = Depends(get_current_user)):
    await notification_repository.mark_all_as_read(current_user.id)
    return {"status": "success"}
