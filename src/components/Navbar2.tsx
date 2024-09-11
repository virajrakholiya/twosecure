import { UserButton } from "@clerk/nextjs";
import React from "react";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import Link from "next/link";

function Navbar() {
  return (
    <div
      className="flex justify-between bg-black p-2 px-5 items-center "
    >
      <h1 className="text-2xl font-bold text-white">2Secure</h1>
      <div className="flex items-center gap-5">
       <Link href={'/template'}><Button variant={"secondary"}>Template</Button></Link> 
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                height: "2.5rem",
                width: "2.5rem",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Navbar;
