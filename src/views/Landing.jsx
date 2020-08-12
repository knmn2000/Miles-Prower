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
        <LandingButtons text="Metabase" link="http://metabase.radicali.io/" />
        <LandingButtons
          text="Kibana"
          link="http://kibana-production.radicali.io/login?next=%2F"
        />
        <LandingButtons
          text="Zoho"
          link="https://app.zohocreator.com/shubhankar9/sonic-dev-apac-2019#Section_1"
        />
        <LandingButtons
          text="Sentry"
          link="https://sentry.radicali.io/radicali/sonic/"
        />
      </div>
    </div>
  );
};
