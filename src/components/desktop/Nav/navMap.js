import React from "react";
import { GiWorld } from "react-icons/gi";
import { AiOutlineHome, AiOutlineSetting } from "react-icons/ai";
import { TiMap } from "react-icons/ti";

export default [
    {
    url: '/',
    icon: <GiWorld />
},
    {
    url: '/india',
    icon: <AiOutlineHome />
},
    {
    url: '/compare',
    icon: <TiMap />
},
    {
    url: '/settings',
    icon: <AiOutlineSetting />
},
]