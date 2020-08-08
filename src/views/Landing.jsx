import React from "react";
import { LandingButtons } from "../components/LandingButtons";
export const Landing = () => {
  return (
    <div className="landing">
      <span className="landing-text">SONIC</span>
      <div className="landing-buttons">
        <LandingButtons
          text="Check Sonic instance"
          link="https://sonic.radicali.io/1/jobs/"
        />
        <LandingButtons text="Build a Scraper" link="/scraper" />
      </div>
    </div>
  );
};
