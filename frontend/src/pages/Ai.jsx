import React from "react";
import Markdown from "react-markdown";
import CarCard from "../components/CarCard";
import { tempApiUrl } from "../App";
import "../styles/ai.css"

export default function ChatApp() {
  // ususally like {text: "hello world", sender: "user"}
  const [messages, setMessages] = React.useState(() => {
    const savedMessages = sessionStorage.getItem("chat_messages")
    return savedMessages ? JSON.parse(savedMessages) :
      [{ type: "text", text: "Hello, I am a car recomendataion agent. How can I assist you today.", sender: "bot" }];
  });
  const [threadId, setThreadId] = React.useState(null)
  const [isStreaming, setIsStreaming] = React.useState(false)
  // const id = React.useRef(1)
  // const [error, setError] = React.useState([])
  // const [loading, setLoading] = React.useState(false)
  const [car, setCar] = React.useState({})
  const ws = React.useRef(null); // refrencing websocket object
  const inputRef = React.useRef(null); // for referencing input value
  const messageListRef = React.useRef(null); // refrence for message container for autoscroll
  const recomendedCarRef = React.useRef(null)

  const streamingBotIndex = React.useRef(null);


  React.useEffect(() => {
    sessionStorage.setItem("chat_messages", JSON.stringify(messages))
  }, [messages])

  React.useState(() => {
    const url = `${tempApiUrl}/api/v1/car/1`
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        console.log("the car info is", car)
        setCar(data)
      })
  }, [])

  React.useEffect(() => {
    fetch("http://127.0.0.1:8080/threadid")
      .then(res => res.json())
      .then(data => {
        setThreadId(data.threadId)
      })
    // }
  }, [])

  React.useEffect(() => {
    if (!threadId) {
      return
    }
    ws.current = new WebSocket("ws://127.0.0.1:8080/ws/chat");

    ws.current.onopen = () => {
      console.log("ws connection open")
    };

    ws.current.onclose = () => {
      console.log("Connection lost, Reconecting")
      setTimeout(() => {
        if (threadId) {
          ws.current = new WebSocket("ws//127.0.0.1:8080/ws/chat")
        }
      }, 1000)

    }

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.event === "car_component") {
          // setIsStreaming(true)
          // save the recomended car to refernce
          recomendedCarRef.current = null
          recomendedCarRef.current = {
            type: "car_component",
            sender: "bot",
          };
        } else {
          if (data.event === "text_delta") {
            if (!data.delta || data.delta.trim() === "") {
              return
            }
            setMessages((prev) => {
              // If the current streaming index is valid
              if (
                streamingBotIndex.current !== null &&
                streamingBotIndex.current < prev.length
              ) {
                const updated = [...prev];
                updated[streamingBotIndex.current] = {
                  ...updated[streamingBotIndex.current],
                  text:
                    (updated[streamingBotIndex.current].text || "") +
                    data.delta,
                };
                return updated;
              } else {
                // Otherwise, push a new bot message
                const newMessage = { type: "text", text: data.delta, sender: "bot" };
                streamingBotIndex.current = prev.length;
                return [...prev, newMessage];
              }

            });
          }
        }

        if (data.event === "stream_end") {
          // setIsStreaming(false)
          streamingBotIndex.current = null;
          if (recomendedCarRef.current !== null) {
            const carComonentInfo = recomendedCarRef.current
            setMessages(prev => {
              const updated = [...prev, carComonentInfo]
              recomendedCarRef.current = null
              return updated
            })
          }
          setIsStreaming(false)
        }
      } catch (err) {
        console.error("Error parsing WS message", err);
      }
    };

    return () => {
      console.log("Closing ws")
      if (ws.current) {
        ws.current.onopen = null
        ws.current.onmessage = null
        ws.current.onclose = null
        ws.current.onerror = null
        ws.current.close(1000, "Component unmounting")
        ws.current = null
      }
    }
  }, [threadId]);

  React.useEffect(() => {
    // code for autoscroll effect so the use sees newly streamed messages
    if (messageListRef.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight;
    }
  }, [messages]);

  function sendMessage() {
    // get the user input using input ref
    let userInput = inputRef.current.value.trim();
    if (!userInput) return;

    // Reset streaming index for a new bot message
    streamingBotIndex.current = null;

    // add new message object to previous messages
    setMessages((prev) => [...prev, { type: "text", text: userInput, sender: "user" }]);
    // send the user message to llm
    // if the mesage
    if (ws.current) {
      ws.current.send(JSON.stringify({ message: userInput, thread_id: threadId }));
    }
    // reset the value of input section to empty text
    inputRef.current.value = "";
    setIsStreaming(true)
  };

  function handleKeyDown(e) {
    if (isStreaming === false) {
      if (e.key === "Enter") sendMessage();
    } else {
      console.log("Cant send message when streaming.")
    }
  };

  // if (loading) {
  //   return <h1>Loading</h1>
  // }

  // if (error) {
  //   return <h1>Error occured</h1>
  // }

  return <>
    <div className="chat-container">
      <div ref={messageListRef} className="message-list">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.type === "car_component" ? (
              <CarCard car={car} />) : (
              <Markdown>{msg.text}</Markdown>
            )
            }
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          placeholder="Message to our Assistant."
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage} disabled={isStreaming}>Send</button>
      </div>
    </div>
  </>
};
