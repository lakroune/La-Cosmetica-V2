import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Package, ChevronRight, LayoutGrid, ShoppingCartIcon, ZodiacCancer, LucideZodiacVirgo } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [isAuth, setIsAuth] = useState(false);
    useEffect(() => {
        const token = Cookies.get("token");

        if (token) {
            setIsAuth(true);

        } else {
            setIsAuth(false);
            navigate("/");
        }
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = Cookies.get("token");
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/orders", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (error) {
                toast.error("Erreur de chargement");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="text-center flex justify-center items-center gap-2 py-20 text-gray-400">
        <ZodiacCancer className="animate-spin" />
        Chargement...</div>;

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">

            <div className="max-w-5xl mx-auto ">


                <div className="space-y-10">
                    {orders.map((order) => (
                        <div key={order.id} className="border     overflow-hidden  ">
                            <div className="bg-gray-50 px-4  py-1 border-b flex justify-between items-center flex-wrap gap-4">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Date</p>
                                        <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">N° Commande</p>
                                        <p className="text-sm font-medium">#ORD-{order.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Statut</p>
                                        <span className="text-[11px] font-bold text-orange-600 uppercase italic">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Total</p>
                                    <p className="  font-black text-blue-600">{order.total_price} DH</p>
                                </div>
                            </div>

                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white border-b text-[11px] text-gray-400 uppercase">
                                    <tr>
                                        <th className="px-4 py-2 font-medium">Produit</th>
                                        <th className="px-4 py-2 font-medium text-center">Quantité</th>
                                        <th className="px-4 py-2 font-medium text-right">Prix Unitaire</th>
                                        <th className="px-4 py-2 font-medium text-right">Sous-total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {order.products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-2 py-2">
                                                <p className="text-[12px] text-gray-700 line-clamp-1">{product.name}</p>

                                            </td>
                                            <td className=" px-2 py-2 text-center text-sm font-medium text-gray-600">
                                                x{product.pivot.quantity}
                                            </td>
                                            <td className="px-2 py-2 text-right text-sm text-gray-500">
                                                {product.pivot.unit_price} DH
                                            </td>
                                            <td className="px-2 py-2 text-right text-sm font-bold text-gray-700">
                                                {(product.pivot.quantity * product.pivot.unit_price).toFixed(2)} DH
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>

                {orders.length === 0 && (
                    <div className=" flex justify-center items-center gap-4 py-20 text-center text-gray-400      ">
                        <ZodiacCancer className="text-gray-400 text-[90px]  duration-700 ease-in-out animate-spin" />
                        <p className="text-gray-400">Aucune commande trouvée.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;