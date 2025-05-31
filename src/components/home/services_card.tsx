import { MessageSquare } from "lucide-react";
import React from "react";

const ServicesCard = () => {
  return (
    <div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1  ">
        <div>
          <div className="bg-white rounded-xl shadow-[0px_0px_8px_0px_#00000040] p-8 text-center w-full max-w-[340px] mx-auto">
            <div className="flex justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-black" />
            </div>
            <h4 className="text-2xl font-semibold text-black mb-4">
              Enterprise Data Solutions
            </h4>
            <p className="text-[16px] font-normal text-gray-600 leading-relaxed">
              Enterprise Data Solutions help organizations manage, integrate,
              and analyze large volumes of data to drive smarter business
              decisions, improve efficiency, and support digital transformation.
            </p>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl shadow-[0px_0px_8px_0px_#00000040] p-8 text-center w-full max-w-[340px] mx-auto">
            <div className="flex justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-black" />
            </div>
            <h4 className="text-2xl font-semibold text-black mb-4">
              Enterprise Data Solutions
            </h4>
            <p className="text-[16px] font-normal text-gray-600 leading-relaxed">
              Enterprise Data Solutions help organizations manage, integrate,
              and analyze large volumes of data to drive smarter business
              decisions, improve efficiency, and support digital transformation.
            </p>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl shadow-[0px_0px_8px_0px_#00000040] p-8 text-center w-full max-w-[340px] mx-auto">
            <div className="flex justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-black" />
            </div>
            <h4 className="text-2xl font-semibold text-black mb-4">
              Enterprise Data Solutions
            </h4>
            <p className="text-[16px] font-normal text-gray-600 leading-relaxed">
              Enterprise Data Solutions help organizations manage, integrate,
              and analyze large volumes of data to drive smarter business
              decisions, improve efficiency, and support digital transformation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesCard;
