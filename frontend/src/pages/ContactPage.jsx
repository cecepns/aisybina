import { useSearchParams } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import Contact from "../components/sections/Contact";

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const productInterest = searchParams.get("product") || "";

  return (
    <PageShell>
      <Contact defaultProductInterest={productInterest} />
    </PageShell>
  );
}
