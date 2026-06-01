import { Sparkles, Target } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

export default function About() {
  return (
    <section className="py-12 md:py-16 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="About Us"
          title="About Our Company"
          subtitle="Unlimited Creativity, Endless Innovation"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              <strong className="text-gold-700 font-semibold">Aisybina Export</strong> is
              an Indonesian export company focused on providing high-quality products in
              the children&apos;s fashion and food sectors. We offer a combination of
              traditional values, educational needs, and modern lifestyles through three
              main lines: children&apos;s Muslim koko shirts, elementary, middle, and high
              school uniforms, and frozen groceries.
            </p>
            <p>
              With a strong commitment to quality, product authenticity, and professional
              service, Aisybina Export is here to answer the growing needs of local and
              international markets.
            </p>
            <p>
              We believe that authentic Indonesian products are able to compete in the
              global market by prioritizing quality, practicality, and cultural values.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-gold-200 bg-white shadow-card hover:shadow-soft transition-shadow">
              <Sparkles className="text-gold-500 mb-4" size={28} />
              <h3 className="font-serif text-xl text-slate-900 mb-2">Quality First</h3>
              <p className="text-sm text-slate-600">
                Every product meets rigorous export standards for hygiene, durability, and
                consistency.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-gold-200 bg-white shadow-card hover:shadow-soft transition-shadow">
              <Target className="text-gold-500 mb-4" size={28} />
              <h3 className="font-serif text-xl text-slate-900 mb-2">Global Reach</h3>
              <p className="text-sm text-slate-600">
                Serving business partners and consumers across local and international
                markets.
              </p>
            </div>
            <div className="sm:col-span-2 p-8 rounded-2xl border border-gold-200 bg-gradient-to-br from-gold-50 to-cream-100">
              <p className="font-serif text-2xl md:text-3xl text-center gold-gradient-text italic">
                &ldquo;Authentic Indonesian products competing globally through quality,
                practicality, and cultural values.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
