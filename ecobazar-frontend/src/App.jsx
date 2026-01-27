import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import SellerDashboard from "./components/SellerDashboard";
import UserDashboard from "./components/UserDashboard";
import Profile from "./components/Profile";
import Shop from "./components/Shop";
import ProductDetails from "./components/ProductDetails";

function App() {
    return (
        <Router>
            <Routes>
                {/* --- PUBLIC ROUTES --- */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* This is the new Route for Product Details */}
                <Route path="/product/:id" element={<ProductDetails />} />

                {/* --- PROTECTED ROUTES --- */}

                {/* 1. Admin */}
                <Route path="/admin-dashboard" element={<AdminDashboard />} />

                {/* 2. Seller */}
                <Route path="/seller-dashboard" element={<SellerDashboard />} />

                {/* 3. User / Buyer */}
                <Route path="/shop" element={<Shop />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />

                {/* 4. Common */}
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default App;