import AnnouncementBar from "./components/layout/AnnouncementBar";
import Navigation from "./components/layout/Navigation";
import ScrollEffects from "./components/layout/ScrollEffects";

import Hero from "./sections/Hero";
import SelectedWork from "./sections/SelectedWork";
import Services from "./sections/Services";
import Process from "./sections/Process";
import About from "./sections/About";
import WhyWorkWithMe from "./sections/WhyWorkWithMe";
import Testimonials from "./sections/Testimonials";
import FAQ from "./sections/FAQ";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";


function App() {
  return (
    <div className="app-shell">

      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <ScrollEffects />

      <div
        className="site-grid"
        aria-hidden="true"
      />

      <div
        className="site-noise"
        aria-hidden="true"
      />

      <AnnouncementBar />

      <Navigation />


      <main id="main-content" tabIndex={-1}>

        <Hero />

        <Services />

        <SelectedWork />

        <Process />

        <About />

        <WhyWorkWithMe />

        <Testimonials />

        <FAQ />

        <Contact />

      </main>


      <Footer />

    </div>
  );
}


export default App;
