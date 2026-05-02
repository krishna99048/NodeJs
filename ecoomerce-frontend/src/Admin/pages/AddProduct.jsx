import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Redirect mate
import api from "../../Services/api";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { PlusCircle, Image as ImageIcon, Box, Tag, Info, Sparkles } from "lucide-react";
import { broadcastTabEvent } from "../../utils/tabSync";

const AddProduct = () => {
  const navigate = useNavigate(); // Navigation initialize karyu
  const location = useLocation();
  const editingProduct = location.state?.product;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stock: "",
    price: "",
    discount: "",
    isNewProduct: true,
    sku: "",
    images: "",
    brand: "",
    category: "",
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        stock: editingProduct.stock || "",
        price: editingProduct.price || "",
        discount: editingProduct.discount || "",
        isNewProduct: editingProduct.isNewProduct || false,
        sku: editingProduct.sku || "",
        images: editingProduct.images?.[0] || "",
        brand: editingProduct.brand || "",
        category: editingProduct.category || "",
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        images: [formData.images], // String ne array ma convert karyu
      };

      let response;
      if (editingProduct) {
        // Update existing product
        response = await api.put(`/product/${editingProduct._id}`, payload);
      } else {
        // Add new product
        response = await api.post("/product/add", payload);
      }

      // Agar product successfully add/update thai jay
      if (response.status === 200 || response.status === 201) {
        alert(editingProduct ? "Product updated successfully." : "Masterpiece added to collection.");
        
        broadcastTabEvent("product-updated", {
          product: response.data?.product || response.data,
        });

        // Admin products page par redirect karo
        navigate("/admin/products"); 
      }
    } catch (error) {
      console.error("Error:", error);
      
      // Token expire check
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] font-sans selection:bg-amber-100">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navbar />

        <main className="p-8 lg:p-12 max-w-5xl mx-auto w-full">
          <div className="mb-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className="h-0.5 w-8 bg-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">
                Inventory Addition
              </span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
              {editingProduct ? 'Edit Product' : 'Curate New Object'} <PlusCircle className="text-amber-500 h-6 w-6" />
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Box size={200} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                
                <div className="col-span-1 md:col-span-2 flex items-center gap-2 mb-2">
                  <Info size={16} className="text-amber-500" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Product Essence</h3>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 ml-4">Full Title</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="e.g. Minimalist Velvet Armchair"
                    value={formData.name}
                    className="w-full bg-[#FBFBFB] border border-slate-100 p-4 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 ml-4">Brand / Atelier</label>
                  <input
                    name="brand"
                    type="text"
                    placeholder="Lumina Exclusive"
                    value={formData.brand}
                    className="w-full bg-[#FBFBFB] border border-slate-100 p-4 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-1 md:col-span-2 flex items-center gap-2 mt-4 mb-2">
                  <Tag size={16} className="text-amber-500" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Logistics & Value</h3>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 ml-4">Valuation (₹)</label>
                  <input
                    name="price"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    className="w-full bg-[#FBFBFB] border border-slate-100 p-4 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 ml-4">Inventory Count</label>
                  <input
                    name="stock"
                    type="number"
                    placeholder="Total units"
                    value={formData.stock}
                    className="w-full bg-[#FBFBFB] border border-slate-100 p-4 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 ml-4">Incentive Discount (%)</label>
                  <input
                    name="discount"
                    type="number"
                    placeholder="0"
                    value={formData.discount}
                    className="w-full bg-[#FBFBFB] border border-slate-100 p-4 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all"
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 ml-4">Category</label>
                  <input
                    name="category"
                    type="text"
                    placeholder="e.g. Furniture, Decor"
                    value={formData.category}
                    className="w-full bg-[#FBFBFB] border border-slate-100 p-4 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all"
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 ml-4">SKU</label>
                  <input
                    name="sku"
                    type="text"
                    placeholder="LM-XXXX-24"
                    value={formData.sku}
                    className="w-full bg-[#FBFBFB] border border-slate-100 p-4 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all"
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 ml-4 flex items-center gap-2">
                    <ImageIcon size={12} /> Primary Image URL
                  </label>
                  <input
                    name="images"
                    type="text"
                    placeholder="https://image-cloud.com/product-1.jpg"
                    value={formData.images}
                    className="w-full bg-[#FBFBFB] border border-slate-100 p-4 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 ml-4">Narrative Description</label>
                  <textarea
                    name="description"
                    placeholder="Tell the story of this product..."
                    value={formData.description}
                    className="w-full bg-[#FBFBFB] border border-slate-100 p-4 rounded-3xl text-sm h-40 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all resize-none"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-1 md:col-span-2 flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-amber-500" size={20} />
                    <div>
                      <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">Highlight as "New Arrival"</p>
                      <p className="text-[10px] text-slate-400">This will feature the product in the 'Fresh Collections' section.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      name="isNewProduct"
                      type="checkbox"
                      checked={formData.isNewProduct}
                      className="sr-only peer"
                      onChange={handleChange}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>

              <div className="mt-12 flex flex-col md:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-amber-600 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]"
                >
                  {editingProduct ? 'Update Product' : 'Publish to Gallery'}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddProduct;
