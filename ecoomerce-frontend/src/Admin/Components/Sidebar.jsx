import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  Package, 
  PlusSquare, 
  ShoppingBag,
  ChevronRight,
  Diamond
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menus = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <ShoppingBag size={18} />,
    },
    {
      name: "User Directory",
      path: "/admin/users",
      icon: <UsersIcon size={18} />,
    },
    {
      name: "Product Gallery",
      path: "/admin/products",
      icon: <Package size={18} />,
    },
    {
      name: "Add Product",
      path: "/admin/add-product",
      icon: <PlusSquare size={18} />,
    },
  ];

  return (
    <div className="w-72 min-h-screen bg-white text-slate-950 border-r border-slate-200 shadow-sm">
      
      {/* Brand Identity */}
      <div className="mb-12 px-6 pt-6">
        <Link to="/" className="flex items-center gap-3 mb-1">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-lg font-black text-white">
            A
          </span>
          <h1 className="text-xl font-black tracking-tight">
            ASTRA
          </h1>
        </Link>
        <p className="text-[9px] font-black tracking-[0.3em] text-slate-500 uppercase ml-14">
          Admin Panel
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 flex-1 px-6">
        {menus.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100" 
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
              }`}
            >
              {/* Active Indicator Pillar */}
              {isActive && (
                <div className="absolute left-0 w-1 h-8 bg-emerald-600 rounded-r-full" />
              )}

              <div className="flex items-center gap-4">
                <span className={`${isActive ? "text-emerald-600" : "text-slate-500 group-hover:text-slate-700"} transition-colors`}>
                  {item.icon}
                </span>
                <span className="text-sm font-semibold">
                  {item.name}
                </span>
              </div>

              <ChevronRight 
                size={16} 
                className={`transition-all duration-300 ${
                  isActive ? "opacity-100 translate-x-0 text-emerald-600" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-slate-400"
                }`} 
              />
            </Link>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-auto pt-6 px-6 border-t border-slate-200">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-700/80 leading-relaxed uppercase tracking-tighter">
            Astra Admin v1.0
          </p>
          <p className="text-[9px] text-slate-500 mt-1">
            Manage your e-commerce empire
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;