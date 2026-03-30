import axios from "axios";
import { Trash2, Edit3, Plus, Package, DollarSign, Layers, Image as ImageIcon, AlignLeft } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
        images: []
    });

    const fetchInitialData = async () => {
        const headers = { Authorization: `Bearer ${Cookies.get("token")}` };
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get("http://127.0.0.1:8000/api/products", { headers }),
                axios.get("http://127.0.0.1:8000/api/categories", { headers })
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) {
            toast.error("Erreur lors du chargement des données");
        }
    };

    useEffect(() => { fetchInitialData(); }, []);

    const addPhotoProduct = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 4) {
            toast.error("Limite de 4 images par produit dépassée");
            e.target.value = null;
            return;
        }
        setFormData({ ...formData, images: files });
    };

    const addProduct = async () => {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        data.append("category_id", formData.category_id);

        formData.images.forEach((file, index) => {
            data.append(`images[]`, file);
        });

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/products", data, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                    "Content-Type": "multipart/form-data"
                },
            });

            if (response.status === 201) {
                toast.success("Produit ajoute avec success");
                setProducts([...products, data]);
            } else {
                toast.error("Erreur lors de l'ajout");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur d'ajout");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="grid md:grid-cols-3 gap-6">

                <div className="md:col-span-2 bg-white overflow-hidden border border-gray-100 shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b text-gray-600">
                            <tr>
                                <th className="p-3 text-sm font-semibold">Produit</th>
                                <th className="p-3 text-sm font-semibold">Prix</th>
                                <th className="p-3 text-sm font-semibold">Stock</th>
                                <th className="p-3 text-sm font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3">
                                        <div className="text-sm font-medium text-gray-800">{p.name}</div>
                                        <div className="text-xs text-gray-400 truncate w-40">{p.description}</div>
                                    </td>
                                    <td className="p-3 text-sm font-semibold text-blue-600">{p.price} DH</td>
                                    <td className="p-3 text-sm">{p.stock} pcs</td>
                                    <td className="p-3 flex justify-center gap-2">
                                        <button className="text-blue-500 hover:bg-blue-50 p-1 rounded"><Edit3 size={16} /></button>
                                        <button className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white p-6 border border-gray-100 h-fit sticky top-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        Add Product
                    </h2>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 border p-2 focus-within:border-blue-500">
                            <Package size={18} className="text-blue-600" />
                            <input type="text" placeholder="Nom" className="outline-none w-full text-sm"
                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>

                        <div className="flex items-start gap-2 border p-2 focus-within:border-blue-500">
                            <AlignLeft size={18} className="text-blue-600 mt-1" />
                            <textarea placeholder="Description" className="outline-none w-full text-sm h-20 resize-none"
                                value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 border p-2 focus-within:border-blue-500">
                                <DollarSign size={18} className="text-blue-600" />
                                <input type="number" placeholder="Prix" className="outline-none w-full text-sm"
                                    value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="flex items-center gap-2 border p-2 focus-within:border-blue-500">
                                <Layers size={18} className="text-blue-600" />
                                <input type="number" placeholder="Stock" className="outline-none w-full text-sm"
                                    value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                            </div>
                        </div>

                        <select className="border p-2 outline-none text-sm focus:border-blue-500"
                            value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                            <option value="">Choisir Catégorie</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-500 font-medium ml-1 flex items-center gap-1">
                                <ImageIcon size={14} /> Images (Max 4)
                            </label>
                            <input type="file" multiple accept="image/*" onChange={addPhotoProduct}
                                className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            <div className="  grid grid-cols-1 md:grid-cols-2 gap-1">
                                {formData.images.length > 0 && formData.images.map((f, index) => <img key={index} src={URL.createObjectURL(f)} alt="img" className="w-32 h-32 object-cover mt-2" />)}
                            </div>
                        </div>

                        <button onClick={addProduct} className="bg-blue-600 text-white p-2 font-medium hover:bg-blue-700 transition-all mt-2 rounded">
                            Enregistrer Produit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;