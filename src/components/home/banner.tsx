import React from "react";
import { Button } from "../ui/button";

interface BannerrProp {
  imageUrl: string;
  title: string;
  desc: string;
}

export default function HomeBanner({
  imageUrl = "/image/hero_image.png",
  title = "data nai",
  desc='data daow',
}: BannerrProp) {
  return (
    <section
      className="relative text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative container mx-auto h-screen flex items-center">
        <div className="lg:max-w-[55%]">
          <h1 className="font-bold leading-[120%] text-6xl pb-8">{title}</h1>
          <p className="text-lg leading-[150%] pb-8">{desc}</p>
          <Button>Book A Demo</Button>
        </div>
      </div>
    </section>
  );
}
