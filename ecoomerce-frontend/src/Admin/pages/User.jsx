import { useEffect, useState } from "react";
import api from "../../Services/api";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { Trash2, ShieldCheck, User as UserIcon, Mail, Settings2 } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/all/user");
      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to remove this member from the circle?")) {
      try {
        await api.delete(`/admin/user/${id}`);
        fetchUsers();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateRole = async (id, role) => {
    try {
      await api.put(`/admin/user/${id}/role`, { role });
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-emerald-100">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navbar />

        <main className="p-8 lg:p-12">
          {/* Header Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-0.5 w-8 bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">
                  User Management
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Member Access <ShieldCheck className="text-amber-500 h-6 w-6" />
              </h1>
              <p className="text-slate-400 text-sm mt-2 font-medium">
                Control roles and permissions for your curated community.
              </p>
            </div>
            
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Total Members</p>
                <p className="text-xl font-bold text-slate-900 leading-none mt-1">{users.length}</p>
              </div>
              <div className="h-8 w-px bg-slate-100" />
              <UserIcon className="text-amber-500 h-5 w-5" />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Identity</th>
                    <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Email Reference</th>
                    <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Status & Role</th>
                    <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Administrative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((user) => (
                    <tr key={user._id} className="group hover:bg-[#FAF9F6] transition-colors duration-300">
                      {/* Username Column */}
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center font-serif italic text-slate-400 group-hover:text-amber-600 group-hover:border-amber-200 transition-all shadow-sm uppercase font-bold">
                            {user.username.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-none">{user.username}</p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">Member since '24</p>
                          </div>
                        </div>
                      </td>

                      {/* Email Column */}
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-900 transition-colors">
                          <Mail size={14} className="text-slate-300" />
                          <span className="text-sm font-medium">{user.email}</span>
                        </div>
                      </td>

                      {/* Role Selector Column */}
                      <td className="p-6">
                        <div className="relative inline-flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`} />
                          <select
                            value={user.role}
                            onChange={(e) => updateRole(user._id, e.target.value)}
                            className="appearance-none bg-white border border-slate-100 px-4 py-2 pr-10 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer shadow-sm hover:border-amber-200"
                          >
                            <option value="user">User</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                          <Settings2 className="absolute right-3 h-3 w-3 text-slate-300 pointer-events-none" />
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="p-6 text-right">
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 group/btn shadow-sm"
                          title="Remove Member"
                        >
                          <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {users.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-slate-300 font-serif italic text-lg tracking-wide">
                  The directory is currently empty.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Users;
