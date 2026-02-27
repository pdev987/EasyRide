import secrets
import json
from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from langchain.messages import ToolMessage, AIMessageChunk
from langg import agent  # agent now uses AsyncSqliteSaver internally

ws_router = APIRouter(prefix="/api/v1")


# endpoint for new threadid
@ws_router.get("/threadid")
async def get_thread_id():
    """Generate a new unique thread_id for the client."""
    return {"threadId": secrets.token_urlsafe(16)}


# ai chat ws endpoint
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

            # Stream response from agent
            async for token, _ in agent.astream(
                {"messages": [{"role": "user", "content": message_text}]},
                config={"configurable": {"thread_id": thread_id}},
                stream_mode="messages",
            ):

                if isinstance(token, ToolMessage):
                    print(token)

                    if token.name == "render_car_component_UI":
                        await websocket.send_text(json.dumps({
                            "event": "car_component",
                            "data": token.content,
                        }))

                elif isinstance(token, AIMessageChunk):
                    event_data = {
                        "event": (
                            "stream_end"
                            if token.chunk_position == "last"
                            else "text_delta"
                        ),
                        "delta": (
                            None
                            if token.chunk_position == "last"
                            else token.content
                        ),
                    }

                    await websocket.send_text(json.dumps(event_data))

    except WebSocketDisconnect:
        print(f"[WebSocket] Client disconnected for thread: {thread_id}")

    except Exception as e:
        print(f"[WebSocket] Error for thread {thread_id}: {e}")
