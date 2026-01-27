import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Professional.css";

const ProductDetails = () => {
    const { id } = useParams(); // Get ID from URL
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:8084/products/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                setProduct(response.data);
            } catch (err) {
                console.error("Error loading product:", err);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${product.name} added to cart! 🛒`);
    };

    if (!product) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;

    return (
        <div className="pro-body">
            {/* NAVBAR */}
            <div className="navbar" style={{ borderBottom: "4px solid #3498db" }}>
                <div className="brand-logo" style={{ color: "#3498db", cursor: "pointer" }} onClick={() => navigate("/shop")}>
                    ← Back to Shop
                </div>
                <button className="btn-profile" onClick={() => navigate("/cart")}>View Cart 🛍️</button>
            </div>

            {/* PRODUCT DETAIL CONTAINER */}
            <div className="pro-container" style={{ maxWidth: "1000px", margin: "40px auto", display: "flex", gap: "50px", background: "white", padding: "40px", borderRadius: "15px", boxShadow: "0 5px 25px rgba(0,0,0,0.1)" }}>

                {/* LEFT: IMAGE */}
                <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", background: "#f8f9fa", borderRadius: "10px", maxHeight: "500px" }}>
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    ) : (
                        <span style={{ color: "#aaa", fontSize: "1.5rem" }}>No Image</span>
                    )}
                </div>

                {/* RIGHT: INFO */}
                <div style={{ flex: 1 }}>
                    {/* Eco Badge */}
                    <div style={{
                        display: "inline-block", padding: "5px 15px", borderRadius: "20px", marginBottom: "15px", fontWeight: "bold",
                        background: product.ecoRating === 'A' ? '#d4edda' : product.ecoRating === 'B' ? '#fff3cd' : '#f8d7da',
                        color: product.ecoRating === 'A' ? '#155724' : product.ecoRating === 'B' ? '#856404' : '#721c24'
                    }}>
                        {product.ecoRating === 'A' ? '🌿 Eco-Certified (Grade A)' : product.ecoRating === 'B' ? '⚠️ Standard (Grade B)' : '🏭 High Carbon (Grade C)'}
                    </div>

                    <h1 style={{ fontSize: "2.5rem", color: "#2c3e50", margin: "10px 0" }}>{product.name}</h1>
                    <h2 style={{ fontSize: "2rem", color: "#27ae60", margin: "10px 0" }}>${product.price}</h2>

                    <p style={{ fontSize: "1.1rem", color: "#555", lineHeight: "1.6", margin: "20px 0" }}>
                        {product.description || "No description provided."}
                    </p>

                    {/* CARBON BREAKDOWN CARD */}
                    <div style={{ background: "#e8f6f3", padding: "20px", borderRadius: "10px", border: "1px solid #d1f2eb", marginBottom: "30px" }}>
                        <h4 style={{ margin: "0 0 10px 0", color: "#16a085" }}>🌍 Environmental Impact</h4>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem" }}>
                            <span>Carbon Footprint:</span>
                            <strong>{product.carbonFootprint} kg CO2e</strong>
                        </div>
                        <div style={{ marginTop: "10px", fontSize: "0.9rem", color: "#666" }}>
                            * Buying this instead of a plastic alternative saves approx. {((product.carbonFootprint || 1) * 2).toFixed(1)} kg of emissions.
                        </div>
                    </div>

                    <button
                        onClick={addToCart}
                        style={{ width: "100%", padding: "15px", background: "#3498db", color: "white", border: "none", borderRadius: "8px", fontSize: "1.2rem", cursor: "pointer", fontWeight: "bold" }}
                    >
                        Add to Cart 🛒
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;