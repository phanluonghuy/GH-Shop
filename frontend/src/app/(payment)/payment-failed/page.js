import Image from "next/image";
import React from "react";
import Header from "@/components/shared/header/Header";

const Success = () => {
    return (

        <section className="flex flex-col items-center gap-4 p-8 bg-white">
            <Header/>
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
