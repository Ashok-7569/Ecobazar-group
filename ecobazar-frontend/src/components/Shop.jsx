import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Professional.css";

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEco, setFilterEco] = useState(false);

    // Sorting State
    const [sortOption, setSortOption] = useState("default"); // default, priceLow, priceHigh, co2Low

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8084/products/all", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setProducts(response.data);
        } catch (err) {
            console.error("Error fetching shop items:", err);
        }
    };

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${product.name} added to cart! 🛒`);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // --- SORTING & FILTERING LOGIC ---
    const getProcessedProducts = () => {
        // 1. Filter first
        let result = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesEco = filterEco ? (product.ecoRating === 'A' || product.ecoRating === 'B') : true;
            return matchesSearch && matchesEco;
        });

        // 2. Then Sort
        if (sortOption === "priceLow") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === "priceHigh") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === "co2Low") {
            // Sort by CO2 (Lowest is best)
            result.sort((a, b) => (a.carbonFootprint || 0) - (b.carbonFootprint || 0));
        }

        return result;
    };

    const filteredProducts = getProcessedProducts();

    return (
        <div className="pro-body">
            {/* NAVBAR */}
            <div className="navbar" style={{ borderBottom: "4px solid #3498db" }}>
                <div className="brand-logo" style={{ color: "#3498db" }}>EcoBazaar Shop 🛒</div>
                <div className="nav-buttons">
                    <button className="btn-profile" onClick={() => navigate("/cart")} style={{marginRight: "10px"}}>
                        View Cart 🛍️
                    </button>
                    <button className="btn-profile" onClick={() => navigate("/profile")}>My Profile</button>
                    <button className="btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* SEARCH, FILTER & SORT BAR */}
            <div style={{ maxWidth: "1200px", margin: "30px auto", padding: "0 20px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="🔍 Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, padding: "12px", borderRadius: "25px", border: "1px solid #ccc", outline: "none", minWidth: "200px" }}
                />

                {/* Filter Checkbox */}
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", userSelect: "none", background: "white", padding: "10px", borderRadius: "20px", border: "1px solid #ddd" }}>
                    <input type="checkbox" checked={filterEco} onChange={(e) => setFilterEco(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "#27ae60" }} />
                    <span style={{ fontSize: "0.9rem", color: "#333" }}>🌱 Eco Only</span>
                </label>

                {/* Sort Dropdown */}
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    style={{ padding: "12px", borderRadius: "20px", border: "1px solid #ccc", outline: "none", cursor: "pointer", background: "white" }}
                >
                    <option value="default">Sort By: Featured</option>
                    <option value="priceLow">💰 Price: Low to High</option>
                    <option value="priceHigh">💰 Price: High to Low</option>
                    <option value="co2Low">🌍 CO2: Lowest First</option>
                </select>
            </div>

            {/* PRODUCT GRID */}
            <div className="pro-container" style={{ marginTop: "0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "30px", width: "100%" }}>
                    {filteredProducts.map(product => (
                        <div key={product.id} className="pro-card" style={{ padding: "0", overflow: "hidden", border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>

                            {/* CLICKABLE IMAGE CONTAINER */}
                            <div
                                onClick={() => navigate(`/product/${product.id}`)}
                                style={{ height: "180px", background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer" }}
                            >
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                ) : <span style={{ color: "#aaa" }}>No Image</span>}

                                <div style={{
                                    position: "absolute", top: "10px", right: "10px",
                                    background: product.ecoRating === 'A' ? '#2ecc71' : product.ecoRating === 'B' ? '#f1c40f' : '#e74c3c',
                                    color: "white", padding: "5px 10px", borderRadius: "15px", fontSize: "0.8rem", fontWeight: "bold",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                                }}>
                                    {product.ecoRating === 'A' ? '🌿 Excellent' : product.ecoRating === 'B' ? '⚠️ Good' : '🏭 High Impact'}
                                </div>
                            </div>

                            <div style={{ padding: "20px", textAlign: "left" }}>
                                {/* CLICKABLE TITLE */}
                                <h3
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    style={{ margin: "0 0 10px 0", fontSize: "1.1rem", color: "#2c3e50", cursor: "pointer", textDecoration: "underline" }}
                                >
                                    {product.name}
                                </h3>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
                                    <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#2c3e50" }}>${product.price}</span>
                                    <div style={{ textAlign: "right", fontSize: "0.8rem", color: "#7f8c8d" }}>
                                        <div>CO2: <b>{product.carbonFootprint || 0} kg</b></div>
                                        <div>Grade: <b>{product.ecoRating || "?"}</b></div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => addToCart(product)}
                                    style={{ width: "100%", marginTop: "15px", padding: "10px", background: "#3498db", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                                >
                                    Add to Cart 🛒
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default Shop;