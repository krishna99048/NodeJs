import { Mail, MessageCircle, PackageSearch, Phone, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import StorefrontLayout from "../Components/StorefrontLayout";
import { supportTopics } from "../data/storefront";

const supportCards = [
  {
    title: "Track orders",
    description: "Check status, delivery windows, and latest confirmation details.",
    icon: PackageSearch,
  },
  {
    title: "Shipping help",
    description: "Review delivery timelines, charges, and large-item scheduling.",
    icon: Truck,
  },
  {
    title: "Returns",
    description: "Start an exchange or return for eligible unused products.",
    icon: RotateCcw,
  },
  {
    title: "Secure account",
    description: "Manage login, profile details, and protected account access.",
    icon: ShieldCheck,
  },
];

const Support = () => {
  return (
    <StorefrontLayout>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Support & Info Pages</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Help center</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
            Find order help, delivery information, payment guidance, returns, and product care.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {supportCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-lg font-black text-slate-950">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{card.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">Popular questions</h2>
          <div className="mt-6 grid gap-4">
            {supportTopics.map((topic) => (
              <details key={topic.title} className="rounded-lg border border-slate-200 p-4 open:bg-slate-50">
                <summary className="cursor-pointer text-sm font-black text-slate-950">{topic.title}</summary>
                <p className="mt-3 text-sm leading-6 text-slate-500">{topic.body}</p>
              </details>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <MessageCircle className="h-8 w-8 text-emerald-400" />
          <h2 className="mt-5 text-2xl font-black">Need direct support?</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Share your order ID and contact details. The backend can connect this form to your support endpoint when available.
          </p>

          <div className="mt-6 grid gap-3 text-sm">
            <a href="mailto:support@astra.test" className="flex items-center gap-3 rounded-lg bg-white/10 p-3 font-bold hover:bg-white/15">
              <Mail className="h-4 w-4 text-emerald-300" />
              support@astra.test
            </a>
            <a href="tel:+910000000000" className="flex items-center gap-3 rounded-lg bg-white/10 p-3 font-bold hover:bg-white/15">
              <Phone className="h-4 w-4 text-emerald-300" />
              +91 00000 00000
            </a>
          </div>

          <form className="mt-6 grid gap-3">
            <input
              placeholder="Order ID"
              className="h-11 rounded-lg border border-white/10 bg-white/10 px-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-emerald-400"
            />
            <textarea
              placeholder="How can we help?"
              className="min-h-28 rounded-lg border border-white/10 bg-white/10 p-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-emerald-400"
            />
            <button
              type="button"
              className="h-11 rounded-lg bg-emerald-500 text-sm font-black uppercase tracking-widest text-slate-950 hover:bg-white"
            >
              Send request
            </button>
          </form>
        </aside>
      </section>
    </StorefrontLayout>
  );
};

export default Support;
