"use client"

import Image from "next/image";
import { UserNav  } from "../common/user-nav";

export default function UserAppHeader() {
    return (
        <header>
            <nav className="flex justify-between items-center m-4">
                <div className="flex justify-between items-center">
                    <Image
                        src={"/assets/images/rephotoLogo.png"}
                        alt="logotype"
                        width={35}
                        height={35}
                        ></Image>
                    <span className="font-extrabold">
                        re
                        <span className="font-extralight">Photo</span>
                    </span>
                </div>
                <UserNav />
            </nav>
        </header>
    );
}