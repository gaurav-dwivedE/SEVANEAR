import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 px-6 py-10 ">
      <div className="mx-auto max-w-7xl">

        <div className="grid gap-8 md:grid-cols-4">

          <div>
            <h2 className="text-2xl font-bold">
              <span className="text-orange-500">Seva</span>Near
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Find trusted local services near you.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-500">Quick Links</h3>

            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <p>Home</p>
              <p>Services</p>
              <p>How It Works</p>
              <p>About Us</p>
            </div>
          </div>

          <div>
            <h3 className="text-gray-500 font-semibold">For Professionals</h3>

            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <p>Become a Partner</p>
              <p>Partner Login</p>
              <p>Partner Support</p>
            </div>
          </div>

          <div>
            <h3 className=" text-gray-500 font-semibold">Contact</h3>

            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <p>📍 India</p>
              <p>📞 +91 xxxxxxxx</p>
              <p>✉️ support@sevanear.com</p>
            </div>
          </div>

        </div>

        <div className="mt-8  text-center text-xs text-gray-500">
          © {new Date().getFullYear()} SevaNear. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;