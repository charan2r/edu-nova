"use client";
import { GraduationCap } from "lucide-react";

function Footer() {
  const navLinks = [
    { name: "About", href: "#" },
    { name: "Courses", href: "#" },
    { name: "contact", href: "#" },
  ];

  

  return (
    <footer className="py-10 px-4 sm:px-6 lg:px-8 font-inter relative overflow-hidden ">
      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary mr-2">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-white-900 dark:text-white text-xl font-extrabold tracking-wide">
            Edu Nova
          </span>
        </div>

        <nav className="mb-6 w-full">
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-base font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-gray-900 dark:after:bg-white after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

       

        <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} Edu Nova. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
