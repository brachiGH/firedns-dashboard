import React from 'react';
export default async function Page() {
  return (
    <div className="p-6 bg-gray-800 text-gray-100 max-w-4xl mx-auto rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-orange-400">How It Works</h1>
      <p className="mb-6 text-gray-200">
        <strong>FireDNS</strong> is a modern, privacy-focused DNS service that helps you take control of your internet experience. It acts as a filter between your device and the internet, providing enhanced security, privacy, and performance.
      </p>
      <h2 className="text-2xl font-semibold mb-4 text-orange-400">What Does FireDNS Do?</h2>
      <ul className="mb-6 space-y-3">
        <li className="flex items-start">
          <span className="inline-block bg-orange-600 rounded-full w-2 h-2 mt-2 mr-2"></span>
          <span><strong className="text-white">Privacy Protection:</strong> Blocks trackers and ads, ensuring your online activity remains private.</span>
        </li>
        <li className="flex items-start">
          <span className="inline-block bg-orange-600 rounded-full w-2 h-2 mt-2 mr-2"></span>
          <span><strong className="text-white">Security:</strong> Protects you from malicious websites, phishing attempts, and other online threats.</span>
        </li>
        <li className="flex items-start">
          <span className="inline-block bg-orange-600 rounded-full w-2 h-2 mt-2 mr-2"></span>
          <span><strong className="text-white">Parental Controls:</strong> Allows you to restrict access to inappropriate content for a safer browsing experience.</span>
        </li>
        <li className="flex items-start">
          <span className="inline-block bg-orange-600 rounded-full w-2 h-2 mt-2 mr-2"></span>
          <span><strong className="text-white">Customizable:</strong> Offers advanced settings to tailor the service to your specific needs.</span>
        </li>
      </ul>
      <h2 className="text-2xl font-semibold mb-4 text-orange-400">Why Choose FireDNS?</h2>
      <p className="mb-4 text-gray-200">
        FireDNS is easy to set up and works across all your devices. Whether you're at home, at work, or on the go, it ensures a secure and private internet experience.
      </p>
      <p className="text-gray-200 bg-orange-600 bg-opacity-10 p-4 border-l-4 border-orange-500 rounded-r">
        Start using FireDNS today and take control of your online privacy and security.
      </p>
    </div>
  );
};