import Navbar from "./components/Navbar";
import Countdown from "./components/Countdown";
import Footer from "./components/Footer";
import MobileNav from "./components/MobileNav";

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

function App() {
  if (window.location.pathname.startsWith("/admin")) {
    return <AdminApp />;
  }
  return (
    <div className="min-h-screen bg-ivory font-body text-brown">
      <Navbar />

      <main>
        <Hero />

        <Countdown />

        <OurStory />

        <WeddingEvents />

        <DressCode />

        <Asoebi />

        <Gifts />

        <GiftRegistry />

        <RSVP />

        <Gallery />

        <FAQ />

        <Contact />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default App;
