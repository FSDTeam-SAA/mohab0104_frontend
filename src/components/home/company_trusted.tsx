"use client";
import Image from "next/image";
import React from "react";

const CompanyTrusted = () => {
  const companyData = [
    { id: 1, logo: "/image/company1.png" },
    { id: 2, logo: "/image/company2.png" },
    { id: 3, logo: "/image/company3.png" },
    { id: 4, logo: "/image/company4.png" },
    { id: 5, logo: "/image/company5.png" },
    { id: 6, logo: "/image/company6.png" },
    { id: 7, logo: "/image/company7.png" },
    { id: 8, logo: "/image/company8.png" },
    { id: 9, logo: "/image/company9.png" },
    { id: 10, logo: "/image/company10.png" },
  ];

  // Duplicate the logos to create a seamless loop
  const logos = [...companyData, ...companyData];

  return (
    <div className="py-10 bg-gray-100 mb-[72px]">
      <h1 className="text-center text-[40px]  font-bold  text-[#424242] mb-[48px]">
        More Than 200+ Companies Trust Us
      </h1>
      <div className="overflow-hidden whitespace-nowrap">
        <div className="animate-marquee flex gap-10">
          {logos.map((company) => (
            <div key={company.id + Math.random()} className="bg-[#E7E7E752]  border-[#E7E7E766] border">
              <Image
                width={800}
                height={800}
                src={company.logo}
                alt={`Company ${company.id}`}
                className="h-[44px] w-[100px]  object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyTrusted;
