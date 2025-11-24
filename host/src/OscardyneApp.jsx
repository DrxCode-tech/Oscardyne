import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, MapPin, Send, Loader2, Home, Bot, PlayCircle, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "./firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


// Assets (ensure these exist in /src/assets)
import HeroImg from "./assets/Security1.jpg";
import Service1 from "./assets/Security2.jpg";
import Service2 from "./assets/Security3.jpg";
import Service3 from "./assets/Security4.jpg";
import Service4 from "./assets/Security5.jpg";
import Badge1 from "./assets/Security6.jpg";
import Badge2 from "./assets/Security8.jpg";
import LogoImg from "./assets/Security1.jpg";

// ------------------ Utilities / Small Helpers ------------------
function GradientIcon({ Icon, className = "w-5 h-5" }) {
  // Use React.createElement so Lucide icons render correctly inside our <svg>
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <defs>
        <linearGradient id="gradStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>
      </defs>
      {React.createElement(Icon, { stroke: "url(#gradStroke)" })}
    </svg>
  );
}

// ------------------ Nav ------------------
function Nav({ onOpen }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img src={LogoImg} alt="Oscardyne Logo" className="h-12 w-12 object-contain rounded-md" />
            <div className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-yellow-400">
              Oscardyne Security Logistics
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-200">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#why" className="hover:text-white">Why Us</a>
            <a href="#testimonials" className="hover:text-white">Testimonials</a>
            <a href="#contact" className="hover:text-white">Contact</a>
            <a href="#careers" className="hover:text-white">Careers</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="#contact" className="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-yellow-500 text-black font-semibold">Request Quote</a>

            {/* hidden on md+ because we show full nav there */}
            <button onClick={onOpen} className="p-2 rounded-md bg-white/6 backdrop-blur-sm hover:scale-105 transition md:hidden">
              <Menu size={22} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// ------------------ Mobile Menu ------------------
function MobileMenu({ open, onClose }) {
  const menuItems = [
    { label: "Services", href: "#services", Icon: ShieldCheck },
    { label: "Why Us", href: "#why", Icon: Home },
    { label: "Testimonials", href: "#testimonials", Icon: PlayCircle },
    { label: "Contact", href: "#contact", Icon: Phone },
    { label: "Oscardyne_AI", href: "#oscardyne_ai", Icon: Bot },
    { label: "Careers", href: "#careers", Icon: PlayCircle },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed inset-y-0 right-0 w-4/5 bg-black/95 backdrop-blur-xl border-l border-white/10 shadow-[ -20px_0_40px_rgba(0,0,0,0.35)] z-50 p-6 overflow-y-auto rounded-l-3xl"
        >
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <img src={LogoImg} alt="logo" className="h-10 w-10 rounded-md object-cover shadow-[0_0_10px_rgba(255,255,255,0.15)]" />
              <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-yellow-400 tracking-wide">Menu</div>
            </div>

            <motion.button onClick={onClose} whileHover={{ rotate: 90, scale: 1.15 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 300 }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
              <X size={22} className="text-white" />
            </motion.button>
          </motion.div>

          <nav className="flex flex-col gap-3 text-gray-200">
            {menuItems.map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                onClick={onClose}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, type: "spring", stiffness: 300, damping: 25 }}
                whileHover={{ x: 8, scale: 1.02 }}
                className="relative flex items-center gap-3 py-3 px-4 rounded-lg bg-white/0 hover:bg-white/5 transition-all"
              >
                <GradientIcon Icon={item.Icon} className="w-5 h-5" />
                {item.label}
              </motion.a>
            ))}

            <motion.a href="#contact" onClick={onClose} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ delay: 0.2 }} className="mt-6 inline-block text-center px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-yellow-500 text-black font-bold shadow-[0_0_25px_rgba(255,255,255,0.15)]">
              Request Quote
            </motion.a>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ------------------ ParallaxHero (throttled via rAF) ------------------
function ParallaxHero() {
  const ref = useRef(null);
  const offsetRef = useRef(0);
  const [offset, setOffset] = useState(0);
  const [index, setIndex] = useState(0);
  const tickRef = useRef(null);
  const images = [Service1, Service2, Service3, Service4];

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const top = ref.current.getBoundingClientRect().top;
      offsetRef.current = Math.max(-top / 10, -60);
      if (!tickRef.current) {
        tickRef.current = requestAnimationFrame(() => {
          setOffset(offsetRef.current);
          tickRef.current = null;
        });
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setIndex((p) => (p + 1) % images.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="relative w-full min-h-[75vh] flex items-center overflow-hidden">
      {images.map((img, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${img})`, transform: `translateY(${offset}px)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === i ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      ))}

      <div className="absolute inset-0 bg-black/55 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
          Oscardyne Security Logistics
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mt-6 text-gray-300 max-w-2xl mx-auto">
          Full-spectrum private security — corporate guards, surveillance, rapid-response units, escort services, and high-risk logistics. Reliable. Disciplined. Operational 24/7.
        </motion.p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#contact" className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-yellow-400 text-black font-semibold shadow-[0_15px_40px_rgba(0,120,255,0.14)] hover:scale-105 transition">Request Quote</a>
          <a href="#services" className="inline-flex items-center px-6 py-3 rounded-lg bg-white/6 backdrop-blur-md text-gray-200 hover:bg-white/10 transition">Our Services</a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none">
        <div className="mx-auto w-3/4 h-full bg-gradient-to-t from-blue-700/20 to-transparent blur-3xl" />
      </div>
    </section>
  );
}

// ------------------ Services ------------------
function Services() {
  const items = [
    { img: Service1, title: "Physical Security", desc: "Guards, surveillance, and access control to ensure safety of people and property.", link: "/physic-security" },
    { img: Service2, title: "Cybersecurity", desc: "Threat detection, penetration testing, and incident response to protect digital assets.", link: "/cyber-security" },
    { img: Service3, title: "Information Security", desc: "Data protection, compliance, and secure handling of sensitive information.", link: "/info-security" },
    { img: Service4, title: "Event Security", desc: "Protecting crowds, managing access, and VIP protection for events.", link: "/event-security" },
    { img: Service1, title: "Commercial Security", desc: "Safeguarding businesses and offices against theft, intrusion, and emergencies.", link: "/commercial-security" },
    { img: Service2, title: "Residential Security", desc: "Home protection systems and security services for residential properties.", link: "/residential-security" },
  ];

  const navigate = useNavigate();

  return (
    <section id="services" className="py-16 bg-black/80">
      <div className="py-20 max-w-6xl relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-blue-900/50 to-transparent blur-3xl pointer-events-none"></div>
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((it, i) => (
            <motion.article key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ scale: 1.03 }} className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 flex flex-col gap-4 shadow-[0_10px_30px_rgba(0,120,255,0.12)] hover:shadow-[0_15px_40px_rgba(0,120,255,0.25)] transition-all duration-300 group">
              <div className="h-36 w-full rounded-md overflow-hidden relative">
                <img src={it.img} alt={it.title} className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent mix-blend-overlay pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/40 to-transparent blur-sm pointer-events-none"></div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{it.title}</h3>
                <p className="mt-2 text-gray-300 text-sm">{it.desc}</p>
              </div>

              <div className="mt-4">
                <motion.button whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 380, damping: 22 }} onClick={() => navigate(it.link)} className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-yellow-400 text-black font-semibold shadow-[0_8px_25px_rgba(0,120,255,0.15)] hover:scale-105 hover:shadow-[0_12px_35px_rgba(0,120,255,0.25)] transition-all duration-300">
                  Learn More
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------ WhyUs ------------------
function WhyUs() {
  const points = ["Licensed & Vetted Personnel", "24/7 Operations & Rapid Response", "Custom Security Plans", "Modern Equipment & Monitoring"];
  return (
    <section id="why" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">Why Choose Oscardyne</h2>
          <p className="text-gray-300 mb-6">We combine local expertise with global standards to provide secure, reliable and discreet protection services for businesses, events and individuals.</p>
          <ul className="grid gap-3">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300"><span className="mt-1 text-blue-400 font-bold">•</span><span>{p}</span></li>
            ))}
          </ul>
          <div className="mt-6 flex gap-4 items-center"><img src={Badge1} alt="badge" className="h-10" /><img src={Badge2} alt="badge" className="h-10" /></div>
        </div>

        <div className="rounded-2xl overflow-hidden bg-white/4 backdrop-blur-lg border border-white/8 p-6">
          <h3 className="text-xl font-semibold text-white mb-3">Custom Security Plan</h3>
          <p className="text-gray-300 text-sm">Tell us about your site and we'll craft a security plan to fit your needs. Free assessment available.</p>
          <div className="mt-4">
            <a href="/assessment" className="inline-flex items-center px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-yellow-400 text-black font-semibold">Get Assessment</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------ Testimonials (fixed typo 'delay') ------------------
function Testimonials() {
  const t = [{ quote: "Reliable and professional. We use them for our corporate sites.", name: "Ibrahim, Ops Manager" }, { quote: "Fast response and well-trained guards.", name: "Chinyere, Events Co." }];
  return (
    <section id="testimonials" className="py-16 bg-black/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-8">What Clients Say</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {t.map((it, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 2.5, delay: 0.2 }} viewport={{ once: true }} className="p-6 rounded-xl bg-white/4 backdrop-blur-lg border border-white/8 text-left">
              <div className="text-gray-200 italic">“{it.quote}”</div>
              <div className="mt-4 font-semibold text-white">— {it.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------ Careers (complete) ------------------
function Careers() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const qualifications = [
    "At least 18 years old with a high school diploma or GED",
    "Citizen or permanent resident of the working country",
    "Clean criminal background (felonies or serious misdemeanors disqualify candidates)",
    "Required security licensing and certifications, including training hours and exams",
    "Armed security roles require firearms training and licensing",
    "Physical and health requirements: medical exam, drug screening, physical fitness",
    "Training on company protocols, emergency procedures, and customer service",
    "Advanced roles may require certifications in loss prevention, cybersecurity, or management",
    "Strong communication and interpersonal skills; driving license for certain roles",
    "Specialized roles may require prior security experience, IT knowledge, or supervisory experience",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile({ preview: URL.createObjectURL(file), file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      if (selectedFile && selectedFile.file) formData.append("file", selectedFile.file);

      const response = await fetch("/api/career", { method: "POST", body: formData });
      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        setMessage("Application submitted successfully!");
        setForm({ name: "", email: "", phone: "" });
        setSelectedFile(null);
      } else {
        setMessage(result.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error submitting application.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <section id="careers" className="py-20 bg-black/70 relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-black/50 to-yellow-900/20 pointer-events-none blur-3xl"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-400 text-center mb-6">
          Join Our Team
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} className="text-gray-300 text-center mb-10 text-lg">
          If you meet the following requirements, apply to become a professional member of our security team.
        </motion.p>

        <motion.ul initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="grid gap-4 max-w-3xl mx-auto mb-12">
          {qualifications.map((q, i) => (
            <li key={i} className="flex items-start gap-4 text-gray-200 backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10 shadow-lg hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all duration-300 group">
              <span className="mt-1 text-blue-400 font-bold text-xl group-hover:text-yellow-400 transition-colors">•</span>
              <span className="text-sm md:text-base">{q}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="rounded-3xl p-8 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_15px_40px_rgba(0,120,255,0.25)] max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-yellow-400">Apply Now</h3>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required className="p-4 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="p-4 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" required className="p-4 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />

            <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={handleFileChange} className="p-4 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />

            {selectedFile && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="mt-4 flex justify-center">
                <img src={selectedFile.preview} alt="Selected" className="w-full max-w-xs rounded-xl shadow-lg border border-white/10" />
              </motion.div>
            )}

            <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} disabled={loading} className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-yellow-400 text-black font-bold shadow-lg transition-transform duration-300">
              {loading ? "Submitting..." : "Submit Application"}
            </motion.button>

            {message && <p className="mt-2 text-center text-green-400">{message}</p>}
          </form>
        </motion.div>
      </div>
    </section>
  );
}

// ------------------ Contact ------------------
function Contact() {
  return (
    <section id="contact" className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl p-6 bg-white/4 backdrop-blur-lg border border-white/8">
            <h3 className="text-xl font-semibold text-white mb-3">Request a Quote</h3>
            <form className="flex flex-col gap-3">
              <input className="p-3 rounded-md bg-black/60 border border-white/8 text-white" placeholder="Full name" />
              <input className="p-3 rounded-md bg-black/60 border border-white/8 text-white" placeholder="Phone number" />
              <input className="p-3 rounded-md bg-black/60 border border-white/8 text-white" placeholder="Email" />
              <textarea className="p-3 rounded-md bg-black/60 border border-white/8 text-white resize-none" rows={4} placeholder="Tell us about the site / event" />
              <button className="mt-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-yellow-400 text-black font-semibold">Submit Request</button>
            </form>
          </div>

          <div className="rounded-2xl p-6 bg-black/60 border border-white/6">
            <h3 className="text-xl font-semibold text-white">Contact</h3>
            <div className="mt-3 text-gray-300 flex flex-col gap-2">
              <div className="flex items-center gap-2"><MapPin /> Lagos, Nigeria</div>
              <div className="flex items-center gap-2"><Phone /> +234 800 000 0000</div>
              <div className="flex items-center gap-2"><Mail /> contact@oscardyne.com</div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm text-gray-300 mb-2">Office Hours</h4>
              <div className="text-gray-400 text-sm">Mon — Fri: 08:00 — 18:00</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------ AIChat (width adapted) ------------------
function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, from: "user" }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "This is an AI response to: " + input, from: "ai" }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-10 p-6 rounded-3xl bg-black/50 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-yellow-400">Oscard Security AI</h2>
      </div>

      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto mb-4 p-4 rounded-2xl bg-black/30 backdrop-blur-lg shadow-inner">
        {messages.map((msg, i) => (
          <div key={i} className={`p-3 rounded-xl text-sm max-w-[75%] break-words ${msg.from === "user" ? "bg-blue-600/30 text-white self-end" : "bg-white/10 text-gray-200 self-start"}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="flex items-center gap-2 text-gray-300 animate-pulse text-sm"><Loader2 size={16} /> Processing...</div>}
      </div>

      <div className="flex gap-3">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Ask the AI..." className="flex-1 px-4 py-3 rounded-2xl bg-white/5 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition" />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={sendMessage} className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-yellow-400 text-black font-semibold shadow-md flex items-center gap-2">
          <Send size={18} /> Send
        </motion.button>
      </div>
    </div>
  );
}

// ------------------ Footer ------------------
function Footer() {
  return (
    <footer className="py-10 mt-12 border-t border-white/8 bg-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6 items-start">
        <div>
          <div className="flex items-center gap-3">
            <img src={LogoImg} alt="logo" className="h-10 w-10 object-contain rounded-md" />
            <div className="font-bold text-white">Oscardyne Security Logistics</div>
          </div>
          <div className="text-gray-400 text-sm mt-3">© {new Date().getFullYear()} Oscardyne. All rights reserved.</div>
        </div>

        <div className="flex gap-8 text-sm text-gray-300">
          <div>
            <div className="font-semibold text-white mb-2">Company</div>
            <a href="#" className="block hover:text-white">About</a>
            <a href="#careers" className="block hover:text-white">Careers</a>
            <a href="#contact" className="block hover:text-white">Contact</a>
          </div>

          <div>
            <div className="font-semibold text-white mb-2">Legal</div>
            <a href="#" className="block hover:text-white">Terms</a>
            <a href="#" className="block hover:text-white">Privacy</a>
            <a href="#" className="block hover:text-white">Cookies</a>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3">
          <div className="font-semibold text-white">Trusted by</div>
          <div className="flex items-center gap-3"><img src={Badge1} alt="badge" className="h-10" /><img src={Badge2} alt="badge" className="h-10" /></div>
        </div>
      </div>
    </footer>
  );
}

// ------------------ Main App ------------------
export default function OscardyneApp() {
  const [menuOpen, setMenuOpen] = useState(false);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-black text-white antialiased w-full">
      <Nav onOpen={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="pt-20">
        <ParallaxHero />
        <Services />
        <WhyUs />
        <Testimonials />
        <Careers />
        <Contact />
        <AIChat />
      </main>

      <Footer />

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
        <motion.a whileHover={{ scale: 1.05 }} href="#contact" className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-yellow-400 text-black font-bold shadow-2xl">Request Quote</motion.a>
      </div>
    </div>
  );
}
