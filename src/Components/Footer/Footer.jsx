import React from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FiLink } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto w-full px-4 py-7 sm:px-6 lg:px-8">
        <div className="flex flex-col flex-wrap items-center gap-6 md:flex-row md:justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm">
              <FiLink size={20} strokeWidth={2.5} />
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-sky-500">
                Linky
              </h2>

              <p className="text-xs text-gray-400">
                Connect. Share. Belong.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-gray-400">
            <a
              href="#"
              className="transition-colors hover:text-sky-500"
            >
              Home
            </a>

            <a
              href="#"
              className="transition-colors hover:text-sky-500"
            >
              About
            </a>

            <a
              href="#"
              className="transition-colors hover:text-sky-500"
            >
              Contact
            </a>
          </nav>

          {/* Social */}
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <div className="flex items-center gap-2">
              <a
                href="#"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-50 hover:text-sky-500"
              >
                <FaGithub size={17} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-50 hover:text-sky-500"
              >
                <FaLinkedin size={17} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-50 hover:text-sky-500"
              >
                <FaInstagram size={17} />
              </a>
            </div>

            <span className="hidden h-5 w-px bg-gray-200 sm:block" />

            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Linky
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}