import { LayoutGrid  } from "lucide-react";

const SideBar = ( ) => {
    return (
        <aside className="w-1/5 h-screen relative  ">
            <div className="flex fixed flex-col gap-8 bg-gray-100 p-6 border-r border-gray-200 h-full">
                <div className="flex items-center gap-3 text-blue-600">
                    <LayoutGrid size={24} strokeWidth={2.5} />
                    <span className="font-black uppercase tracking-wider text-lg text-gray-800">
                        Cosmetica
                    </span>
                </div>

                <nav className="  flex flex-col ">
                    <a href="/admin/categories" className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 hover:text-blue-600 active">
                        Categories
                    </a>
                    <a href="/admin/products" className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 hover:text-blue-600">
                        Products
                    </a>
                    <a href="/admin/orders" className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 hover:text-blue-600">
                        Orders
                    </a>



                </nav>
            </div>
        </aside>
    );
};

export default SideBar;