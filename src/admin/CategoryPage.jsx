import axios from "axios";
import { Trash2, Edit3, Tag, AlignLeft, Plus, X, Check } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const headers = { Authorization: `Bearer ${Cookies.get("token")}` };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories", { headers });
      setCategories(response.data);
    } catch {
      toast.error("Erreur lors du chargement");
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const addCategory = async () => {
    if (!name.trim()) return toast.error("Le nom est requis");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/categories",
        { name, description },
        { headers }
      );
      if (response.status === 201) {
        toast.success("Catégorie ajoutée !");
        setName("");
        setDescription("");
        fetchCategories();
      }
    } catch {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDescription(cat.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/categories/${id}`,
        { name: editName, description: editDescription },
        { headers }
      );
      toast.success("Catégorie modifiée !");
      cancelEdit();
      fetchCategories();
    } catch {
      toast.error("Erreur lors de la modification");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`, { headers });
      toast.success("Catégorie supprimée");
      setCategories(categories.filter((c) => c.id !== id));
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight flex items-center gap-2">
          <Tag size={22} className="text-rose-400" />
          Catégories
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Gérez les catégories de vos produits</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Table */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-300">
              <Tag size={40} strokeWidth={1.2} />
              <p className="mt-3 text-sm">Aucune catégorie trouvée</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-rose-50 bg-rose-50/60">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nom</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-rose-50/40 transition-colors">
                    <td className="px-4 py-3">
                      {editingId === cat.id ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="text-sm border border-rose-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-rose-100 w-full"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === cat.id ? (
                        <input
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="text-sm border border-rose-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-rose-100 w-full"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">{cat.description}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        {editingId === cat.id ? (
                          <>
                            <button onClick={() => saveEdit(cat.id)} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-100 transition-colors">
                              <Check size={15} />
                            </button>
                            <button onClick={cancelEdit} className="p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors">
                              <X size={15} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(cat)} className="p-1.5 rounded-lg text-rose-300 hover:bg-rose-50 hover:text-rose-500 transition-colors">
                              <Edit3 size={15} />
                            </button>
                            <button onClick={() => deleteCategory(cat.id)} className="p-1.5 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-400 transition-colors">
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add Form */}
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden h-fit sticky top-6">
          <div className="h-1 w-full bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />
          <div className="p-6">
            <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Plus size={16} className="text-rose-400" />
              Nouvelle catégorie
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Nom</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                  <Tag size={15} className="text-rose-300 shrink-0" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Soins visage"
                    className="text-sm text-gray-700 placeholder-gray-300 outline-none w-full bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Description</label>
                <div className="flex items-start gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                  <AlignLeft size={15} className="text-rose-300 shrink-0 mt-0.5" />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description de la catégorie..."
                    rows={3}
                    className="text-sm text-gray-700 placeholder-gray-300 outline-none w-full bg-transparent resize-none"
                  />
                </div>
              </div>

              <button
                onClick={addCategory}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-rose-400 hover:bg-rose-500 active:scale-95 text-white text-sm font-medium rounded-lg py-2.5 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><Plus size={15} /> Enregistrer</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;