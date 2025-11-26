"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CareerDashboard() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApps() {
      try {
        const res = await fetch("/api/pages");
        const data = await res.json();
        setApps(data.applications || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  return (
    <section className="min-h-screen bg-black/90 py-16 px-4">
      <h1 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-400 to-yellow-400 text-transparent bg-clip-text">
        Job Applications
      </h1>

      {loading && (
        <p className="text-center text-gray-400 text-lg">Loading...</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {apps.map((app) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_40px_rgba(0,120,255,0.25)] transition-all"
          >
            {/* IMAGE */}
            {app.fileUrl && (
              <img
                src={app.fileUrl}
                alt="Applicant file"
                className="w-full h-48 object-cover rounded-xl mb-4 border border-white/10"
              />
            )}

            {/* DETAILS */}
            <div className="text-white space-y-2">
              <p className="text-xl font-bold">{app.name}</p>
              <p className="text-blue-300 text-sm">{app.email}</p>
              <p className="text-gray-300 text-sm">{app.phone}</p>
              <p className="text-xs text-gray-400 mt-2">
                Applied: {new Date(app.submittedAt).toLocaleString()}
              </p>

              {/* EMAIL BUTTON */}
              <a
                href={`mailto:${app.email}`}
                className="inline-block mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-yellow-400 text-black font-semibold shadow-lg"
              >
                Email Applicant
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {!loading && apps.length === 0 && (
        <p className="text-center text-gray-400 text-lg mt-10">
          No applications yet.
        </p>
      )}
    </section>
  );
}
