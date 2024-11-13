import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {}

const LandingPageNavBar = (props: Props) => {
    return(
        <div className="flex w-full justify-between items-center">
            <div className="text-3xl font-semibold flex items-center gap-x-3">
                <Menu className="w-6 h-6" />
                <Image
                    alt="Logo"
                    src={"/vercel.svg"}
                    width={40}
                    height={40}
                />
            </div>
            <div className="hidden gap-x-10 items-center lg:flex">
                <Link className="bg-[$732800] py-2 px-5 font-semibold text-lg rounded-full hover:bg-[#732800]/88" href={"/"} >Home</Link>
                <Link href={"/"}>Pricing</Link>
                <Link href={"/"}>Contact</Link>
            </div>
            <Link href={"/auth/sign-in"}>
                <Button className="text-base flex gap-x-2">
                   <User fill="#888" />
                    Login
                </Button>
            </Link>
        </div>
    )
}

export default LandingPageNavBar