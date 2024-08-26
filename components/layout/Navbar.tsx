"use client";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "../ui/button";
import SearchBar from "../SearchBar";
import { ModeToggle } from "../theme-toggler";
import { NavMenu } from "./NavMenu";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { userId} = useAuth()
  const router = useRouter();
  return (
    <div className="flex justify-between items-center px-3 py-3 md:px-8 md:py-5 border border-secondary">
      <div className="flex items-center cursor-pointer" onClick={()=>router.push("/")}>
        <Image src="/logo.svg" height={30} width={30} alt="Hotel hub logo" />
        <h3 className="text-lg font-semibold">HotelHub</h3>
      </div>
      <SearchBar />
      <div className="flex items-center gap-3 ">
        <div className="flex items-center gap-1">
          <ModeToggle />
          <NavMenu />
        </div>
        {userId ? (
          <UserButton />
        ) : (
          <>
            <SignInButton>
              <Button variant="secondary">Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button>Sign Up</Button>
            </SignUpButton>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
