import secrets
import json
import asyncio
from datetime import datetime, timedelta
from fastapi import WebSocket, WebSocketDisconnect
from fastapi import APIRouter
from langchain.messages import ToolMessage, AIMessageChunk
from langg import agent, saver

ws_router = APIRouter(prefix="/api/v1")


# endpoint for new threadid
@ws_router.get("/threadid")
async def get_thread_id():
    """Generate a new unique thread_id for the client."""
    return {"threadId": secrets.token_urlsafe(16)}


THREAD_TTL_MINUTES = 10
CLEANUP_INTERVAL_SECONDS = 120  # 2 minutes

# dictionary to store thread and its lastactive timestamp
thread_activity: dict[str, datetime] = {}


async def cleanup_threads():
    """Periodically delete expired threads from LangChain memory."""
    while True:
        now = datetime.utcnow()
        expired_threads = []

        for thread_id, last_active in list(thread_activity.items()):
            if now - last_active > timedelta(minutes=THREAD_TTL_MINUTES):
                expired_threads.append(thread_id)

        for thread_id in expired_threads:
            try:
                await saver.adelete_thread(thread_id=thread_id)
                thread_activity.pop(thread_id, None)
                print(f"[Cleanup] Deleted expired thread: {thread_id}")
            except Exception as e:
                print(f"[Cleanup] Failed to delete {thread_id}: {e}")

        await asyncio.sleep(CLEANUP_INTERVAL_SECONDS)


@ws_router.on_event("startup")
async def start_cleanup_task():
    asyncio.create_task(cleanup_threads())


# ai chant ws endpoint
@ws_router.websocket("/ws/chat")
async def chat_ws(websocket: WebSocket):
    await websocket.accept()
    thread_id: str | None = None

    try:
        while True:
            user_message = await websocket.receive_json()

            thread_id = user_message.get("thread_id")
            message_text = user_message.get("message")
            if not thread_id or not message_text:
                continue

            # Update thread activity at message start
            thread_activity[thread_id] = datetime.utcnow()

            # Stream response from agent
            async for token, _ in agent.astream(
                {"messages": [{"role": "user", "content": message_text}]},
                {"configurable": {"thread_id": thread_id}},
                stream_mode="messages",
            ):
                # Update thread activity on every token
                thread_activity[thread_id] = datetime.utcnow()

                if isinstance(token, ToolMessage):
                    print(token)
                    if token.name == "render_car_component_UI":
                        await websocket.send_text(json.dumps({
                            "event": "car_component",
                            "id": token.content,
                        }))
                elif isinstance(token, AIMessageChunk):
                    event_data = {
                        "event": "stream_end" if token.chunk_position == "last" else "text_delta",
                        "delta": token.content if token.chunk_position != "last" else None,
                    }
                    await websocket.send_text(json.dumps(event_data))

            # Update activity again after full response
            thread_activity[thread_id] = datetime.utcnow()

    except WebSocketDisconnect:
        print(f"[WebSocket] Client disconnected for thread: {thread_id}")

    except Exception as e:
        print(f"[WebSocket] Error for thread {thread_id}: {e}")
