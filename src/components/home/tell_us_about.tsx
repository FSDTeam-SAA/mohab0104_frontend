"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export default function TellUsAbout() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    businessEmail: "",
    staffingNeed: "",
  });

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    console.log(`${field}:`, value);
    console.log("Complete form data:", updatedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
  };

  return (
    <div className=" container mx-auto p-6 bg-white">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Lorem ipsum dolor sit amet
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
          euismod velit. Ut dapibus est urna. Suspendisse dictum facilisis
          ullamcorper.
        </p>
        <ul className="text-gray-600 text-sm leading-relaxed space-y-2 list-disc ml-5">
          <li>
            Lorem ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Sed eget euismod velit. Ut dapibus est urna. Suspendisse
            dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in
            placerat dui.
          </li>
          <li>
            Lorem ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Sed eget euismod velit. Ut dapibus est urna. Suspendisse
            dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in
            placerat dui.
          </li>
          <li>
            Lorem ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Sed eget euismod velit. Ut dapibus est urna. Suspendisse
            dictum facilisis ullamcorper. Maecenas vitae efficitur tortor, in
            placerat dui.
          </li>
        </ul>
        <p className="text-gray-600 text-sm leading-relaxed mt-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
          euismod velit. Ut dapibus est urna. Suspendisse dictum facilisis
          ullamcorper. Maecenas vitae efficitur tortor, in placerat dui.
        </p>
      </div>

      {/* Business Meeting Image */}
      <div className="mb-8 rounded-lg overflow-hidden">
        <Image
          src="/image/about.jpg"
          alt="Business meeting with data visualization"
          width={800}
          height={800}
          quality={90}
          className="w-full h-[388px] object-cover"
          priority
        />
      </div>

      {/* Form Section */}
      <div className="mt-[40px]">
        <h2 className="text-[40px]  font-semibold text-[#323232] mb-6">
          Tell Us About Your Staffing Need:
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name and Last Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-[18px]  font-medium text-[#000000]  mb-2"
              >
                First Name
              </label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full p-4 border border-[#000000] rounded-md "
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-[18px]  font-medium text-[#000000]  mb-2"
              >
                Last Name
              </label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full p-4 border border-[#000000] rounded-md "
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label
              htmlFor="company"
              className="block text-[18px]  font-medium text-[#000000]  mb-2"
            >
              Company
            </label>
            <Input
              id="company"
              type="text"
              placeholder="Enter your Company Name"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              className="w-full p-4 border border-[#000000] rounded-md "
            />
          </div>

          {/* Business Email */}
          <div>
            <label
              htmlFor="businessEmail"
              className="block text-[18px]  font-medium text-[#000000]  mb-2"
            >
              Business Email
            </label>
            <Input
              id="businessEmail"
              type="email"
              placeholder="Enter Business email address"
              value={formData.businessEmail}
              onChange={(e) =>
                handleInputChange("businessEmail", e.target.value)
              }
              className="w-full p-4 border border-[#000000] rounded-md "
            />
          </div>

          {/* Staffing Need Textarea */}
          <div>
            <label
              htmlFor="staffingNeed"
              className="block text-[18px]  font-medium text-[#000000]  mb-2"
            >
              Tell Us About Your Upcoming Data-Driven Staffing Need:
            </label>
            <Textarea
              id="staffingNeed"
              placeholder="Describe and set expectations, project duration, role/scope, etc."
              value={formData.staffingNeed}
              onChange={(e) =>
                handleInputChange("staffingNeed", e.target.value)
              }
              className="w-full p-4  rounded-md  min-h-[120px] outline-none border-black focus-within:outline-none resize-vertical"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-[#38B1EA] hover:bg-[#3eabdd] text-white font-medium px-8 py-3 rounded-md transition-colors duration-200"
            >
              See Profiles Of Data-Driven Talent
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
