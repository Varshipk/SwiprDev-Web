import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { recieverId } = useParams();
  const location = useLocation();
  const firstName = location.state.firstName || "";
  const photoUrl = location.state.photoUrl || "";
  const user = useSelector((store) => store.user);
  const senderId = user?._id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const typingTimeoutRef = useRef();
  const fetchMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + recieverId, {
      withCredentials: true,
    });
    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId.firstName,
        text,
      };
    });
    setMessages(chatMessages);
  };
  useEffect(() => {
    fetchMessages();
  }, []);
  useEffect(() => {
    if (!senderId) {
      return;
    }
    const socket = createSocketConnection();
    socket.emit("joinChat", { senderId, recieverId });
    socket.on("display_typing", ({ senderId, recieverId }) => {
      if (senderId !== user._id) setTyping(true);
    });
    socket.on("hide_typing", () => {
      setTyping(false);
    });
    socket.on("messageRecieved", ({ firstName, text }) => {
      setMessages((messages) => [...messages, { firstName, text }]);
      console.log(firstName + " : " + text);
    });
    return () => {
      socket.disconnect();
    };
  }, [senderId, recieverId]);

  const sendMessage = () => {
    if (!newMessage.trim()) {
      return;
    }
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      senderId,
      recieverId,
      text: newMessage,
    });
    setNewMessage("");
  };
  const handleTyping = () => {
    const socket = createSocketConnection();
    socket.emit("typing", { senderId, recieverId });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { senderId, recieverId });
    }, 1500);
  };
  return (
    <div className="w-full max-w-md h-[500px] my-8 m-auto bg-[#C2EDF2] shadow-lg rounded-md flex flex-col">
      <div className="flex gap-2 items-center p-2 border-b-1 border-blue-300 shadow-lg">
        <div>
          <img className="size-10 rounded-box" src={photoUrl} />
        </div>
        <div>
          <div className="text-lg font-semibold">{firstName}</div>
          {typing && <p>typing..</p>}
        </div>
      </div>
      <div className="flex-1 overflow-y-scroll no-scrollbar p-4">
        {messages.map((message, index) => {
          return (
            <>
              <div key={index} className="chat-header"></div>
              <div
                className={`flex ${
                  message.firstName === user.firstName
                    ? "justify-end"
                    : "justify-start"
                } mb-2`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl shadow-md text-white ${
                    message.firstName === user.firstName
                      ? "bg-blue-500 rounded-br-none"
                      : "bg-gray-600 rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </>
          );
        })}
      </div>
      <div className=" p-2 flex  ">
        <input
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          type="text"
          className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
