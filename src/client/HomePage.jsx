import axios from "axios";
import { ShoppingCart, Eye, LayoutGrid, Search } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm p-6 mb-8">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <LayoutGrid /> Cosmetica
                    </h1>


                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-12">
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Chargement des produits...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white overflow-hidden     group">
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={getImageUrl(product.images[0].path)}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400 font-light italic">Pas d'image</div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-blue-600 shadow-sm">
                                        <button className=" border-none bg-transparent ">
                                            <ShoppingCart size={12} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-2">
                                    <h3 className=" text-[12px] flex justify-between  text-blue-600"><span>{product.name}  <span className=" text-xs text-gray-400">{product.category?.name}</span></span> <span>{product.price} DH</span></h3>
                                    <p className="text-gray-500 text-xs mb-4 line-clamp-2 h-8">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">


                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                        <p className="text-gray-400">Aucun produit trouvé dans cette catégorie.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;