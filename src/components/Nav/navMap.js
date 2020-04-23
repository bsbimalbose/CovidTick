import React from "react";
import { GiWorld, GiEarthAmerica } from "react-icons/gi";
import { AiOutlineHome, AiOutlineSetting, AiOutlineBulb } from "react-icons/ai";
import { TiMap } from "react-icons/ti";
import { ReactSVG } from "react-svg";
import { FaRegLightbulb } from "react-icons/fa";
import { IoMdGitCompare } from "react-icons/io";

export default [
  {
    url: "/",
    icon: <GiEarthAmerica />
  },
  {
    url: "/india",
    icon: (
      <ReactSVG
        src={"india.svg"}
        className={"india-icon"}
        beforeInjection={svg => {
          svg.classList.add("svg-class-name");
          svg.setAttribute("style", "width: 20px");
        }}
      />
    )
  },
  {
    url: "/compare",
    icon: <IoMdGitCompare />
  },
  {
    url: "/tips",
    icon: <AiOutlineBulb />
  }
];
