import axios from "axios";
import { Lock, Mail, User, ArrowRight } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitLesInfo = async () => {
        if (password !== passwordConfirmation) {
            return toast.error("Les mots de passe ne correspondent pas");
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/api/register", {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            if (response.status === 201) {
                toast.success("Inscription réussie !");
                navigate("/login");
            } else {
                toast.error("Inscription échouée");
            }
        } catch (error) {
            toast.error("Erreur d'inscription");
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { label: "Nom complet", placeholder: "Votre nom", type: "text", icon: User, value: name, setter: setName },
        { label: "Email", placeholder: "vous@exemple.com", type: "email", icon: Mail, value: email, setter: setEmail },
        { label: "Mot de passe", placeholder: "••••••••", type: "password", icon: Lock, value: password, setter: setPassword },
        { label: "Confirmer", placeholder: "••••••••", type: "password", icon: Lock, value: passwordConfirmation, setter: setPasswordConfirmation },
    ];

    return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">

                <div className="h-1 w-full bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />

                <div className="px-8 py-10">
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 mb-4">
                            <span className="text-xl">🌿</span>
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">La Cosmetica</h1>
                        <p className="text-sm text-gray-400 mt-1">Créez votre compte gratuitement</p>
                    </div>

                    <div className="space-y-4">
                        {fields.map(({ label, placeholder, type, icon: Icon, value, setter }) => (
                            <div key={label}>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                                    {label}
                                </label>
                                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                                    <Icon size={16} className="text-rose-300 shrink-0" />
                                    <input
                                        type={type}
                                        value={value}
                                        onChange={(e) => setter(e.target.value)}
                                        placeholder={placeholder}
                                        className="text-sm text-gray-700 placeholder-gray-300 outline-none w-full bg-transparent"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={submitLesInfo}
                        disabled={loading}
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-rose-400 hover:bg-rose-500 active:scale-95 text-white text-sm font-medium rounded-lg py-2.5 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                S'inscrire <ArrowRight size={15} />
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        Déjà un compte ?{" "}
                        <a href="/login" className="text-rose-400 hover:text-rose-500 font-medium transition-colors">
                            Se connecter
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;