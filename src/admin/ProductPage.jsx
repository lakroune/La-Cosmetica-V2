import axios from "axios";
import { Trash2, Edit3, Plus, Package, DollarSign, Layers, Image as ImageIcon, AlignLeft, X, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "", description: "", price: "", stock: "", category_id: "", images: []
    });
    const [existingImages, setExistingImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const headers = { Authorization: `Bearer ${Cookies.get("token")}` };

    const fetchInitialData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get("http://127.0.0.1:8000/api/products", { headers }),
                axios.get("http://127.0.0.1:8000/api/categories", { headers })
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch {
            toast.error("Erreur lors du chargement des données");
        }
    };

    useEffect(() => { fetchInitialData(); }, []);

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 4) {
            toast.error("Limite de 4 images par produit dépassée");
            e.target.value = null;
            return;
        }
        setFormData((prev) => ({ ...prev, images: files }));
    };

    const addProduct = async () => {
        if (!formData.name.trim()) return toast.error("Le nom est requis");
        setLoading(true);
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        data.append("category_id", formData.category_id);
        formData.images.forEach((file) => data.append("images[]", file));

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/products", data, {
                headers: { ...headers, "Content-Type": "multipart/form-data" },
            });
            if (response.status === 201) {
                toast.success("Produit ajouté !");
                fetchInitialData();
                resetForm();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur d'ajout");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setIsEditing(true);
        setEditingId(product.slug);
        setExistingImages(product.images || []);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category_id: product.category_id,
            images: []
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const updateProduct = async () => {
        setLoading(true);
        const data = new FormData();
        data.append("_method", "PUT");
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        data.append("category_id", formData.category_id);
        formData.images.forEach((file) => data.append("images[]", file));

        try {
            await axios.post(`http://127.0.0.1:8000/api/products/${editingId}`, data, {
                headers: { ...headers, "Content-Type": "multipart/form-data" },
            });
            toast.success("Produit modifié !");
            fetchInitialData();
            resetForm();
        } catch {
            toast.error("Erreur lors de la modification");
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (slug) => {
        if (!window.confirm("Supprimer ce produit ?")) return;
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/products/${slug}`, { headers });
            if (response.status === 200 || response.status === 204) {
                toast.success("Produit supprimé");
                setProducts(products.filter((p) => p.slug !== slug));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    const resetForm = () => {
        setFormData({ name: "", description: "", price: "", stock: "", category_id: "", images: [] });
        setExistingImages([]);
        setIsEditing(false);
        setEditingId(null);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        return `http://127.0.0.1:8000/storage/${imagePath.replace(/^\//, "")}`;
    };

    const set = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

    return (
        <div className="min-h-screen bg-rose-50 p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800 tracking-tight flex items-center gap-2">
                    <Package size={22} className="text-rose-400" />
                    Produits
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">Gérez votre catalogue de produits</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Table */}
                <div className="md:col-span-2 bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                            <Package size={40} strokeWidth={1.2} />
                            <p className="mt-3 text-sm">Aucun produit trouvé</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-rose-50 bg-rose-50/60">
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Produit</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Prix</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-rose-50">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-rose-50/40 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {p.images?.[0] ? (
                                                    <img
                                                        src={getImageUrl(p.images[0].url)}
                                                        alt={p.name}
                                                        className="w-9 h-9 rounded-lg object-cover border border-rose-100"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center">
                                                        <ImageIcon size={14} className="text-rose-300" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-800">{p.name}</div>
                                                    <div className="text-xs text-gray-400 truncate max-w-[140px]">{p.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-semibold text-rose-500">{p.price} DH</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.stock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-400"}`}>
                                                {p.stock} pcs
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg text-rose-300 hover:bg-rose-50 hover:text-rose-500 transition-colors">
                                                    <Edit3 size={15} />
                                                </button>
                                                <button onClick={() => deleteProduct(p.slug)} className="p-1.5 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-400 transition-colors">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden h-fit sticky top-6">
                    <div className="h-1 w-full bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                {isEditing ? <RefreshCw size={16} className="text-rose-400" /> : <Plus size={16} className="text-rose-400" />}
                                {isEditing ? "Modifier le produit" : "Nouveau produit"}
                            </h2>
                            {isEditing && (
                                <button onClick={resetForm} className="p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors">
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Nom</label>
                                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                                    <Package size={15} className="text-rose-300 shrink-0" />
                                    <input type="text" value={formData.name} onChange={set("name")} placeholder="Nom du produit"
                                        className="text-sm text-gray-700 placeholder-gray-300 outline-none w-full bg-transparent" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Description</label>
                                <div className="flex items-start gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                                    <AlignLeft size={15} className="text-rose-300 shrink-0 mt-0.5" />
                                    <textarea value={formData.description} onChange={set("description")} placeholder="Description..." rows={2}
                                        className="text-sm text-gray-700 placeholder-gray-300 outline-none w-full bg-transparent resize-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Prix</label>
                                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                                        <DollarSign size={14} className="text-rose-300 shrink-0" />
                                        <input type="number" value={formData.price} onChange={set("price")} placeholder="0.00"
                                            className="text-sm text-gray-700 placeholder-gray-300 outline-none w-full bg-transparent" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Stock</label>
                                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                                        <Layers size={14} className="text-rose-300 shrink-0" />
                                        <input type="number" value={formData.stock} onChange={set("stock")} placeholder="0"
                                            className="text-sm text-gray-700 placeholder-gray-300 outline-none w-full bg-transparent" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Catégorie</label>
                                <select
                                    value={formData.category_id}
                                    onChange={set("category_id")}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all bg-white"
                                >
                                    <option value="">Choisir une catégorie</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                                    <ImageIcon size={12} /> Images (max 4)
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImages}
                                    className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-rose-50 file:text-rose-500 file:text-xs file:font-medium hover:file:bg-rose-100 transition-all"
                                />

                                {/* Image previews */}
                                {(existingImages.length > 0 || formData.images.length > 0) && (
                                    <div className="grid grid-cols-4 gap-1.5 mt-2">
                                        {isEditing && existingImages.map((img, i) => (
                                            <div key={`old-${i}`} className="relative">
                                                <img src={getImageUrl(img.url)} alt="" className="w-full h-14 object-cover rounded-lg border border-rose-100 opacity-60" />
                                                <span className="absolute bottom-0.5 left-0.5 bg-gray-700/60 text-[7px] text-white px-1 rounded">actuelle</span>
                                            </div>
                                        ))}
                                        {formData.images.map((f, i) => (
                                            <div key={`new-${i}`} className="relative">
                                                <img src={URL.createObjectURL(f)} alt="" className="w-full h-14 object-cover rounded-lg border border-rose-200" />
                                                <span className="absolute bottom-0.5 left-0.5 bg-rose-500/80 text-[7px] text-white px-1 rounded">nouveau</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                onClick={isEditing ? updateProduct : addProduct}
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-2 text-white text-sm font-medium rounded-lg py-2.5 transition-all duration-150 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-1
                  ${isEditing ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-400 hover:bg-rose-500"}`}
                            >
                                {loading ? (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : isEditing ? (
                                    <><RefreshCw size={14} /> Mettre à jour</>
                                ) : (
                                    <><Plus size={14} /> Enregistrer</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;