import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetAllUsers, GetCurrentUser } from "../apicalls/users";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { HideLoader, ShowLoader } from "../redux/loaderSlice";
import { SetAllChats, SetAllUser, SetUser } from "../redux/userSlice";
import { GetAllChats } from "../apicalls/chats";

function ProtectedRoute({ children }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.userReducer);

	const getCurrentUser = async () => {
		try {
			dispatch(ShowLoader());
			const response = await GetCurrentUser();
			const allUsersResponse = await GetAllUsers();
			const allChatsResponse = await GetAllChats();
			dispatch(HideLoader());
			if (response.success) {
				dispatch(SetUser(response.data));
				dispatch(SetAllUser(allUsersResponse.data));
				dispatch(SetAllChats(allChatsResponse.data));
			} else {
				toast.error(response.message);
				navigate("/login");
			}
		} catch (error) {
			dispatch(HideLoader());
			toast.error(error.message);
			navigate("/login");
		}
	};

	useEffect(() => {
		const item = localStorage.getItem("token");
		if (item) {
			getCurrentUser();
		} else {
			navigate("/login");
		}
	}, []);
	return (
		<div className="h-screen w-screen bg-gray-100 p-2">
			<div className="flex justify-between p-5 bg-primary">
				<div className="flex items-center gap-1">
					<i className="ri-message-3-line text-2xl text-white"></i>
					<h1 className="text-white text-2xl uppercase font-bold">
						Connectify
					</h1>
				</div>
				<div className="flex gap-1 text-md items-center ">
					<i className="ri-user-line text-white"></i>
					<h1 className="underline text-white">{user?.name}</h1>
					<i
						className="ri-logout-circle-r-line text-xl text-white cursor-pointer"
						onClick={() => {
							localStorage.removeItem("token");
							window.location.href = "/";
						}}
					></i>
				</div>
			</div>
			<div className="py-5">{children}</div>
		</div>
	);
}

export default ProtectedRoute;
