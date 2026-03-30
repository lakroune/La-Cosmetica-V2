import axios from "axios";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const submitLesInfo = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/login", { email, password });
            if (response.status === 200) {
                toast.success("Connexion reussie!");
                Cookies.set("token", response.data.access_token);
                navigate("/");
            }
        } catch (error) {
            toast.error("Email ou mot de passe incorrect");
        }
    };

    return (
        <div className=" flex justify-center items-center h-screen">
            <div className=" flex flex-col gap-4  w-1/3 jstify-center items-center" >

                <div className=" flex flex-col gap-2">
                    <div className="p-4 text-2xl justify-center text-blue-600">  login page </div>
                    <div className="flex gap-1 border">
                        <Mail className=" text-blue-600" />
                        <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder="email" className=" border px-2  outline-none w-full" />
                    </div>
                    <div className=" flex gap-1  border">
                        <Lock className=" text-blue-600" />
                        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="password" className=" border px-2  outline-none w-full" />
                    </div>
                    <div>
                        <input type="submit" onClick={submitLesInfo} className=" text-white p-1  bg-blue-600 px-2 w-full" />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default LoginPage;