from typing import List
from beanie import PydanticObjectId
from backend.models.notifications import Notification


async def create_notification(notification: Notification) -> Notification:
    return await notification.insert()


async def get_user_notifications(user_id: PydanticObjectId) -> List[Notification]:
    return await Notification.find(
        Notification.recipient_id == user_id
    ).sort("-created_at").limit(50).to_list()


async def mark_as_read(notification_id: str):
    notification = await Notification.get(notification_id)
    if notification:
        notification.is_read = True
        await notification.save()
        return notification
    return None


async def mark_as_handled(notification_id: str):
    notification = await Notification.get(notification_id)
    if notification:
        notification.is_handled = True
        notification.is_read = True # Handling usually implies reading
        await notification.save()
        return notification
    return None


async def get_unread_count(user_id: PydanticObjectId) -> int:
    return await Notification.find(
        Notification.recipient_id == user_id,
        Notification.is_read == False
    ).count()


async def mark_all_as_read(user_id: PydanticObjectId):
    await Notification.find(
        Notification.recipient_id == user_id,
        Notification.is_read == False
    ).set({Notification.is_read: True})
