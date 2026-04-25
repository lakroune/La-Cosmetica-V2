import axios from "axios";
import { ShoppingCart, Search, X, Loader2, PackageOpen, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
            setCartCount(cart.items.length);
        };
        updateCartCount();
        window.addEventListener("cartUpdated", updateCartCount);
        return () => window.removeEventListener("cartUpdated", updateCartCount);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/products"),
                    axios.get("http://127.0.0.1:8000/api/categories"),
                ]);
                setProducts(prodRes.data);
                setCategories(catRes.data);
            } catch {
                toast.error("Erreur de chargement des données");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        return `http://127.0.0.1:8000/storage/${imagePath.replace(/^\//, "")}`;
    };

    const filteredProducts = products.filter((p) => {
        const matchesCategory =
            selectedCategory === "all" ||
            p.category?.slug === selectedCategory ||
            p.category_id == selectedCategory;
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const openCartModal = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setIsModalOpen(true);
    };

    const addToCart = () => {
        const existingCart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
        const idx = existingCart.items.findIndex((i) => i.product_id === selectedProduct.id);
        if (idx > -1) {
            existingCart.items[idx].quantity += quantity;
        } else {
            existingCart.items.push({ product_id: selectedProduct.id, quantity });
        }
        localStorage.setItem("cart", JSON.stringify(existingCart));
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success(`${quantity} × ${selectedProduct.name} ajouté au panier`);
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-rose-50">
            <div className="bg-white border-b border-rose-100 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 flex-1 bg-white focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                        <Search size={15} className="text-rose-300 shrink-0" />
                        <input
                            placeholder="Rechercher un produit..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="text-sm outline-none w-full text-gray-700 placeholder-gray-300 bg-transparent"
                        />
                        {searchQuery && (
                            <X size={14} className="text-gray-300 cursor-pointer hover:text-rose-400 transition-colors" onClick={() => setSearchQuery("")} />
                        )}
                    </div>

                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white focus-within:border-rose-300 transition-all">
                        <SlidersHorizontal size={14} className="text-rose-300 shrink-0" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="text-sm text-gray-600 outline-none bg-transparent cursor-pointer"
                        >
                            <option value="all">Toutes les catégories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.slug || cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {selectedCategory !== "all" && (
                        <button onClick={() => setSelectedCategory("all")} className="p-2 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-100 transition-colors">
                            <X size={14} />
                        </button>
                    )}

                    {cartCount > 0 && (
                        <div className="flex items-center gap-1.5 bg-rose-400 text-white text-xs font-medium px-3 py-2 rounded-xl">
                            <ShoppingCart size={14} />
                            {cartCount}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="flex items-center justify-center gap-2 py-24 text-gray-300">
                        <Loader2 size={22} className="animate-spin" />
                        <span className="text-sm">Chargement des produits...</span>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-300">
                        <PackageOpen size={48} strokeWidth={1.2} />
                        <p className="mt-3 text-sm">Aucun produit trouvé.</p>
                        {(searchQuery || selectedCategory !== "all") && (
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                                className="mt-3 text-xs text-rose-400 hover:underline"
                            >
                                Réinitialiser les filtres
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {filteredProducts.map((product) => {
                            const currentImgIndex = activeImage[product.id] || 0;
                            const currentImageUrl = product.images?.[currentImgIndex]?.url;

                            return (
                                <div key={product.id} className="bg-white rounded-2xl border border-rose-100 overflow-hidden group hover:shadow-md hover:shadow-rose-100 transition-all duration-200">
                                    <div className="h-48 bg-rose-50 relative overflow-hidden">
                                        {product.images?.length > 0 ? (
                                            <img
                                                src={getImageUrl(currentImageUrl)}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-rose-200">
                                                <PackageOpen size={36} strokeWidth={1.2} />
                                            </div>
                                        )}

                                        <button
                                            onClick={() => openCartModal(product)}
                                            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full text-rose-400 shadow-sm hover:bg-rose-400 hover:text-white transition-all duration-150"
                                        >
                                            <ShoppingCart size={14} />
                                        </button>

                                        {product.stock === 0 && (
                                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                                                Épuisé
                                            </div>
                                        )}
                                    </div>

                                    {product.images?.length > 1 && (
                                        <div className="grid grid-cols-4 gap-1 px-1 pt-1">
                                            {product.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={getImageUrl(image.url)}
                                                    alt="thumb"
                                                    onClick={() => setActiveImage((prev) => ({ ...prev, [product.id]: index }))}
                                                    className={`w-full h-10 object-cover rounded cursor-pointer border-2 transition-all ${
                                                        currentImgIndex === index
                                                            ? "border-rose-400 opacity-100"
                                                            : "border-transparent opacity-50 hover:opacity-80"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <div className="p-3">
                                        <div className="flex items-start justify-between gap-1">
                                            <h3 className="text-sm font-semibold text-gray-800 truncate leading-tight">{product.name}</h3>
                                            <span className="text-sm font-bold text-rose-500 shrink-0">{product.price} DH</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-0.5">
                                            <span className="text-[10px] text-gray-400 uppercase tracking-wide">{product.category?.name}</span>
                                            <span className={`text-[10px] font-medium ${product.stock > 0 ? "text-emerald-500" : "text-red-400"}`}>
                                                {product.stock > 0 ? `${product.stock} pcs` : "Épuisé"}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{product.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {isModalOpen && selectedProduct && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
                >
                    <div className="bg-white rounded-2xl border border-rose-100 shadow-xl w-full max-w-xs overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />
                        <div className="p-5">
                            <div className="flex items-center gap-3 mb-5">
                                {selectedProduct.images?.[0] && (
                                    <img
                                        src={getImageUrl(selectedProduct.images[0].url)}
                                        alt={selectedProduct.name}
                                        className="w-12 h-12 rounded-xl object-cover border border-rose-100"
                                    />
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{selectedProduct.name}</p>
                                    <p className="text-xs text-rose-500 font-medium">{selectedProduct.price} DH / pièce</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="ml-auto p-1.5 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-500 transition-colors">
                                    <X size={15} />
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-4 mb-5">
                                <button
                                    disabled={quantity <= 1}
                                    onClick={() => setQuantity((q) => q - 1)}
                                    className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-lg font-medium text-gray-600 hover:border-rose-300 hover:text-rose-500 disabled:opacity-30 transition-all"
                                >−</button>
                                <span className="text-xl font-bold text-gray-800 w-10 text-center">{quantity}</span>
                                <button
                                    disabled={quantity >= selectedProduct.stock}
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-lg font-medium text-gray-600 hover:border-rose-300 hover:text-rose-500 disabled:opacity-30 transition-all"
                                >+</button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">Total : <span className="font-semibold text-gray-700">{(quantity * selectedProduct.price).toFixed(2)} DH</span></span>
                                <button
                                    onClick={addToCart}
                                    className="flex items-center gap-1.5 bg-rose-400 hover:bg-rose-500 active:scale-95 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all"
                                >
                                    <ShoppingCart size={14} /> Ajouter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;