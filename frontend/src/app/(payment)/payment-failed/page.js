/**
 * Title: Write a program using JavaScript on Not-found
 * Author: Hasibul Islam
 * Portfolio: https://devhasibulislam.vercel.app
 * Linkedin: https://linkedin.com/in/devhasibulislam
 * GitHub: https://github.com/devhasibulislam
 * Facebook: https://facebook.com/devhasibulislam
 * Instagram: https://instagram.com/devhasibulislam
 * Twitter: https://twitter.com/devhasibulislam
 * Pinterest: https://pinterest.com/devhasibulislam
 * WhatsApp: https://wa.me/8801906315901
 * Telegram: devhasibulislam
 * Date: 09, October 2023
 */

import Image from "next/image";
import React from "react";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/Footer";

const Success = () => {
  return (
    
    <section className="flex flex-col items-center gap-4 p-8 bg-white">
      <Header />
      <Image
        src="/failed.gif"
        alt="Success"
        height={300}
        width={600}
        className="max-w-full"
      />
      <h1 className="text-4xl font-bold text-center">Payment Failed</h1>
    </section>
  );
};

export default Success;
