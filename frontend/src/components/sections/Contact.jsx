import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Send, Loader2 } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Button from "../ui/Button";
import { submitInquiry } from "../../services/inquiryService";
import { useCatalogContext } from "../../context/CatalogContext";

const INITIAL_FORM = {
  name: "",
  email: "",
  company: "",
  productInterest: "",
  message: "",
};

const inputClass =
  "w-full px-4 py-2.5 rounded-xl bg-white border text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400/40";

export default function Contact({ defaultProductInterest = "" }) {
  const { categories } = useCatalogContext();
  const [form, setForm] = useState({
    ...INITIAL_FORM,
    productInterest: defaultProductInterest,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (defaultProductInterest) {
      setForm((prev) => ({ ...prev, productInterest: defaultProductInterest }));
    }
  }, [defaultProductInterest]);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Invalid email address";
    }
    if (!form.message.trim()) next.message = "Message is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);
    try {
      await submitInquiry({
        name: form.name,
        email: form.email,
        company: form.company,
        productInterest: form.productInterest,
        message: form.message,
      });
      toast.success("Thank you! We will contact you soon.");
      setForm(INITIAL_FORM);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send inquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Get in Touch"
          title="Contact Us"
          subtitle="Interested in partnering or placing an export order? Send us your inquiry."
        />

        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-6 md:p-8 rounded-2xl border border-gold-200 bg-white shadow-card"
            noValidate
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`${inputClass} ${errors.name ? "border-red-400" : "border-slate-200"}`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`${inputClass} ${errors.email ? "border-red-400" : "border-slate-200"}`}
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1.5">
                Company
              </label>
              <input
                id="company"
                name="company"
                value={form.company}
                onChange={handleChange}
                className={`${inputClass} border-slate-200`}
                placeholder="Company name (optional)"
              />
            </div>

            <div>
              <label
                htmlFor="productInterest"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Product Interest
              </label>
              <select
                id="productInterest"
                name="productInterest"
                value={form.productInterest}
                onChange={handleChange}
                className={`${inputClass} border-slate-200`}
              >
                <option value="">Select a product line</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug || cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                className={`${inputClass} resize-none ${errors.message ? "border-red-400" : "border-slate-200"}`}
                placeholder="Tell us about your inquiry..."
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Inquiry
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
