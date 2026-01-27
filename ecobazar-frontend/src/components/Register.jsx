import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Professional.css"; // Uses the new Master Theme

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER" // Default role
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("http://localhost:8084/auth/register", formData);
            alert("Registration Successful! Please Login. 🌿");
            navigate("/"); // Go back to login page
        } catch (err) {
            console.error(err);
            alert("Registration Failed: " + (err.response?.data || "Check your network connection"));
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: "500px" }}>

                {/* Header Section */}
                <h2 style={{
                    fontSize: "2rem",
                    marginBottom: "10px",
                    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "800"
                }}>
                    Join EcoBazar 🌿
                </h2>
                <p style={{ color: "#6b7280", marginBottom: "30px", fontSize: "0.95rem" }}>
                    Start your sustainable journey today.
                </p>

                {/* Form Section */}
                <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                    <div style={{ textAlign: "left" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginLeft: "4px", marginBottom: "4px", display: "block" }}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            onChange={handleChange}
                            required
                            style={{ background: "white" }}
                        />
                    </div>

                    <div style={{ textAlign: "left" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginLeft: "4px", marginBottom: "4px", display: "block" }}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            onChange={handleChange}
                            required
                            style={{ background: "white" }}
                        />
                    </div>

                    <div style={{ textAlign: "left" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginLeft: "4px", marginBottom: "4px", display: "block" }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                            style={{ background: "white" }}
                        />
                    </div>

                    <div style={{ textAlign: "left" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginLeft: "4px", marginBottom: "4px", display: "block" }}>I want to...</label>
                        <select
                            name="role"
                            onChange={handleChange}
                            style={{ background: "white", cursor: "pointer" }}
                        >
                            <option value="USER">🛍️ Buy Products (Buyer)</option>
                            <option value="SELLER">📦 Sell Products (Vendor)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: "100%", marginTop: "15px", padding: "14px", fontSize: "1rem" }}
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account →"}
                    </button>
                </form>

                {/* Footer Link */}
                <p style={{ marginTop: "25px", color: "#6b7280", fontSize: "0.9rem" }}>
                    Already have an account? <span onClick={() => navigate("/")} style={{ color: "#059669", fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}>Log In</span>
                </p>
            </div>
        </div>
    );
};

export default Register;