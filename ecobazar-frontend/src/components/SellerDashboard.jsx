import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Professional.css";

const SellerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Edit Mode State
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ name: "", price: "", description: "", imageUrl: "", carbonFootprint: "" });

    const navigate = useNavigate();

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const token = localStorage.getItem("token");
            // Fetch everything (pending + approved) for this seller
            const response = await axios.get("http://localhost:8084/products/seller-inventory", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setProducts(response.data);
        } catch (err) { console.error("Error loading inventory", err); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleEditClick = (product) => {
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            imageUrl: product.imageUrl,
            carbonFootprint: product.carbonFootprint
        });
        setEditId(product.id);
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleAddClick = () => {
        setFormData({ name: "", price: "", description: "", imageUrl: "", carbonFootprint: "" });
        setIsEditMode(false);
        setEditId(null);
        setShowModal(true);
    };

    const handlePublish = async () => {
        try {
            const token = localStorage.getItem("token");
            const payload = {
                ...formData,
                price: parseFloat(formData.price) || 0,
                carbonFootprint: parseFloat(formData.carbonFootprint) || 0
            };

            if (isEditMode) {
                await axios.put(`http://localhost:8084/products/update/${editId}`, payload, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                alert("Product Updated! (Admins may need to re-approve) 🔄");
            } else {
                await axios.post("http://localhost:8084/products/add", payload, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                alert("Product Submitted for Approval! ⏳");
            }

            setShowModal(false);
            fetchInventory();
        } catch (err) {
            console.error("Error saving:", err);
            alert("Failed to save product.");
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Permanently delete this item?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8084/products/delete/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchInventory();
        } catch (err) { alert("Delete failed."); }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="pro-body">
            {/* NAVBAR */}
            <div className="navbar">
                <div className="brand-logo">Seller Hub 📦</div>
                <div className="nav-buttons">
                    <button className="btn-primary" onClick={handleAddClick}>+ New Product</button>
                    <button className="btn-profile" onClick={() => navigate("/profile")}>Profile</button>
                    <button className="btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="pro-container">
                <h3 style={{ marginBottom: "25px", fontSize: "1.5rem", fontWeight: "600", color: "#2c3e50" }}>
                    Your Inventory
                </h3>

                {products.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px", color: "#888", background: "white", borderRadius: "16px" }}>
                        <p style={{fontSize: "1.2rem"}}>No items found. Start selling today! 🚀</p>
                        <button className="btn-primary" onClick={handleAddClick} style={{marginTop: "15px"}}>Create First Product</button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
                        {products.map(p => (
                            <div key={p.id} className="pro-card" style={{ position: "relative" }}>

                                {/* STATUS BADGE */}
                                <div style={{ position: "absolute", top: "15px", right: "15px", zIndex: 10 }}>
                                    {p.isApproved ? (
                                        <span className="badge badge-green">● Live</span>
                                    ) : (
                                        <span className="badge badge-pending">⏳ Pending</span>
                                    )}
                                </div>

                                {/* IMAGE */}
                                <div style={{ height: "180px", background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #eee" }}>
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                    ) : <span style={{color:"#ccc"}}>No Image</span>}
                                </div>

                                {/* INFO */}
                                <div style={{ padding: "20px" }}>
                                    <h4 style={{ margin: "0 0 10px 0", fontSize: "1.1rem", color: "#2c3e50" }}>{p.name}</h4>

                                    <div style={{ display: "flex", justifyContent: "space-between", color: "#666", fontSize: "0.9rem", marginBottom: "15px" }}>
                                        <span style={{ fontWeight: "700", color: "#2c3e50", fontSize: "1.1rem" }}>${p.price}</span>
                                        <span style={{ background: "#e0f2f1", color: "#00695c", padding: "2px 8px", borderRadius: "8px", fontSize: "0.8rem" }}>
                                            CO2: {p.carbonFootprint}kg
                                        </span>
                                    </div>

                                    {/* BUTTONS */}
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button onClick={() => handleEditClick(p)} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid #ddd", background: "white", cursor: "pointer", fontWeight: "600", color: "#555" }}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", background: "#ffeaea", color: "#d63031", cursor: "pointer", fontWeight: "600" }}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL */}
            {showModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(3px)" }}>
                    <div style={{ background: "white", padding: "30px", borderRadius: "16px", width: "400px", boxShadow: "0 20px 50px rgba(0,0,0,0.2)", position: "relative" }}>
                        <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#aaa" }}>&times;</button>

                        <h3 style={{ marginTop: 0, color: "#2c3e50", textAlign: "center" }}>
                            {isEditMode ? "Update Product ✏️" : "New Listing 🌿"}
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
                            <input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} />

                            <div style={{ display: "flex", gap: "10px" }}>
                                <input name="price" type="number" placeholder="Price ($)" value={formData.price} onChange={handleChange} />
                                <input name="carbonFootprint" type="number" placeholder="CO2 (kg)" value={formData.carbonFootprint} onChange={handleChange} />
                            </div>

                            <textarea name="description" placeholder="Short Description..." rows="3" value={formData.description} onChange={handleChange} style={{ resize: "none" }} />
                            <input name="imageUrl" placeholder="Image URL (http://...)" value={formData.imageUrl} onChange={handleChange} />

                            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: "#f1f2f6", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                                <button onClick={handlePublish} className="btn-primary" style={{ flex: 2, borderRadius: "8px" }}>
                                    {isEditMode ? "Save Changes" : "Submit Product"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerDashboard;