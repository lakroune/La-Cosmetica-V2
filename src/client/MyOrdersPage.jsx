import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Package, Loader2, ShoppingBag, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const statusConfig = {
    pending: { label: "En attente", color: "bg-amber-50 text-amber-500 border-amber-100", icon: Clock },
    processing: { label: "En préparation", color: "bg-blue-50 text-blue-500 border-blue-100", icon: Package },
    shipped: { label: "Expédiée", color: "bg-indigo-50 text-indigo-500 border-indigo-100", icon: Truck },
    delivered: { label: "Livrée", color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: CheckCircle2 },
    cancelled: { label: "Annulée", color: "bg-red-50 text-red-400 border-red-100", icon: XCircle },
};

const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || {
        label: status,
        color: "bg-gray-50 text-gray-500 border-gray-100",
        icon: Clock,
    };
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
            <Icon size={11} />
            {cfg.label}
        </span>
    );
};

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) { navigate("/"); return; }

        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/orders", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data);
            } catch {
                toast.error("Erreur de chargement des commandes");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const cancelOrder = async (orderId) => {
        if (!window.confirm("Annuler cette commande ?")) return;
        try {
            await axios.patch(
                `http://127.0.0.1:8000/api/orders/${orderId}/cancel`,
                {},
                { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
            );
            toast.success("Commande annulée");
            setOrders(orders.map((o) => o.id === orderId ? { ...o, status: "cancelled" } : o));
        } catch {
            toast.error("Impossible d'annuler cette commande");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-300">
                    <Loader2 size={22} className="animate-spin" />
                    <span className="text-sm">Chargement de vos commandes...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-rose-50 p-6">
            <div className="max-w-3xl mx-auto mb-6">
                <h1 className="text-2xl font-semibold text-gray-800 tracking-tight flex items-center gap-2">
                    <ShoppingBag size={22} className="text-rose-400" />
                    Mes Commandes
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">Suivez l'état de vos commandes</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-5">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-rose-100 flex flex-col items-center justify-center py-20 text-gray-300">
                        <ShoppingBag size={48} strokeWidth={1.2} />
                        <p className="mt-3 text-sm">Aucune commande trouvée.</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
                            <div className="h-1 w-full bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />

                            <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-rose-50">
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Date</p>
                                        <p className="text-sm font-medium text-gray-700">
                                            {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Commande</p>
                                        <p className="text-sm font-medium text-gray-700">#ORD-{order.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Statut</p>
                                        <StatusBadge status={order.status} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Total</p>
                                        <p className="text-base font-bold text-rose-500">{order.total_price} DH</p>
                                    </div>
                                    {order.status === "pending" && (
                                        <button
                                            onClick={() => cancelOrder(order.id)}
                                            className="text-xs text-red-400 hover:text-red-600 border border-red-100 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            Annuler
                                        </button>
                                    )}
                                </div>
                            </div>

                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-rose-50/50">
                                        <th className="px-5 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Produit</th>
                                        <th className="px-5 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-center">Qté</th>
                                        <th className="px-5 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-right">Prix unit.</th>
                                        <th className="px-5 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-right">Sous-total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-rose-50">
                                    {order.products.map((product) => (
                                        <tr key={product.id} className="hover:bg-rose-50/30 transition-colors">
                                            <td className="px-5 py-3">
                                                <p className="text-sm font-medium text-gray-700">{product.name}</p>
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                <span className="text-xs font-semibold text-gray-500 bg-rose-50 px-2 py-0.5 rounded-full">
                                                    ×{product.pivot.quantity}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right text-sm text-gray-400">
                                                {product.pivot.unit_price} DH
                                            </td>
                                            <td className="px-5 py-3 text-right text-sm font-bold text-gray-700">
                                                {(product.pivot.quantity * product.pivot.unit_price).toFixed(2)} DH
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;