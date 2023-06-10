import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";
import { toast } from "react-hot-toast";

const Login = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState({
		email: "",
		password: "",
	});
	const login = async (e) => {
		e.preventDefault();
		const authtoken = (token) => {
			localStorage.setItem("token", token);
		};
		try {
			const response = await LoginUser(user);
			if (response.success) {
				toast.success(response.message);
				navigate("/");
				authtoken(response?.data);
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};
	return (
		<div className=" h-screen bg-primary flex items-center justify-center">
			<div className="bg-white shadow-md p-5 flex flex-col gap-5 w-120">
				<h1 className="text-2xl uppercase font-semibold text-primary">Login</h1>
				<hr />

				<input
					type="text"
					value={user.email}
					onChange={(e) => setUser({ ...user, email: e.target.value })}
					placeholder="Enter your email address"
				/>
				<input
					type="text"
					value={user.password}
					onChange={(e) => setUser({ ...user, password: e.target.value })}
					placeholder="Enter your password"
				/>
				<button className="contained-btn" onClick={login}>
					Login
				</button>

				<Link to="/register" className="underline">
					Don't have an account? &rarr; Register
				</Link>
			</div>
		</div>
	);
};

export default Login;
