import axios from "axios";
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const submitLesInfo = async () => {
        if (password !== passwordConfirmation) {
            return toast.error("Passwords matchawch!");
        }

        try {
            const response = await axios.post("http://localhost:8000/api/register", {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            toast.success("Compte t-creea b naja7!");
            console.log(response.data);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Erreur f l-inscription";
            toast.error(errorMsg);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col gap-4 w-1/3 justify-center items-center">

                <div className="flex flex-col gap-2 w-full">
                    <div className="p-4 text-2xl text-center text-blue-600"> Register Page </div>

                    <div className="flex gap-1 border p-1">
                        <User className="text-blue-600" />
                        <input
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            className="outline-none w-full px-2"
                        />
                    </div>

                    <div className="flex gap-1 border p-1">
                        <Mail className="text-blue-600" />
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="outline-none w-full px-2"
                        />
                    </div>

                    <div className="flex gap-1 border p-1">
                        <Lock className="text-blue-600" />
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="outline-none w-full px-2"
                        />
                    </div>

                    <div className="flex gap-1 border p-1">
                        <Lock className="text-blue-600" />
                        <input
                            type="password"
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            placeholder="Confirm Password"
                            className="outline-none w-full px-2"
                        />
                    </div>

                    <div>
                        <button
                            onClick={submitLesInfo}
                            className="text-white p-2 bg-blue-600 w-full hover:bg-blue-700 transition-colors"
                        >
                            S'inscrire
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;