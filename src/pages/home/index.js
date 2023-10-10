import React, { useState, useEffect } from "react";
import UserSearch from "./components/UserSearch";
import ChatArea from "./components/ChatArea";
import UsersList from "./components/UsersList";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001");

const Home = () => {
	const [searchKey, setSearchKey] = useState("");
	const { selectedChat, user } = useSelector((state) => state.userReducer);
	useEffect(() => {
		socket.emit("join-room", user?._id);
	}, [user]);

	return (
		<div className="flex gap-5">
			<div className="w-96 ">
				<UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
				<UsersList searchKey={searchKey} socket={socket} />
			</div>

			<div className="w-full">
				{selectedChat && <ChatArea socket={socket} />}
			</div>
		</div>
	);
};

export default Home;
