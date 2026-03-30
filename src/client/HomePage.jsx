import axios from "axios";
import { ShoppingCart, Eye, LayoutGrid, Search, ShoppingCartIcon } from "lucide-react";
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
                        <div className="flex   border items-center">
                            <Search size={20} className=" text-blue-600" />
                            <input
                                type="text"
                                placeholder="Rechercher"
                                className="  border-gray-300  text-sm outline-none px-2 py-1 rounded"
                            />

                        </div>
                        <div className=" relative">
                            <ShoppingCartIcon className=" text-blue-600 relative " />
                            <div className="bg-red-600 w-3 h-3  absolute top-0 right-0  rounded-full "></div>
                        </div>
                    </div>

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
                                <div className=" grid grid-cols-4   max-h-20 border" >
                                    {product.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={getImageUrl(image.path)}
                                            alt={product.name}
                                            className="w-full border border-gray-200 h-full object-cover"
                                        />
                                    ))}
                                </div>
                                <div className="p-2">
                                    <h3 className="    flex justify-between  text-blue-600"><span className="font-bold text-[12px]">{product.name} </span > <span>{product.price} DH</span></h3>

                                    <p>
                                        <span className=" text-xs text-gray-400">{product.category?.name}</span>
                                    </p>
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