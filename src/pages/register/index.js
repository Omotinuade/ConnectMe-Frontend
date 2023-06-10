import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RegisterUser } from "../../apicalls/users";
import { toast } from "react-hot-toast";

const Register = () => {
	const [user, setUser] = useState({
		name: "",
		email: "",
		password: "",
	});
	const register = async () => {
		try {
			const response = await RegisterUser(user);
			if (response.success) {
				toast.success(response.message);
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
				<h1 className="text-2xl uppercase font-semibold text-primary">
					Register
				</h1>
				<hr />
				<input
					type="text"
					value={user.name}
					onChange={(e) => setUser({ ...user, name: e.target.value })}
					placeholder="Enter your name"
				/>
				<input
					type="email"
					value={user.email}
					onChange={(e) => setUser({ ...user, email: e.target.value })}
					placeholder="Enter your email address"
				/>
				<input
					type="password"
					value={user.password}
					onChange={(e) => setUser({ ...user, password: e.target.value })}
					placeholder="Enter your password"
				/>
				<button className="contained-btn" onClick={register}>
					Register
				</button>

				<Link to="/login" className="underline">
					Already have an account?&rarr; Login
				</Link>
			</div>
		</div>
	);
};

export default Register;