import Image from "next/image";
import HeroVideo from "./HeroVideo";
import VitalicusLogoIcon from "./VitalicusLogo";

export default function Hero() {
  return (
    <section className="hero">
      <HeroVideo />

      <div className="container stack-l hero-content">
        <div className="stack-s">
          <div className="hero-brandline motion-fadeUp motion-delay-1">
            <Image src="/vhsmo.png" alt="VHSMO Logo" width={90} height={32} priority />
            <span className="hero-presents">presents</span>
          </div>

          <h1 className="h1 h1-tight motion-fadeUp motion-delay-2">
            <span className="hero-wordmark">
              <span className="logo-inline" aria-hidden>
                <VitalicusLogoIcon size={72} />
              </span>
              <span className="gradient">Vitalicus</span>
            </span>
            <span className="byline">by Team DBRC</span>
          </h1>

          <div className="kicker motion-fadeUp motion-delay-3" />
          <p className="lede motion-fadeUp motion-delay-3">
            Seamlessly connecting doctors, patients, and reps with real-time vitals,
            AI insights, and secure communication for smarter healthcare decisions.
          </p>
        </div>
      </div>
    </section>
  );
}
