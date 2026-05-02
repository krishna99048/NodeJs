import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/api";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { Trash2, Package, Plus, Sparkles, AlertCircle, Edit } from "lucide-react";
import { subscribeTabEvents } from "../../utils/tabSync";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // 1. Fetch all products from backend
  const fetchProducts = async () => {
    try {
      const res = await api.get("/product/all");
      // Backend response mathi products array set karo
      // Jo res.data.products na hoi to khali array set karo jethi blank screen na aave
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      
      // Jo token expire thai gayo hoi to login page par redirect karo
      if (error.response?.data?.message === "token expire re-login") {
        alert("Session expired, please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  // 2. Delete product logic
  const deleteProduct = async (id) => {
    if (!id) return;

    if (window.confirm("Remove this masterpiece from the active collection?")) {
      try {
        await api.delete(`/product/${id}`);
        alert("Product removed successfully");
        
        // Refresh the list after successful deletion
        fetchProducts();
      } catch (error) {
        console.error("Delete Error details:", error.response?.data);
        const errorMsg = error.response?.data?.message || "Something went wrong";
        
        if (errorMsg === "token expire re-login") {
          alert("Session expired, please login again.");
          window.location.href = "/login";
        } else {
          alert(`Delete failed: ${errorMsg}`);
        }
      }
    }
  };

  useEffect(() => {
    fetchProducts();

    const cleanup = subscribeTabEvents((message) => {
      if (message?.type === "product-updated") {
        fetchProducts();
      }
    });

    return cleanup;
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-emerald-100">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navbar />

        <main className="p-8 lg:p-12">
          {/* Section Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-0.5 w-8 bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">
                  Product Management
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Product Catalog <Package className="text-emerald-500 h-6 w-6" />
              </h1>
              <p className="text-slate-600 text-sm mt-2 font-medium">
                Manage your studio's signature objects and limited editions.
              </p>
            </div>

            {/* <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-amber-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 group">
              <Plus size={16} /> Curate New Product
            </button> */}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Safety Check: Jo products undefined hoi to error na aave e mate Optional Chaining vaprvu */}
            {products && products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col"
                >
                  {/* Image Showcase */}
                  <div className="relative h-64 overflow-hidden bg-slate-50">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/300"}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    {/* Stock Badge */}
                    <div className={`absolute top-5 left-5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md ${
                      product.stock < 5 ? "bg-red-500/10 text-red-500" : "bg-white/80 text-slate-900"
                    }`}>
                      {product.stock < 5 && <AlertCircle size={10} className="inline mr-1 mb-0.5" />}
                      Stock: {product.stock}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                         <Sparkles size={12} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Signature Edition</span>
                      </div>
                      <h2 className="text-xl font-serif font-bold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
                        {product.name}
                      </h2>
                      <p className="text-xl font-medium text-slate-900 mt-4 tracking-tighter">
                        ₹ {Number(product.price).toLocaleString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <button 
                        onClick={() => navigate('/admin/add-product', { state: { product } })}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1"
                      >
                        <Edit size={12} />
                        Edit Details
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="w-10 h-10 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="Archive Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-slate-400">
                No products found in the archive.
              </div>
            )}

            {/* Add Placeholder */}
            {/* <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-10 group cursor-pointer hover:border-amber-500 transition-colors bg-slate-50/30 min-h-100">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all">
                  <Plus size={30} strokeWidth={1} />
               </div>
               <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-amber-600 transition-colors text-center">
                 Add Masterpiece <br /> to Gallery
               </p>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
