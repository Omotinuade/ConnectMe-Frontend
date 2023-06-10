import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import ProtectedRoute from "./component/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Loader from "./component/Loader";
function App() {
	const { loader } = useSelector((state) => state.loaderReducer);
	return (
		<div>
			<Toaster position="top-center" reverseOrder={false} />
			{loader && <Loader />}
			<Router>
				<Routes>
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
					<Route path="/login" element={<Login />} />
					<Route path="register" element={<Register />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
