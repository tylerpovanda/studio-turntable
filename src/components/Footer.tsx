import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Footer: React.FC = () => (
  <div className="absolute bottom-4 w-full flex flex-col items-center z-50">
    {/* Text above the icons */}
    <p className="text-lg font-jacquard text-gray-500">
      get in touch:
    </p>

    {/* Social icons row */}
    <div className="flex gap-6">
      {/* <a
        href="https://www.instagram.com/poetry.vandal"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-gray-400 transition"
      >
        <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
      </a> */}

      <a
        href="mailto:tyler.povanda@gmail.com"
        className="text-gray-500 hover:text-gray-400 transition"
      >
        <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6" />
      </a>

      {/* <a
        href="https://www.tiktok.com/@poetryvandal"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-gray-400 transition"
      >
        <FontAwesomeIcon icon={faTiktok} className="w-6 h-6" />
      </a> */}
    </div>
  </div>
);

export default Footer;
