import { ArrowRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import ServicesCard from "./services_card";

interface ServicesProps {
  activet: string;
}

const Services = ({ activet }: ServicesProps) => {
  return (
    <div className="bg-[#EBF7FD] py-20 ">
      <h3 className="text-[#424242] font-bold text-[40px] text-center mb-[50px]">
        Services
      </h3>
      <div>
        <div className="container mx-auto">
          <ServicesCard />
        </div>
        <div>
          <section className="mt-[172px]">
            {activet === "Home" ? (
              <div className="container mx-auto">
                <div className="relative w-[799px] h-[339px] rounded-xl  shadow-md">
                  {/* Left Side Image */}
                  <Image
                    src="/image/services.jpg"
                    alt="Leadership Visual"
                    width={799}
                    height={339}
                    className="w-[799px] h-[339px] object-cover rounded-md"
                  />

                  {/* Right Side Text Box */}
                  <div className="absolute -top-16 -right-48 w-[607px] h-[343px] bg-[#36A4E4] text-white p-10 rounded-xl shadow-lg flex flex-col justify-center">
                    <h2 className="text-[28px] leading-[40px] font-semibold mb-4">
                      Inspiring Leadership and <br /> Strengthening Teams <br />{" "}
                      Across Every Sector
                    </h2>
                    <p className="text-sm leading-[22px] mb-6">
                      Lorem ipsum dolor sit amet consectetur. Ullamcorper lacus
                      diam quis morbi gravida purus. Quis nisi rutrum in sed
                      imperdiet sed et commodo in. Ultricies at lectus in varius
                      a lectus.
                    </p>
                    <Button className="bg-white text-black text-sm font-medium px-5 py-2 rounded-md hover:bg-gray-100 w-fit">
                      Explore Who We Help{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white  ">
                <div className="container mx-auto py-[72px]  grid lg:grid-cols-2 grid-cols-1 ">
                  <Image
                    src="/image/services.jpg"
                    alt="Leadership Visual"
                    width={799}
                    height={600}
                    className="w-[500px] h-[480px] object-cover rounded-md"
                  />
                  <div>
                    <h1 className="text-[#000000] font-bold text-[40px]">
                      Lorem ipsum dolor sit amet
                    </h1>
                    <p className="text-[#545454] font-normal text-[20px]">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Donec luctus quam vitae molestie interdum. Sed rutrum
                      iaculis efficitur. Mauris malesuada purus urna, quis
                      commodo nulla imperdiet vitae. Pellentesque convallis
                      augue libero. Maecenas gravida odio vel interdum
                      hendrerit. Praesent a urna quis felis laoreet fringilla ac
                      a dolor. Donec tempus lorem ut dapibus varius. Proin
                      malesuada suscipit rhoncus. Aliquam tempus quam efficitur
                      nunc vulputate lacinia. Nunc a porttitor ex, vel vulputate
                      ex. Nunc ut metus scelerisque, dictum mauris id,
                      consectetur tellus. Nunc odio ex, pretium vel sem et,
                      fringilla imperdiet lectus. Quisque posuere, erat sed
                      consectetur mollis, lorem lorem pellentesque neque,
                      pharetra dignissim odio sapien a metus. Cras maximus leo
                      at efficitur viverra.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Services;
