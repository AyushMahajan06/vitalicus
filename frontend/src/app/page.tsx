import Hero from "../components/Hero";
import LiveStatsSection from "../components/LiveStatsSection";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Live stats section */}
      <LiveStatsSection userId="demo-user" tempUnit="°C" />

      {/* Graphs shell + prescription action */}
      <section className="container graphs-section">
        
        <div className="graphs-panel">{/* charts will go here later */}</div>

        <div className="actions-row">
          <a className="btn" href="/prescriptions/new">Generate Prescription</a>
        </div>

      </section>

      <Footer />
    </>
  );
}
