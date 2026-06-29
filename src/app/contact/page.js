"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, Send, Clock } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Bespoke Styling Appointment",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState(null);

  React.useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((e) => console.error("Contact settings failed to load", e));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "Bespoke Styling Appointment", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white pt-10 pb-20">
      
      {/* Title */}
      <div className="text-center mb-16 max-w-3xl mx-auto px-4">
        <span className="text-[10px] tracking-[0.4em] font-semibold text-[#D4AF37] uppercase mb-2 block">
          Styling concierge
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-white tracking-wide">
          Connect With Us
        </h1>
        <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Column Left: Contact Details */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <h2 className="font-serif text-2xl text-white tracking-wide mb-4">Shanvika Showroom</h2>
              <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                Step into our private luxury salon for customizable bridal outfit styling, fabric draping inspections, and custom size consultations.
              </p>
            </div>

            <div className="flex flex-col gap-5 text-xs font-light">
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider text-[10px] mb-1">Showroom Location</h4>
                  <p className="text-neutral-400">
                    Plot 26, Galleria Boulevard, Jubilee Hills, Hyderabad, TS, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider text-[10px] mb-1">Inquiries & Booking</h4>
                  <p className="text-neutral-400 font-mono">{settings?.whatsappNumber || "+91 98765 43210"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider text-[10px] mb-1">Electronic Mail</h4>
                  <p className="text-neutral-400 font-mono">styling@shanvikastudio.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider text-[10px] mb-1">Salon Hours</h4>
                  <p className="text-neutral-400">
                    Monday &ndash; Saturday: 11:00 AM &ndash; 8:00 PM <br />
                    Sunday (By Invitation/Prior Appointment Only)
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Map */}
            <div className="w-full aspect-[16/9] rounded overflow-hidden border border-neutral-900 bg-neutral-950 flex items-center justify-center p-4 text-center">
              <div className="flex flex-col items-center">
                <MapPin className="h-7 w-7 text-[#D4AF37] mb-2 animate-bounce" />
                <span className="text-[10px] tracking-widest text-[#C5A059] uppercase font-semibold">Jubilee Hills Boutique Map</span>
                <span className="text-[9px] text-neutral-600 mt-1 font-mono">17.4265° N, 78.4121° E</span>
              </div>
            </div>
          </div>

          {/* Column Right: Contact Form */}
          <div className="lg:col-span-7 bg-neutral-950/70 border border-neutral-900 rounded-xl p-8 h-fit">
            <h3 className="font-serif text-xl text-white tracking-wide mb-6">Schedule styling appointment</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-xs font-light">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black border border-neutral-850 focus:border-[#D4AF37] outline-none text-xs rounded px-3 py-2.5 text-white transition"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-black border border-neutral-850 focus:border-[#D4AF37] outline-none text-xs rounded px-3 py-2.5 text-white font-mono transition"
                    placeholder="+91 90000 00000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black border border-neutral-850 focus:border-[#D4AF37] outline-none text-xs rounded px-3 py-2.5 text-white font-mono transition"
                  placeholder="name@email.com"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                  Subject of Inquiry
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-black border border-neutral-850 text-neutral-300 rounded px-3 py-2.5 outline-none focus:border-[#D4AF37] transition"
                >
                  <option value="Bespoke Styling Appointment">Bespoke Styling Appointment</option>
                  <option value="Custom Fit Measurements Request">Custom Fit Measurements Request</option>
                  <option value="Wedding / Bridal Showcase Inquiry">Wedding / Bridal Showcase Inquiry</option>
                  <option value="Bulk Order Privilege">Bulk Order Privilege</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                  Message / Styling Notes
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black border border-neutral-850 focus:border-[#D4AF37] outline-none text-xs rounded px-3 py-2.5 text-white transition resize-none placeholder:text-neutral-800"
                  placeholder="Share detail measurements or style patterns you seek..."
                />
              </div>

              <button
                type="submit"
                className="bg-gold-gradient text-black font-semibold text-xs tracking-wider uppercase py-3 rounded hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> Send Inquiry
              </button>

              {submitted && (
                <div className="bg-emerald-950/40 border border-emerald-500/25 p-4 rounded text-center text-emerald-400 animate-fade-in">
                  💎 Your inquiry has been sent successfully! Our styling concierge will contact you within 2-4 hours.
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
      
    </div>
  );
}
