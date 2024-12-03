"use client";

import Banner1 from "@/components/home/Banner1";
import Banner2 from "@/components/home/Banner2";
import ExpertChoice from "@/components/home/ExpertChoice";
import NewArrivals from "@/components/home/NewArrivals";
import NicheExplorer from "@/components/home/NicheExplorer";
import Trending from "@/components/home/Trending";
import Main from "@/components/shared/layouts/Main";
import {useEffect, useState} from "react";

export default function Home() {
    const [token, setToken] = useState(null);
    const deleteCookie = (name) => {
        document.cookie = `${name}=; max-age=0; path=/`;  // Set cookie with max-age 0 to delete it
    };
    // Function to extract a specific cookie by its name
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
    };
    useEffect(() => {
        const getTokenFromCookie = () => {
            setToken(getCookie('token')); // Assuming your cookie name is 'auth_token'
            if (token) {
                localStorage.setItem("accessToken", token);
                deleteCookie('token');
                window.location.reload();
            }
        };
        getTokenFromCookie();
    }, [token]);

    return (
        <>
            <Main>
                <main className="flex flex-col gap-y-20 w-full">
                    <Banner1/>
                    {/*<Steps/>*/}
                    <NewArrivals/>
                    <Banner2/>
                    <ExpertChoice/>
                    <NicheExplorer/>
                    <Trending/>
                    {/*<Banner3/>*/}
                </main>
            </Main>
        </>
    );
}
