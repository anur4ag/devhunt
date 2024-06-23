import { Link } from "@tanstack/react-router";
import React, { useState } from "react";

const NavLinks = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Hackathons",
    link: "/hackathons",
  },
];

const NavBar = () => {
  return (
    <div className="pt-4">
      <div className=" box-border flex flex-col items-center py-3">
        <nav className="box-border flex">
          <ul
            className="p-0 m-0 flex flex-nowrap w-full bg-[#F0F4FF] rounded-lg list-none box-border
"
          >
            {NavLinks.map((option) => (
              <li key={option.name} className="p-1 flex-1 box-border">
                <Link
                  to={option.link}
                  className="group text-[#3770FF] relative block m-0 p-3 px-4 w-full rounded cursor-pointer transition-background duration-300 ease-in text-base leading-[18.4px] [&.active]:bg-[#3770ff] [&.active]:text-white  hover:bg-[#3770ff33] [&.inactive]:text-[#3770FF]"
                >
                  <p className="z-2 whitespace-nowrap box-border text-xs leading-4 tracking-[1.44px] font-bold font-montserrat m-0 uppercase ">
                    {option.name}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
