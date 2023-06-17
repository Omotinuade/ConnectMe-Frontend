import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetAllChats, SetSelectedChat } from "../../../redux/userSlice";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import { CreateNewChat } from "../../../apicalls/chats";
import { toast } from "react-hot-toast";
import moment from "moment";
import store from "../../../redux/store";

function UsersList({ searchKey, socket }) {
	const dispatch = useDispatch();
	const { allUsers, allChats, user, selectedChat } = useSelector(
		(state) => state.userReducer
	);
	const createNewChat = async (recipientUserId) => {
		try {
			dispatch(ShowLoader());
			const response = await CreateNewChat([user._id, recipientUserId]);
			dispatch(HideLoader());
			if (response.success) {
				toast.success(response.message);
				const newChat = response.data;
				const updatedChats = [...allChats, newChat];
				dispatch(SetAllChats(updatedChats));
				dispatch(SetSelectedChat(newChat));
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			dispatch(HideLoader());
			toast.error(error.message);
		}
	};
	const openChat = (recipientUserId) => {
		const chat = allChats.find(
			(chat) =>
				chat.members?.map((mem) => mem._id).includes(recipientUserId) &&
				chat.members?.map((mem) => mem._id).includes(user._id)
		);
		if (chat) {
			dispatch(SetSelectedChat(chat));
		}
	};

	const getData = () => {
		if (searchKey === "") {
			return allChats;
		}
		return allUsers.filter((userObj) =>
			userObj?.name.toLowerCase().includes(searchKey.toLowerCase())
		);
	};

	const getIsSelectedChatOrNot = (userObj) => {
		if (selectedChat) {
			return selectedChat.members
				.map((member) => member._id)
				.includes(userObj._id);
		}
		return false;
	};
	const getLastMessage = (userObj) => {
		const chat = allChats.find((chat) =>
			chat.members?.map((member) => member._id).includes(userObj._id)
		);

		if (!chat || !chat.lastMessage) {
			return "";
		} else {
			const lastMsgPerson =
				chat?.lastMessage?.sender === user._id ? "You :" : "";
			return (
				<div className="flex justify-between w-72 ">
					<h1 className="text-gray-600 text-sm">
						{lastMsgPerson} {chat?.lastMessage?.text}
					</h1>
					<h1 className="text-gray-500 text-sm">
						{moment(chat?.lastMessage?.createdAt).format("hh:mm A")}
					</h1>
				</div>
			);
		}
	};
	const getUnreadMessages = (userObj) => {
		const chat = allChats.find((chat) =>
			chat.members?.map((member) => member._id).includes(userObj._id)
		);
		if (chat && chat.unreadMessages && chat?.lastMessage?.sender !== user._id) {
			return (
				<div className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
					{chat.unreadMessages}
				</div>
			);
		}
	};
	useEffect(() => {
		socket.on("receive-message", (message) => {
			const tempSelectedChat = store.getState().userReducer.selectedChat;
			const tempAllChats = store.getState().userReducer.allChats;
			if (tempSelectedChat._id !== message.chat) {
				const updatedAllChats = tempAllChats.map((chat) => {
					if (chat._id === message.chat) {
						return {
							...chat,
							unreadMessages: (chat?.unreadMessages || 0) + 1,
							lastMessage: message,
						};
					}
					return chat;
				});
				dispatch(SetAllChats(updatedAllChats));
			}
		});
	}, []);
	return (
		<div className="flex flex-col gap-3 mt-5 w-96">
			{getData().map((chatObjoruserObj) => {
				let userObj = chatObjoruserObj;
				if (chatObjoruserObj.members) {
					userObj = chatObjoruserObj.members.find(
						(mem) => mem._id !== user._id
					);
				}
				return (
					<div
						className={`shadow-sm border p-2 rounded-xl bg-white flex items-center justify-between cursor-pointer w-full ${
							getIsSelectedChatOrNot(userObj) && "border-primary border-2"
						}`}
						key={userObj._id}
						onClick={() => openChat(userObj._id)}
					>
						<div className="flex gap-5 items-center  ">
							{userObj.profilePic && (
								<img
									src={userObj.profilePic}
									alt="profile pic"
									className="w-10 h-10 rounded-full"
								/>
							)}
							{!userObj.profilePic && (
								<div className="bg-gray-500 rounded-full h-12 w-12 flex items-center justify-center ">
									<h1 className="uppercase text-white  text-xl font-semibold">
										{userObj.name[0]}
									</h1>
								</div>
							)}
							<div className="flex flex-col gap-1 ">
								<div className="flex gap-1 justify-between">
									<div className="flex gap-1 items-center">
										<h1>{userObj.name}</h1>
									</div>

									{getUnreadMessages(userObj)}
								</div>

								{getLastMessage(userObj)}
							</div>
						</div>
						<div onClick={() => createNewChat(userObj._id)}>
							{!allChats.find((chat) =>
								chat.members?.map((mem) => mem._id).includes(userObj._id)
							) && (
								<button className="border-primary border p-2 rounded text-primary bg-white px-3 py-1 rounded-md">
									Create Chat
								</button>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default UsersList;
