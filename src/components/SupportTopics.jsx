import { useState } from "react";
import {
  UserCircleIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  PhoneIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import SupportModal from "./SupportModal";

const topics = [
  {
    title: "Account Issues",
    description: "Help with login, profile, or security",
    icon: UserCircleIcon,
    steps: [
      "Go to the login page.",
      'Click on "Forgot Password" if you can’t remember your password.',
      'Update your profile details from the "Account Settings" section.',
      "Enable Two-Factor Authentication for added security.",
    ],
  },
  {
    title: "Buying Vehicles",
    description: "Understand how to place a bid or buy",
    icon: ShoppingCartIcon,
    steps: [
      "Browse available cars from the listings page.",
      "Check car details, inspection report, and price.",
      'Click "Place a Bid" and set your maximum offer.',
      'Track your bids in the "My Bids" section.',
    ],
  },
  {
    title: "Selling Vehicles",
    description: "List your car, manage offers, or set reserves",
    icon: DocumentTextIcon,
    steps: [
      'Go to "Sell My Car" section.',
      "Enter your vehicle details (Make, Model, Year, Condition).",
      "Upload clear images of your vehicle.",
      "Set your reserve price and publish listing.",
    ],
  },
  {
    title: "Payment & Refunds",
    description: "Payment methods, issues, or refunds",
    icon: BanknotesIcon,
    steps: [
      "Choose from available payment methods (Bank Transfer, Credit Card).",
      "Once payment is confirmed, invoice is generated.",
      'For refund requests, go to "Transactions" and select the relevant order.',
      "Contact support if refund takes longer than 7 days.",
    ],
  },
  {
    title: "Technical Support",
    description: "Get help with website or app glitches",
    icon: Cog6ToothIcon,
    steps: [
      "Clear browser cache if website isn’t loading properly.",
      "Make sure you’re using the latest app version.",
      "Use a stable internet connection for best experience.",
      "If issues persist, report a bug through the Contact Us page.",
    ],
  },
  {
    title: "Contact Us",
    description: "Can’t find your answer? Contact our team",
    icon: PhoneIcon,
    steps: [
      "Email us at support@chuhdarycars.com.",
      "Call us on 042-123-4567 from 9AM–6PM.",
      "Live Chat support is available on the website.",
      "Visit our office: 123 Main Boulevard, Lahore.",
    ],
  },
];

const SupportTopics = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <section className="py-16 px-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-10">
        Popular Support Topics
      </h2>
      <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 max-w-6xl mx-auto">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedTopic(topic)}
          >
            <div className="flex items-center mb-4">
              <topic.icon className="w-10 h-10 text-[#233d7b] mr-4" />
              <h3 className="text-xl font-semibold text-gray-800">
                {topic.title}
              </h3>
            </div>
            <p className="text-gray-600">{topic.description}</p>
          </div>
        ))}
      </div>
      {selectedTopic && (
        <SupportModal
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
        />
      )}
    </section>
  );
};

export default SupportTopics;
