import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Professional.css";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8084/auth/login", formData);

            // Save Token & Role
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);

            // Redirect based on Role
            if (response.data.role === "ADMIN") navigate("/admin-dashboard");
            else if (response.data.role === "SELLER") navigate("/seller-dashboard");
            else navigate("/shop");

        } catch (err) {
            alert("Invalid Credentials! Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Logo / Icon */}
                <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🌿</div>

                <h2 style={{
                    fontSize: "2rem",
                    marginBottom: "10px",
                    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "800"
                }}>
                    EcoBazar
                </h2>

                <p style={{ color: "#6b7280", marginBottom: "30px", fontSize: "0.95rem" }}>
                    Welcome back! Please login to continue.
                </p>

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ textAlign: "left" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginLeft: "4px", marginBottom: "6px", display: "block" }}>Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            onChange={handleChange}
                            required
                            style={{ background: "white" }}
                        />
                    </div>

                    <div style={{ textAlign: "left" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginLeft: "4px", marginBottom: "6px", display: "block" }}>Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                            style={{ background: "white" }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: "100%", marginTop: "10px", padding: "14px", fontSize: "1rem" }}
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In →"}
                    </button>
                </form>

                <p style={{ marginTop: "25px", color: "#6b7280", fontSize: "0.9rem" }}>
                    Don't have an account? <span onClick={() => navigate("/register")} style={{ color: "#059669", fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}>Create one</span>
                </p>
            </div>
        </div>
    );
};

export default Login;