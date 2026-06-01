import { Eye, Flag } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { MISSION_ITEMS } from "../../data/products";

export default function VisionMission() {
  return (
    <section className="py-12 md:py-16 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Purpose"
          title="Vision & Mission"
          subtitle="Guiding our commitment to deliver original Indonesian products with superior quality."
        />

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl border border-gold-200 bg-white shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gold-100">
                <Eye className="text-gold-600" size={28} />
              </div>
              <h3 className="font-serif text-2xl text-slate-900">Our Vision</h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg">
              To become a trusted export company that delivers original Indonesian products
              with superior quality, thereby providing added value to business partners,
              consumers, and the global community.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-gold-200 bg-white shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gold-100">
                <Flag className="text-gold-600" size={28} />
              </div>
              <h3 className="font-serif text-2xl text-slate-900">Our Mission</h3>
            </div>
            <ul className="space-y-4">
              {MISSION_ITEMS.map((item, i) => (
                <li key={item} className="flex gap-3 text-slate-600 leading-relaxed">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-gold-100 text-gold-700 text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
