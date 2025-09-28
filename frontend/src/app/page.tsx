import Hero from "../components/Hero";
import LiveStatsSection from "../components/LiveStatsSection";
import Footer from "../components/Footer";


export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Live stats section */}
      <LiveStatsSection />

      {/* Graphs shell + prescription action */}
      <section className="container graphs-section">
        <div className="actions-row">
          <a className="btn gradient" href="/prescriptions/new">Generate Prescription</a>
        </div>
      </section>

      

      <Footer />
    </>
  );
}
