import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetMessages, SendMessage } from "../../../apicalls/messages";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import { toast } from "react-hot-toast";
import moment from "moment";
import { SetAllChats } from "../../../redux/userSlice";
import { ClearChatMessages } from "../../../apicalls/chats";
import store from "../../../redux/store";

const ChatArea = ({ socket }) => {
	const dispatch = useDispatch();
	const [newMessage, setNewMessage] = useState("");
	const { selectedChat, user, allChats } = useSelector(
		(state) => state.userReducer
	);
	const [messages, setMessages] = useState([]);
	const recipientUser = selectedChat.members.find(
		(mem) => mem._id !== user._id
	);

	const sendNewMessage = async () => {
		try {
			const message = {
				chat: selectedChat._id,
				sender: user._id,
				text: newMessage,
			};
			console.log(selectedChat._id);
			socket.emit("send-message", {
				...message,
				members: selectedChat.members.map((member) => member._id),
				createdAt: moment(),
				read: false,
			});
			const response = await SendMessage(message);

			if (response.success) {
				toast.success(response.message);
				setNewMessage("");
			}
		} catch (error) {
			toast.error(error.message);
		}
	};
	const getMessages = async () => {
		try {
			dispatch(ShowLoader());
			const response = await GetMessages(selectedChat._id);
			dispatch(HideLoader());
			if (response.success) {
				setMessages(response.data);
			}
		} catch (error) {
			dispatch(HideLoader());
			toast.error(error.message);
		}
	};
	const clearUnreadMessages = async () => {
		try {
			dispatch(ShowLoader());
			const response = await ClearChatMessages(selectedChat._id);
			dispatch(HideLoader());
			if (response.success) {
				const updatedChats = allChats.map((chat) => {
					if (chat._id === selectedChat._id) {
						return response.data;
					} else {
						return chat;
					}
				});
				dispatch(SetAllChats(updatedChats));
			}
		} catch (error) {
			dispatch(HideLoader());
			toast.error(error.message);
		}
	};
	useEffect(() => {
		getMessages();
		if (selectedChat?.lastMessage?.sender !== user._id) {
			clearUnreadMessages();
		}
		socket.off("receive-message").on("receive-message", (data) => {
			const tempSelectedChat = store.getState().userReducer.selectedChat;
			if (tempSelectedChat._id === data.chat) {
				setMessages((message) => [...message, data]);
			}
		});
	}, [selectedChat]);
	useEffect(() => {
		const messageContainer = document.getElementById("messages");
		messageContainer.scrollTop = messageContainer.scrollHeight;
	}, [messages]);
	return (
		<div className="bg-white h-[82vh] border rounded-2xl w-full flex flex-col justify-between p-5">
			<div>
				<div className="flex gap-5 items-center mb-2">
					{recipientUser.profilePic && (
						<img
							src={recipientUser.profilePic}
							alt="profile pic"
							className="w-10 h-10 rounded-full"
						/>
					)}
					{!recipientUser.profilePic && (
						<div className="bg-gray-500 rounded-full h-10 w-10 flex items-center justify-center ">
							<h1 className="uppercase text-white  text-xl font-semibold">
								{recipientUser.name[0]}
							</h1>
						</div>
					)}
					<h1 className="uppercase">{recipientUser.name}</h1>
				</div>
				<hr />
			</div>
			<div className="h-[55vh] overflow-y-scroll p-5" id="messages">
				<div className="flex flex-col gap-2">
					{messages.map((message, index) => {
						const isCurrentUserIsSender = message.sender === user._id;
						return (
							<div
								className={`flex ${isCurrentUserIsSender && "justify-end"}`}
								key={index}
							>
								<div className="flex flex-col gap-1">
									<h1
										className={`${
											isCurrentUserIsSender
												? "bg-primary text-white rounded-bl-none"
												: "bg-gray-300 rounded-tr-none"
										} p-2 rounded-xl `}
									>
										{message.text}
									</h1>
									<h1 className="text-gray-500 text-sm">
										{moment(message.createdAt).format("hh:mm A")}
									</h1>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			<div>
				<div className="h-18 rounded-xl border-gray-300 shadow border flex justify-between p-2 items-center">
					<input
						type="text"
						placeholder="Type a message"
						className="w-[90%] border-0 h-full rounded-xl focus:border-none "
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
					/>
					<button
						className="bg-primary p-2 text-white py-1 px-5 rounded h-max"
						onClick={sendNewMessage}
					>
						<i className="ri-send-plane-line text-white"></i>
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChatArea;
