import React from "react";
import Container from "../shared/Container";
import Image from "next/image";
import {useRouter} from "next/navigation";

const Banner2 = ({className}) => {
    const router = useRouter();

    return (
        <section className="mt-20">
            <Container className={className ? className : ""}>
                <div
                    className="bg-yellow-50 h-full w-full rounded-primary relative flex flex-col gap-y-8 lg:p-24 p-8"
                    style={{backgroundImage: "url(/assets/home/banner/dots.svg)"}}
                >
                    <Image
                        src="/assets/home/banner/banner3.png"
                        alt="model"
                        height={872}
                        width={500}
                        className="lg:absolute bottom-0 left-10 order-2 cursor-zoom-in"
                    />
                    <article className="flex flex-col justify-start items-end order-1">
                        <div className="flex flex-col gap-y-4 max-w-lg z-50 lg:ml-auto lg:mr-0 mr-auto">
                            <h1 className="md:text-6xl text-4xl">
                                Special offer from Apple
                            </h1>
                            <p className="flex flex-row gap-x-0.5 items-center text-lg text-slate-500">
                                The MacBook is a sleek, high-performance laptop by Apple. It&#39;s available in Air and
                                Pro models.
                            </p>
                            <button
                                className="px-8 py-4 border border-black rounded-secondary bg-black hover:bg-black/90 text-white transition-colors drop-shadow w-fit mt-4"
                                onClick={() => window.location.href = "/products?brand=6735de7ac54fb96f8ec6e990"}>
                                Discover More
                            </button>
                        </div>
                    </article>
                </div>
            </Container>
        </section>
    );
};

export default Banner2;
