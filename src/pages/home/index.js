import React, { useState, useEffect } from "react";
import UserSearch from "./components/UserSearch";
import ChatArea from "./components/ChatArea";
import UsersList from "./components/UsersList";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const Home = () => {
	const socket = io("http://localhost:3001");
	const [searchKey, setSearchKey] = useState("");
	const { selectedChat, user } = useSelector((state) => state.userReducer);
	useEffect(() => {
		socket.emit("join-room", user._id);
	}, []);

	return (
		<div className="flex gap-5">
			<div className="w-96 ">
				<UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
				<UsersList searchKey={searchKey} />
			</div>

			<div className="w-full">
				{selectedChat && <ChatArea socket={socket} />}
			</div>
		</div>
	);
};

export default Home;
