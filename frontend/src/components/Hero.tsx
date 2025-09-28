import Image from "next/image";
import HeroVideo from "./HeroVideo";
import VitalicusLogo from "@/components/VitalicusLogo";

export default function Hero() {
  return (
    <section className="hero">
      <HeroVideo></HeroVideo>

      <div className="container stack-l hero-content">
        <div className="stack-s">
          <div className="hero-brandline">
            <Image src="/vhsmo.png" alt="VHSMO Logo" width={90} height={32} priority />
            <span className="hero-presents">presents</span>
          </div>

          <h1 className="h1 h1-tight">
            <VitalicusLogo size={92} />
            <span className="gradient">Vitalicus</span>
            <br /> by Team DBRC
          </h1>
          <div className="kicker" />
          <p className="lede">
            Seamlessly connecting doctors, patients, and reps with real-time vitals, AI insights, and secure communication for smarter healthcare decisions.
          </p>
        </div>

        

        
      </div>
    </section>
  );
}
