import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function AssessmentPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    propertyName: "",
    propertyType: "Commercial",
    address: "",
    city: "",
    state: "",
    incidentArea: "",
    history: "",
    protections: {}, // object of booleans for what to protect
    currentSetup: {}, // object of booleans for current security
    weaknesses: "",
    threatLevel: "Low",
    threatReason: "",
    requiredServices: {}, // object of booleans
    budget: "₦50k – ₦150k",
    timeline: "Immediately",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAIResponse] = useState("");

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // toggles boolean flags inside nested objects (for checkboxes)
  const toggleFlag = (group, key) => {
    setForm((prev) => {
      const nextGroup = { ...(prev[group] || {}) };
      nextGroup[key] = !nextGroup[key];
      return { ...prev, [group]: nextGroup };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      // show AI result to the user
      setAIResponse(data.aiReport);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setLoading(false);
    }
  };


  // Reusable input classes that blend with the dark glassy UI
  const inputClass =
    "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition";
  const selectClass = inputClass + " appearance-none";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <header className="w-full border-b border-white/10 backdrop-blur-lg sticky top-0 z-50 bg-black/40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            <Link to="/" className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-yellow-400">
              Oscardyne Security
            </Link>
          </h1>

          <nav className="flex gap-4 items-center">
            <Link to="/" className="text-sm text-gray-300 hover:text-white">
              Home
            </Link>
          </nav>
        </div>
      </header>

      {/* BACK BUTTON + HERO */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Main Page
        </Link>

        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-3">Get Your Custom Security Assessment</h2>
          <p className="text-gray-300 max-w-2xl">
            Provide accurate information about your site. Our system will analyze risks and generate a detailed security plan tailored to
            your needs.
          </p>
        </section>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 mt-4 grid gap-10 pb-28">
        {/* PERSONAL INFO */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Personal / Business Information</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <input
              placeholder="Full Name"
              className={inputClass}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
            <input
              placeholder="Phone Number"
              className={inputClass}
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              required
            />
            <input
              placeholder="Email"
              className={inputClass}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              type="email"
              required
            />
            <input
              placeholder="Company / Property Name"
              className={inputClass}
              value={form.propertyName}
              onChange={(e) => update("propertyName", e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2 text-gray-300">Type of Property</label>
            <select
              className={selectClass}
              value={form.propertyType}
              onChange={(e) => update("propertyType", e.target.value)}
            >
              <option>Commercial</option>
              <option>Residential</option>
              <option>Event Security</option>
              <option>VIP / Executive Protection</option>
              <option>Industrial / Warehouse</option>
              <option>School / Hospital</option>
            </select>
          </div>
        </div>

        {/* LOCATION DETAILS */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Location Details</h3>
          <input
            placeholder="Property Address"
            className={inputClass}
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
          />
          <div className="grid md:grid-cols-2 gap-5 mt-4">
            <input
              placeholder="City"
              className={inputClass}
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            />
            <input
              placeholder="State"
              className={inputClass}
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
            />
          </div>
          <textarea
            placeholder="Any known hotspots or previous incidents?"
            className={inputClass + " h-24 resize-y mt-4"}
            value={form.incidentArea}
            onChange={(e) => update("incidentArea", e.target.value)}
          />
        </div>

        {/* SECURITY HISTORY */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Security History</h3>
          <textarea
            placeholder="Describe past incidents (if any)"
            className={inputClass + " h-24"}
            value={form.history}
            onChange={(e) => update("history", e.target.value)}
          />
        </div>

        {/* WHAT TO PROTECT */}
        <div>
          <h3 className="text-xl font-semibold mb-4">What Do You Want to Protect?</h3>
          <div className="grid md:grid-cols-2 gap-3 text-gray-300">
            {["Lives", "Cash movement", "Inventory", "Building perimeter", "Vehicles", "Equipment", "Documents", "Entire property"].map(
              (item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!form.protections[item]}
                    onChange={() => toggleFlag("protections", item)}
                    className="w-4 h-4 rounded bg-black/30 border border-white/10 accent-blue-500"
                  />
                  <span className="select-none">{item}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* CURRENT SECURITY SETUP */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Current Security Setup</h3>
          <div className="grid md:grid-cols-2 gap-3 text-gray-300">
            {["CCTV", "Access control", "Alarm system", "Security guards", "Remote monitoring", "Electric fence", "None"].map(
              (item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!form.currentSetup[item]}
                    onChange={() => toggleFlag("currentSetup", item)}
                    className="w-4 h-4 rounded bg-black/30 border border-white/10 accent-blue-500"
                  />
                  <span className="select-none">{item}</span>
                </label>
              )
            )}
          </div>

          <textarea
            placeholder="Weaknesses you’ve noticed"
            className={inputClass + " mt-4 h-20"}
            value={form.weaknesses}
            onChange={(e) => update("weaknesses", e.target.value)}
          />
        </div>

        {/* THREAT LEVEL */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Threat Level Evaluation</h3>
          <select
            className={selectClass}
            value={form.threatLevel}
            onChange={(e) => update("threatLevel", e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
          <textarea
            placeholder="Explain why"
            className={inputClass + " mt-4 h-20"}
            value={form.threatReason}
            onChange={(e) => update("threatReason", e.target.value)}
          />
        </div>

        {/* REQUIRED SERVICES */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Required Services</h3>
          <div className="grid md:grid-cols-2 gap-3 text-gray-300">
            {[
              "On-site guards",
              "Patrol services",
              "CCTV installation",
              "24/7 monitoring",
              "Risk assessment report",
              "Security audit",
              "VIP escort",
              "Event security",
              "Emergency response planning",
            ].map((item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!form.requiredServices[item]}
                  onChange={() => toggleFlag("requiredServices", item)}
                  className="w-4 h-4 rounded bg-black/30 border border-white/10 accent-blue-500"
                />
                <span className="select-none">{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* BUDGET & TIMELINE */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Budget & Timeline</h3>
          <select className={selectClass} value={form.budget} onChange={(e) => update("budget", e.target.value)}>
            <option>₦50k – ₦150k</option>
            <option>₦150k – ₦500k</option>
            <option>₦500k – ₦2m</option>
            <option>₦2m+</option>
          </select>

          <select className={selectClass + " mt-4"} value={form.timeline} onChange={(e) => update("timeline", e.target.value)}>
            <option>Immediately</option>
            <option>1–2 weeks</option>
            <option>1 month</option>
            <option>Not sure</option>
          </select>
        </div>

        {/* EXTRA NOTES */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Extra Notes</h3>
          <textarea
            placeholder="Any special concerns or instructions"
            className={inputClass + " h-32"}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        {/* SUBMIT */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="mx-auto px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-yellow-400 text-black font-bold text-lg shadow-lg"
        >
          {loading ? "Generating..." : "Generate My Security Assessment"}
        </motion.button>
      </form>

      {aiResponse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto mt-16 bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl"
        >
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            Your Personalised Security Assessment
          </h3>

          <div className="text-gray-200 leading-relaxed whitespace-pre-wrap text-lg tracking-wide">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {aiResponse}
            </ReactMarkdown>
          </div>
        </motion.div>
      )}

    </div>
  );
}
