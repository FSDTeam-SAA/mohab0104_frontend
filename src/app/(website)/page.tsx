import HomeBanner from "@/components/home/banner";
import CompanyTrusted from "@/components/home/company_trusted";
import FaqSection from "@/components/home/faq-section";
import Services from "@/components/home/services";
import TellUsAbout from "@/components/home/tell_us_about";

export default function Home() {
  return (
    <main>
      <HomeBanner
        imageUrl="/image/hero_image.png"
        title="  Lorem ipsum dolor sit amet, consectetur adipisicing."
        desc="  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            efficitur diam non sodales eleifend. Vivamus ut hendrerit neque.
            Nunc nec eleifend magna. Donec posuere nisi quis lorem pellentesque
            ornare."
      />
      <CompanyTrusted />
      <Services activet={"Home"} />
      <TellUsAbout />
      <FaqSection />
    </main>
  );
}
