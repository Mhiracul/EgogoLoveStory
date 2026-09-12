import { useRef, useState } from "react";

import Navbar from "./components/Navbar";
import Countdown from "./components/Countdown";
import Footer from "./components/Footer";
import MobileNav from "./components/MobileNav";
import WeddingEntrance from "./components/WeddingEntrance";
import MusicControl from "./components/MusicControl";
import Hero from "./sections/Hero";
import OurStory from "./sections/OurStory";
import WeddingEvents from "./sections/WeddingEvents";
import DressCode from "./sections/DressCode";
import Asoebi from "./sections/Asoebi";
import Gifts from "./sections/Gifts";
import GiftRegistry from "./sections/GiftRegistry";
import RSVP from "./sections/RSVP";
import Gallery from "./sections/Gallery";
import FAQ from "./sections/FAQ";
import Contact from "./sections/Contact";
import AdminApp from "./admin/AdminApp";
import ordinary from "./assets/countonyou.mp3";
import WeddingWishes from "./sections/WeddingWishes";

function App() {
  const [showEntrance, setShowEntrance] = useState(true);

  const [registryAmount, setRegistryAmount] = useState(null);

  const audioRef = useRef(null);

  if (window.location.pathname.startsWith("/admin")) {
    return <AdminApp />;
  }

  const startMusic = async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.volume = 0.65;
      await audioRef.current.play();
    } catch (error) {
      console.error("Music could not start:", error);
    }
  };

  const handleEntranceComplete = () => {
    setShowEntrance(false);
  };

  const handleRegistryContribution = (amount) => {
    setRegistryAmount(amount);

    setTimeout(() => {
      document.getElementById("gifts")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <>
      {/* GLOBAL WEDDING MUSIC */}
      <audio ref={audioRef} src={ordinary} loop preload="auto" />

      {/* FULL-SCREEN WEDDING ENTRANCE */}
      {showEntrance && (
        <WeddingEntrance
          onOpen={startMusic}
          onComplete={handleEntranceComplete}
        />
      )}

      {/* ACTUAL WEDDING WEBSITE */}
      <div className="min-h-screen bg-ivory font-body text-brown">
        <Navbar />

        <main>
          <Hero />
          <Countdown />
          <OurStory />
          <WeddingEvents />
          <DressCode />
          <Asoebi />

          <Gifts
            registryAmount={registryAmount}
            onRegistryAmountUsed={() => setRegistryAmount(null)}
          />

          <GiftRegistry onContribute={handleRegistryContribution} />

          <RSVP />
          <Gallery />
          <WeddingWishes />
          <FAQ />
          <Contact />
        </main>

        <Footer />
        <MobileNav />
      </div>

      {/* FLOATING MUSIC CONTROL */}
      {!showEntrance && <MusicControl audioRef={audioRef} />}
    </>
  );
}

export default App;
