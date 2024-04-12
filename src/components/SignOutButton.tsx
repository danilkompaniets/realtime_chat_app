"use client";

import { ButtonHTMLAttributes, FC, useState } from "react";
import Button from "./ui/Button";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { FiLogOut } from "react-icons/fi";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      toast.error("An error occurred during sign out.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Button
      {...props}
      variant="ghost"
      onClick={handleSignOut}
      disabled={isSigningOut} // Disable button while signing out
    >
      {isSigningOut ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <FiLogOut className="w-4 h-4" />
      )}
    </Button>
  );
};

export default SignOutButton;
