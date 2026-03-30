import axios from "axios";
import { ShoppingCart, Eye, LayoutGrid, Search, ShoppingCartIcon, X } from "lucide-react";
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

    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
            setCartCount(cart.items.length);
        };

        updateCartCount();
    }, [isModalOpen]);
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        const cleanPath = imagePath.replace(/^\//, '');
        return `http://127.0.0.1:8000/storage/${cleanPath}`;
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/products"),
                    axios.get("http://127.0.0.1:8000/api/categories")
                ]);
                setProducts(prodRes.data);
                setCategories(catRes.data);
            } catch (error) {
                toast.error("Erreur de chargement des données");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = selectedCategory === "all"
        ? products
        : products.filter(p => p.category?.slug === selectedCategory || p.category_id == selectedCategory);
    const openCartModal = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setIsModalOpen(true);
    };

    const addToCart = () => {
        const existingCart = JSON.parse(localStorage.getItem("cart")) || { items: [] };

        const existingItemIndex = existingCart.items.findIndex(
            (item) => item.product_id === selectedProduct.id
        );

        if (existingItemIndex > -1) {
            existingCart.items[existingItemIndex].quantity += quantity;
        } else {
            existingCart.items.push({
                product_id: selectedProduct.id,
                quantity: quantity,
            });
        }

        localStorage.setItem("cart", JSON.stringify(existingCart));

        toast.success(`${quantity} x ${selectedProduct.name} ajouté au panier`);
        setIsModalOpen(false);

    };
    return (


        <div className="min-h-screen bg-gray-50">
            <div className="bg-white   p-4 mb-8">
                <div className="flex justify-between ">
                    <h1 className=" flex gap-2 items-center">
                        <LayoutGrid /> Cosmetica
                    </h1>
                    <div className="  flex gap-4   text-blue-600  text-[14px]">
                        <a href=""> Home</a>
                        <a href=""> my order</a>
                    </div>
                    <div className=" flex gap-4">

                        <div className="relative cursor-pointer">
                            <ShoppingCartIcon className="text-blue-600 relative" />
                            {cartCount > 0 && (
                                <div className="bg-red-600 w-4 h-4 absolute -top-1 -right-1 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                                    {cartCount}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">

                <div className="relative flex justify-end ">
                    <div className="flex   border items-center">
                        <Search size={20} className=" text-blue-600" />
                        <input
                            type="text"
                            placeholder="Rechercher"
                            className="  border-gray-300  text-sm outline-none px-2 py-1  "
                        />

                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className=" border border-gray-300 bg-white  text-gray-700 text-sm     block p-2 px-4 pr-10 outline-none  "
                    >

                        <option value="all">Toutes les catégories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.slug || cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>


                </div>

                {selectedCategory !== "all" && (
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className="text-xs text-red-500 hover:underline font-medium"
                    >
                        <X size={20} className=" text-red-600" />
                    </button>
                )}
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-12">
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Chargement des produits...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => {
                            const currentImgIndex = activeImage[product.id] || 0;
                            const currentImageUrl = product.images?.[currentImgIndex]?.url;

                            return (
                                <div key={product.id} className="bg-white overflow-hidden p-1 group border border-gray-100  -lg shadow-sm">
                                    <div className="h-48 bg-gray-200 relative   overflow-hidden">
                                        {product.images && product.images.length > 0 ? (
                                            <img
                                                src={getImageUrl(currentImageUrl)}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-all duration-300"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400 italic">Pas d'image</div>
                                        )}

                                        <div
                                            onClick={() => openCartModal(product)}
                                            className="absolute top-2 right-2 bg-white/90 p-1.5   -full text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                                        >
                                            <ShoppingCart size={14} />
                                        </div>

                                    </div>

                                    <div className="grid grid-cols-4 max-h-12 min-h-12 gap-1 mt-1 h-12">
                                        {product.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={getImageUrl(image.url)}
                                                alt="thumbnail"
                                                onClick={() => setActiveImage(prev => ({ ...prev, [product.id]: index }))}
                                                className={`w-full h-full object-cover max-h-12 min-h-12  cursor-pointer border-2 transition-all ${currentImgIndex === index ? "border-blue-500 scale-95" : "border-transparent opacity-70 hover:opacity-100"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <div className="p-2">
                                        <h3 className="flex justify-between items-center text-blue-600 font-bold">
                                            <span className="text-[13px] truncate  w-2/3">{product.name}</span>
                                            <span className="text-[12px]">{product.price} DH</span>
                                        </h3>
                                        <p className="text-[8px] text-gray-400 flex justify-between uppercase tracking-wider">
                                            <span>{product.category?.name}</span>
                                            <span>{product.stock} pieces</span>

                                        </p>
                                        <p className="text-gray-500 text-[11px] mt-1 line-clamp-2  h-8 leading-tight">
                                            <span>{product.description}</span>
                                            <span>{product.stock}</span>

                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-20 bg-white  -xl border border-dashed">
                        <p className="text-gray-400">Aucun produit trouvé dans cette catégorie.</p>
                    </div>
                )}
            </div>
            {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 w-full h-full">
                    <div className="bg-white   min-w-[200px] ">
                        <div className="p-1 flex justify-end">

                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="  text-red-600 text-xl" />
                            </button>
                        </div>
                        <div className="bg-gray-50      ">
                            <div className="flex items-center justify-center  ">
                                <button
                                    disabled={quantity <= 1}
                                    onClick={() => setQuantity(q => q - 1)}
                                    className="w-5 h-5   border bg-white flex items-center justify-center text-xl font-bold disabled:opacity-30"
                                > - </button>

                                <span className="text-[14px] font-bold text-gray-800 w-12 text-center">{quantity}</span>

                                <button
                                    disabled={quantity >= selectedProduct.stock}
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-5 h-5  -full border bg-white flex items-center justify-center text-xl font-bold disabled:opacity-30"
                                > + </button>
                            </div>
                            <div className="flex justify-end gap-2 p-2">
                                <button
                                    onClick={addToCart}
                                    className="  p-0.5  bg-blue-600 text-white  self-end"
                                >
                                    Confirmer
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