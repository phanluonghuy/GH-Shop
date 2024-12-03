"use client";

import React from "react";
import Container from "./Container";
import {IoAccessibilityOutline} from "react-icons/io5";
import {useRouter} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {Typography} from "@material-tailwind/react";

const Footer = () => {

    return (
        <footer
            className="flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 pl-56 pr-56 border-t border-blue-gray-50 py-6 text-center md:justify-between">
            <Typography color="blue-gray" className="font-normal">
                &copy; {new Date().getFullYear()} GH Shop. All rights reserved.
            </Typography>
            <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
                <li>
                    <Typography
                        as="a"
                        href="#"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                    >
                        About Us
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="#"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                    >
                        License
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="#"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                    >
                        Contribute
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="#"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                    >
                        Contact Us
                    </Typography>
                </li>
            </ul>
        </footer>
    );
};

export default Footer;
