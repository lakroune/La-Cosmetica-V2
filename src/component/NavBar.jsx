import { LayoutGrid, ShoppingCartIcon, X, Delete } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const token = Cookies.get("token");
        setIsAuth(!!token);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
        const detailedItems = cart.items.map(cartItem => {
            const product = products.find(p => p.id === cartItem.product_id);
            return product ? { ...product, quantity: cartItem.quantity } : null;
        }).filter(item => item !== null);

        setCartItems(detailedItems);
        setCartCount(cart.items.length);
    }, [isCartOpen, products]);

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const removeFromCart = (productId) => {
        const cart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
        const updatedItems = cart.items.filter(item => item.product_id !== productId);
        localStorage.setItem("cart", JSON.stringify({ items: updatedItems }));
        setCartItems(prev => prev.filter(item => item.id !== productId));
        setCartCount(updatedItems.length);
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success("Produit retiré");
    };

    const payNow = async () => {
        if (loading) return;
        if (!isAuth) {
            toast.error("Veuillez vous connecter pour passer une commande");
            navigate('/login');
            return;
        }
        const cart = JSON.parse(localStorage.getItem("cart"));
        const token = Cookies.get("token");

        if (!cart || !cart.items || cart.items.length === 0) {
            toast.error("Votre panier est vide !");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("http://127.0.0.1:8000/api/orders", cart, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 201 || response.status === 200) {
                toast.success("Commande passée avec succès !");
                localStorage.removeItem("cart");
                setCartItems([]);
                setCartCount(0);
                setIsCartOpen(false);
                window.dispatchEvent(new Event("cartUpdated"));
            }
        } catch (error) {
            console.error("Order Error:", error);
            toast.error(error.response?.data?.message || "Erreur lors de la commande");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 mb-8 border-b border-gray-100">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className="flex gap-2 items-center text-blue-600 font-black uppercase tracking-wider">
                    <LayoutGrid /> Cosmetica
                </h1>
                <div className="flex gap-4 text-blue-600 text-[14px]">
                    <a href="/">Home</a>
                    {isAuth && <a href="/myorders">My Orders</a>}
                </div>
                <div className="flex gap-4">
                    <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
                        <ShoppingCartIcon className="text-blue-600" />
                        {cartCount > 0 && (
                            <div className="bg-red-600 w-4 h-4 absolute -top-1 -right-1 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                                {cartCount}
                            </div>
                        )}
                    </div>

                    {isCartOpen && (
                        <div className="fixed inset-0 z-[150] overflow-hidden">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
                            <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl flex flex-col">
                                <div className="p-4 border-b flex justify-between items-center bg-gray-800 text-white">
                                    <span className="font-bold text-sm">Mon Panier ({cartCount})</span>
                                    <button onClick={() => setIsCartOpen(false)}><X size={20} /></button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {cartItems.length === 0 ? (
                                        <p className="text-center text-gray-500 mt-10">Votre panier est vide.</p>
                                    ) : (
                                        cartItems.map((item) => (
                                            <div key={item.id} className="flex gap-3 border-b pb-3">
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                                                    <div className="flex justify-between mt-1">
                                                        <span className="text-xs text-gray-500">{item.quantity} x {item.price} DH</span>
                                                        <span className="text-sm font-semibold text-blue-600">{item.quantity * item.price} DH</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                                                    <Delete size={16} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {cartItems.length > 0 && (
                                    <div className="p-4 border-t bg-gray-50 space-y-4">
                                        <div className="flex justify-between items-center font-bold">
                                            <span>Total:</span>
                                            <span className="text-gray-800">{totalPrice.toFixed(2)} DH</span>
                                        </div>
                                        <button
                                            onClick={payNow}
                                            disabled={loading}
                                            className={`w-full py-3 font-bold transition-colors uppercase tracking-widest text-sm text-white rounded-lg
                                                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"}`}
                                        >
                                            {loading ? "En cours..." : "Pay Now"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavBar;