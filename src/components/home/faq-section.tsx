import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqSection() {
  return (
    <div className="w-full  px-4 py-[72px] bg-[#EBF7FD] min-h-screen">
      <div className="container mx-auto">
        <div className="text-center mb-[48px] ">
          <h1 className="text-3xl font-bold text-[#131313] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed text-[16px] font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="space-y-4"
          defaultValue="item-1"
        >
          <AccordionItem
            value="item-1"
            className="border border-[#B5B5B5] rounded-lg bg-white px-6 py-[14px]"
          >
            <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline [&[data-state=open]>svg]:rotate-45">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed pt-2 pb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="border border-gray-200 rounded-lg bg-white px-6 py-2"
          >
            <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline [&[data-state=open]>svg]:rotate-45">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed pt-2 pb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="border border-gray-200 rounded-lg bg-white px-6 py-2"
          >
            <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline [&[data-state=open]>svg]:rotate-45">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed pt-2 pb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-4"
            className="border border-gray-200 rounded-lg bg-white px-6 py-2"
          >
            <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline [&[data-state=open]>svg]:rotate-45">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed pt-2 pb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-5"
            className="border border-gray-200 rounded-lg bg-white px-6 py-2"
          >
            <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline [&[data-state=open]>svg]:rotate-45">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed pt-2 pb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
