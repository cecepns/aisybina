import { Shield, Handshake, Lightbulb, Heart } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { COMPANY_VALUES } from "../../data/products";

const VALUE_ICONS = [Shield, Handshake, Lightbulb, Heart];

export default function Values() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Integrity"
          title="Our Values"
          subtitle="Company values we always maintain to ensure integrity and trust in every partnership."
        />

        <div className="grid sm:grid-cols-2 gap-6">
          {COMPANY_VALUES.map((value, index) => {
            const Icon = VALUE_ICONS[index] || Shield;
            return (
              <div
                key={value.id}
                className="p-6 md:p-8 rounded-2xl border border-gold-100 bg-cream-50 hover:border-gold-200 hover:shadow-card transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gold-100 group-hover:bg-gold-200/60 transition-colors shrink-0">
                    <Icon className="text-gold-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-slate-900 mb-3">
                      {index + 1}. {value.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
