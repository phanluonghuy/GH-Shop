
"use client";
import Image from "next/image";
import React, { use } from "react";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/Footer";
import { useEffect,useState } from "react";
import { useSelector } from "react-redux";

const Success = () => {
  const { user } = useSelector((state) => state.auth);
  const [userName, setUserName] = useState(''); // Correct useState destructuring

  useEffect(() => {
    console.log(user);
    if (user.role === 'guest') {
      setUserName(user.email);
    }
  }, [user]);
  return (
    
    <section className="flex flex-col items-center gap-4 p-8 bg-white">
      <Header />
      <Image
        src="/success.gif"
        alt="Success"
        height={300}
        width={600}
        className="max-w-full"
      />
      <h1 className="text-4xl font-bold text-center">Payment Successful</h1>
      {(user.role === 'guest') ? (
        <div className="text-center mt-4">
          <p className="text-lg font-medium">Username: {userName}</p>
          <p className="text-lg font-medium">Password: Guest@123123</p>
        </div>
      ) : null}
    </section>
  );
};

export default Success;
