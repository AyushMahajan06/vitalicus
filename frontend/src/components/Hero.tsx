import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">
      <video
        className="hero-video"
        src="/videos/hero.mp4" 
        autoPlay
        muted
        loop
        playsInline
      />

      

      <div className="container stack-l hero-content">
        <div className="stack-s">
          <div className="hero-brandline">
            <Image src="/vhsmo.png" alt="VHSMO Logo" width={90} height={32} priority />
            <span className="hero-presents">presents</span>
          </div>

          <h1 className="h1 h1-tight">
            Team DBRC's
            <br /> <span className="gradient">Health Tracker 3000</span>
          </h1>
          <div className="kicker" />
          <p className="lede">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            gravida lectus vitae congue posuere. Sed ultricies ligula vitae elit
            fermentum posuere.
          </p>
        </div>

        

        <div className="strip">
          <article className="card stack-s">
            <h4>Real-time Channels</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </article>
          <article className="card stack-s">
            <h4>AI Technology</h4>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
          </article>
          <article className="card stack-s">
            <h4>On-Demand Access</h4>
            <p>Duis aute irure dolor in reprehenderit in voluptate.</p>
          </article>
        </div>

        <div className="logo-row">
          <span className="logo-pill">Genentech</span>
          <span className="logo-pill">BMS</span>
          <span className="logo-pill">AstraZeneca</span>
          <span className="logo-pill">Pfizer</span>
          <span className="logo-pill">Novo Nordisk</span>
        </div>
      </div>
    </section>
  );
}
