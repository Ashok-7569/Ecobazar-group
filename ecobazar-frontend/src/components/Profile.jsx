import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Professional.css"; // Reuse background

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get("http://localhost:8084/users/profile", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (err) {
            console.error(err);
            alert("Failed to load profile");
        }
    };

    return (
        <div className="pro-body"> {/* Apply clean grey background */}
            <div className="navbar">
                <div className="brand-logo">EcoBazaar 🌿</div>
                <button className="btn-logout" onClick={() => navigate("/")}>Logout</button>
            </div>

            <div className="pro-container">
                <div className="pro-card">
                    <h2>MY ECO-PROFILE</h2>

                    {user ? (
                        <div>
                            <div style={{
                                width: "80px", height: "80px", borderRadius: "50%",
                                background: "#27ae60", color: "white", margin: "0 auto 20px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "2rem", fontWeight: "bold"
                            }}>
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <h3>{user.name}</h3>
                            <p>{user.email}</p>
                            <p>Role: <b>{user.role}</b></p>

                            <div className="eco-badge">
                                <h4 style={{margin:0}}>🌱 Eco-Score</h4>
                                <h1 style={{fontSize:"3rem", margin:"10px 0"}}>{user.ecoScore || 0}</h1>
                                <small>Points earned from sustainable shopping</small>
                            </div>

                            <button onClick={() => navigate(-1)} className="back-btn">Back</button>
                        </div>
                    ) : <p>Loading...</p>}
                </div>
            </div>
        </div>
    );
};

export default Profile;