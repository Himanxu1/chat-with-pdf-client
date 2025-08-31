import React from "react";
import { Nav } from "../components/Landing/nav";
import { Hero } from "../components/Landing/hero";
import { Features } from "../components/Landing/features";
import { Steps } from "../components/Landing/steps";
import { Pricing } from "../components/Landing/pricing";
import { FAQ } from "../components/Landing/faq";
import { Footer } from "../components/Landing/footer";

const Home = () => {
  return (
    <div>
      <Nav />
      <Hero />
      <Features />
      <Steps />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
};
export default Home;
