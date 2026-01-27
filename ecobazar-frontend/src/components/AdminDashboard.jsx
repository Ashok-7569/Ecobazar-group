import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Professional.css";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [pendingProducts, setPendingProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            await fetchUsers();
            await fetchProducts();
            await fetchPendingProducts();
        };
        load();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        try { setUsers((await axios.get("http://localhost:8084/users/all", { headers: { "Authorization": `Bearer ${token}` } })).data); } catch(e){}
    };
    const fetchProducts = async () => {
        const token = localStorage.getItem("token");
        try { setProducts((await axios.get("http://localhost:8084/products/seller-inventory", { headers: { "Authorization": `Bearer ${token}` } })).data); } catch(e){}
    };
    const fetchPendingProducts = async () => {
        const token = localStorage.getItem("token");
        try { setPendingProducts((await axios.get("http://localhost:8084/products/pending", { headers: { "Authorization": `Bearer ${token}` } })).data); } catch(e){}
    };

    const handleApprove = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(`http://localhost:8084/products/approve/${id}`, {}, { headers: { "Authorization": `Bearer ${token}` } });
            alert("Product Approved! 🟢");
            fetchPendingProducts();
            fetchProducts();
        } catch(e){ alert("Failed to approve."); }
    };

    const handleBanUser = async (id) => {
        if(window.confirm("Ban this user?")) {
            const token = localStorage.getItem("token");
            try { await axios.delete(`http://localhost:8084/users/delete/${id}`, { headers: { "Authorization": `Bearer ${token}` } }); fetchUsers(); } catch(e){}
        }
    };

    const handleDeleteProduct = async (id) => {
        if(window.confirm("Delete this product?")) {
            const token = localStorage.getItem("token");
            try { await axios.delete(`http://localhost:8084/products/delete/${id}`, { headers: { "Authorization": `Bearer ${token}` } }); fetchProducts(); fetchPendingProducts(); } catch(e){}
        }
    };

    const handleLogout = () => { localStorage.clear(); navigate("/"); };

    return (
        <div className="pro-body">
            <div className="navbar">
                <div className="brand-logo" style={{ background: "linear-gradient(135deg, #11998e, #38ef7d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    🛡️ Admin Panel
                </div>
                <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </div>

            <div className="pro-container">

                {/* --- SECTION 1: PENDING APPROVALS --- */}
                <div className="pro-card" style={{ marginBottom: "40px", padding: "30px", borderLeft: "6px solid #f39c12" }}>
                    <h2 style={{ marginTop: 0, color: "#2c3e50", display: "flex", alignItems: "center", gap: "10px" }}>
                        ⏳ Pending Approvals
                        <span style={{ background: "#f39c12", color: "white", padding: "2px 10px", borderRadius: "20px", fontSize: "1rem" }}>{pendingProducts.length}</span>
                    </h2>

                    {pendingProducts.length === 0 ? (
                        <p style={{ color: "#aaa", fontStyle: "italic" }}>All caught up! No items waiting.</p>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px", marginTop: "20px" }}>
                            {pendingProducts.map(p => (
                                <div key={p.id} style={{ background: "#fff", border: "1px solid #eee", padding: "20px", borderRadius: "16px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
                                    <div style={{ fontWeight: "700", fontSize: "1.1rem", marginBottom: "5px" }}>{p.name}</div>
                                    <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "15px" }}>${p.price} • {p.carbonFootprint}kg CO2</div>
                                    <button onClick={() => handleApprove(p.id)} className="btn-primary" style={{ width: "100%", borderRadius: "8px", fontSize: "0.9rem" }}>
                                        Approve ✅
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- SECTION 2: MANAGEMENT TABLES --- */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "30px" }}>

                    {/* USERS */}
                    <div className="pro-card" style={{ padding: "25px" }}>
                        <h3 style={{ marginTop: 0, borderBottom: "1px solid #eee", paddingBottom: "15px", color: "#2c3e50" }}>👤 User Management</h3>
                        <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                            {users.map(u => (
                                <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f9f9f9" }}>
                                    <div>
                                        <div style={{fontWeight: "600", color: "#444"}}>{u.email}</div>
                                        <div style={{fontSize: "0.8rem", color: u.role==='ADMIN'?'#e74c3c':'#27ae60'}}>{u.role}</div>
                                    </div>
                                    {u.role !== 'ADMIN' && (
                                        <button onClick={() => handleBanUser(u.id)} style={{ background: "#ffeaea", color: "#d63031", border: "none", padding: "5px 12px", borderRadius: "20px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}>
                                            Ban 🚫
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PRODUCTS */}
                    <div className="pro-card" style={{ padding: "25px" }}>
                        <h3 style={{ marginTop: 0, borderBottom: "1px solid #eee", paddingBottom: "15px", color: "#2c3e50" }}>📦 Live Inventory</h3>
                        <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                            {products.map(p => (
                                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f9f9f9" }}>
                                    <div>
                                        <div style={{fontWeight: "600", color: "#444"}}>{p.name}</div>
                                        <div style={{fontSize: "0.8rem", marginTop: "2px"}}>
                                            {p.isApproved ?
                                                <span style={{color:"#27ae60", background:"#eafaf1", padding:"2px 6px", borderRadius:"4px"}}>Live</span> :
                                                <span style={{color:"#f39c12", background:"#fef5e7", padding:"2px 6px", borderRadius:"4px"}}>Pending</span>
                                            }
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteProduct(p.id)} style={{ background: "#fff", border: "1px solid #eee", padding: "6px 10px", borderRadius: "8px", cursor: "pointer" }}>
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;