import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Shop.css"; // Using the new Professional CSS

const UserDashboard = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // This runs AUTOMATICALLY when page loads
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/"); // Kick out if no token
            return;
        }

        try {
            // GET request with Token
            const response = await axios.get("http://localhost:8084/products/all", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setProducts(response.data); // Save data to state
        } catch (err) {
            alert("Failed to load products. " + err.message);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f1f3f6" }}>

            {/* 1. PROFESSIONAL NAVBAR */}
            <div className="navbar">
                <div className="brand-logo">EcoBazaar 🌿</div>
                <div className="nav-buttons">
                    <button className="btn-profile" onClick={() => navigate("/profile")}>
                        My Profile
                    </button>
                    <button className="btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* 2. MAIN CONTENT AREA */}
            <div className="product-grid">
                {products.length === 0 ? (
                    <h3 style={{color:"#555"}}>Loading Products...</h3>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="product-card">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="product-img" />
                            ) : (
                                <div className="product-img" style={{background:"#eee", display:"flex", alignItems:"center", justifyContent:"center", color:"#999"}}>
                                    No Image
                                </div>
                            )}

                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p className="product-desc">{product.description}</p>
                                <div className="price-tag">${product.price}</div>
                                <button className="buy-btn">Add to Cart</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}; // <--- THIS BRACE WAS LIKELY MISSING!

export default UserDashboard;