"use client";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import Header from "@/components/shared/header/Header";
import {useSelector} from "react-redux";
import {useGetServerQuery} from "@/services/server/serverApi";
const Success = () => {
    const {data} = useGetServerQuery();
    const [info, setInfo] = useState(null);
    useEffect(() => {
        if (data) {
            setInfo(data.description);
        }
    },[data]);
    return (

        <section className="flex flex-col items-center gap-4 p-8 bg-white">
            <Header/>
            {info}
        </section>
    );
};

export default Success;
