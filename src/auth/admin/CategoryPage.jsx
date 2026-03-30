import axios from "axios";
import { Trash2, Edit3, Tag, AlignLeft, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie"; // Matensach t-installi: npm install js-cookie

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/categories", {
                headers: { Authorization: `Bearer ${Cookies.get("token")}` },
            });
            setCategories(response.data);
        } catch (error) {
            toast.error("Error fetching categories");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        try {
            await axios.post("http://127.0.0.1:8000/api/categories", 
                { name, description },
                { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
            );
            toast.success("Catégorie ajoutée !");
            setName("");
            setDescription("");
            fetchCategories(); // Refresh list
        } catch (error) {
            toast.error("Erreur lors de l'ajout");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white         overflow-hidden border border-gray-100">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-600">ID</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Nom</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Description</th>
                                <th className="p-3 text-sm font-semibold text-gray-600 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((category) => (
                                <tr key={category.id} className="  border hover:bg-gray-50">
                                    <td className="p-3 text-sm">#{category.id}</td>
                                    <td className="p-3 text-sm font-medium">{category.name}</td>
                                    <td className="p-3 text-sm text-gray-500">{category.description}</td>
                                    <td className="p-3 flex justify-center gap-3">
                                        <button className="text-blue-500 hover:text-blue-700 transition-colors">
                                            <Edit3 size={18} />
                                        </button>
                                        <button className="text-red-500 hover:text-red-700 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white          p-6 border border-gray-100 h-fit sticky top-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                       add category
                    </h2>
                    
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 border    p-2 focus-within:border-blue-500 transition-all">
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nom de catégorie" 
                                className="outline-none w-full text-sm" 
                            />
                        </div>

                        <div className="flex items-start gap-2 border    p-2 focus-within:border-blue-500 transition-all">
                            <AlignLeft size={18} className="text-blue-600 mt-1" />
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description..." 
                                className="outline-none w-full text-sm h-24 resize-none"
                            />
                        </div>

                        <button 
                            onClick={handleAddCategory}
                            className="bg-blue-600 text-white p-2    font-medium hover:bg-blue-700 transition-all   -md mt-2"
                        >
                            Enregistrer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;