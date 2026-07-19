import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Navbar from "@/components/layout/Navbar";
import HowItWorks from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
    </>
  );
}
