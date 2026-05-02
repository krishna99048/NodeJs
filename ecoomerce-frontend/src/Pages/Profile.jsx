import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Edit3,
  Fingerprint,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import StorefrontLayout from "../Components/StorefrontLayout";
import api from "../Services/api";

const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const getInitials = (value = "User") =>
  value
    .split(" ")
    .map((item) => item.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const Profile = () => {
  const [user, setUser] = useState(getSavedUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const initials = useMemo(() => getInitials(user?.username || user?.email || "User"), [user]);

  useEffect(() => {
    let ignore = false;

    const fetchProfile = async () => {
      if (!localStorage.getItem("token")) {
        setError("Please login to view your database profile.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/user/profile");
        const profileUser = response.data?.user || response.data;

        if (!ignore) {
          setUser(profileUser);
          localStorage.setItem("user", JSON.stringify(profileUser));
          setError("");
        }
      } catch (profileError) {
        if (!ignore) {
          setError(profileError.response?.data?.message || "Unable to fetch user profile from database.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      ignore = true;
    };
  }, []);

  const logout = async () => {
    try {
      await api.get("/user/logout");
    } catch {
      // Token is cleared locally even if the logout endpoint is already expired.
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <StorefrontLayout>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-widest text-amber-700">User Profile</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">My profile</h1>
          {error && <p className="mt-3 text-sm font-semibold text-slate-500">{error}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Loading user profile...</h2>
          </div>
        ) : !user ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-5 text-2xl font-black text-slate-950">Profile not available</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Login first, then your profile will be loaded from the database.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-black text-white"
            >
              Login
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="bg-slate-950 p-8 text-white sm:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-amber-500 text-3xl font-black text-slate-950">
                    {initials}
                  </div>
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-amber-200">
                      <BadgeCheck className="h-4 w-4" />
                      Database profile
                    </div>
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                      {user.username || "Customer"}
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-slate-300">{user.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-black text-slate-950 transition hover:bg-amber-500"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
              <ProfileField icon={<UserRound className="h-5 w-5" />} label="Username" value={user.username} />
              <ProfileField icon={<Mail className="h-5 w-5" />} label="Email" value={user.email} />
              <ProfileField icon={<ShieldCheck className="h-5 w-5" />} label="Role" value={user.role || "user"} />
              <ProfileField icon={<Fingerprint className="h-5 w-5" />} label="User ID" value={user._id || user.id} />
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 p-6 sm:flex-row sm:p-8">
              <Link
                to="/edit-profile"
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-black uppercase tracking-widest text-white hover:bg-amber-700"
              >
                <Edit3 className="h-4 w-4" />
                Edit profile
              </Link>
              <Link
                to="/account"
                className="flex h-12 flex-1 items-center justify-center rounded-lg border border-slate-200 px-5 text-sm font-black uppercase tracking-widest text-slate-700 hover:border-slate-950"
              >
                Account dashboard
              </Link>
            </div>
          </div>
        )}
      </section>
    </StorefrontLayout>
  );
};

const ProfileField = ({ icon, label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
    <div className="flex items-center gap-3 text-slate-500">
      {icon}
      <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="mt-3 break-words text-lg font-black text-slate-950">{value || "Not available"}</p>
  </div>
);

export default Profile;
