import React from "react";
import HomeBanner from "../home/banner";
import CompanyTrusted from "../home/company_trusted";
import Services from "../home/services";
import SolutionCard from "./solution_card";

const SolutionBody = () => {
  return (
    <div>
      <HomeBanner
        imageUrl="/image/hero_image.png"
        title="Lorem ipsum dolor sit amet, consectetur cras amet."
        desc="
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficitur diam non sodales eleifend. Vivamus ut hendrerit neque. Nunc nec eleifend magna. Donec posuere nisi quis lorem pellentesque ornare."
      />
      <div>
        <CompanyTrusted />
        <Services activet={"activet"} />
        <SolutionCard />
      </div>
    </div>
  );
};

export default SolutionBody;
