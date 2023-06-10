import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetCurrentUser } from "../apicalls/users";

function ProtectedRoute({ children }) {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);

	const getCurrentUser = () => {
		try {
			const response = GetCurrentUser();
			if (response.success) {
				setUser(response.data);
				return true;
			} else {
				navigate("/");
			}
		} catch (e) {
			console.log(e);
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
		<>
			<div>who dey</div>
			<p>{user?.name}</p>
			<h1>{user?.email}</h1>
			<div>{children}</div>
		</>
	);
}

export default ProtectedRoute;
