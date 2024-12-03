import Auth from "./auth";
import Providers from "./providers";
import "./globals.css";
import {Toaster} from "react-hot-toast";

export const metadata = {
    metadataBase: new URL("https://phanluonghuy.site"),
    title: "GH Shop - Experience the Future with Every Purchase",
    description:
        "GH Shop: Your go-to store for the latest electronics and gadgets. We offer innovative, high-quality products at great prices, helping you stay ahead in the world of technology!",
    openGraph: {
        title: "GH Shop - Experience the Future with Every Purchase",
        description:
            "GH Shop: Your go-to store for the latest electronics and gadgets. We offer innovative, high-quality products at great prices, helping you stay ahead in the world of technology!",
        url: "https://phanluonghuy.site",
        siteName: "PH Shop - Experience the Future with Every Purchase",
        // images:
        //   "https://github.com/devhasibulislam/canim-ecommerce/blob/master/client/public/og.png?raw=true",
        locale: "en_US",
        type: "website",
    },
    // twitter: {
    //   card: "summary_large_image",
    //   site: "@devhasibulislam",
    //   title: "Canim - Shop & eCommerce React Template",
    //   description:
    //     "Buy Canim - Shop & eCommerce Next.Js Template by Hasibul Islam. Canim | Shop & eCommerce React Template - a responsive React template. Canim is built with the latest Next.Js 13 App Directory",
    //   image:
    //     "https://github.com/devhasibulislam/canim-ecommerce/blob/master/client/public/og.png?raw=true",
    // },
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body>
        <Providers>
            <Auth>{children}</Auth>
            <Toaster/>
        </Providers>
        </body>
        </html>
    );
}
