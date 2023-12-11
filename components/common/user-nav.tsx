"use client"
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LinkProps } from "next/link";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar";
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  

  export function UserNav() {

    const [user, setUser] = useState<User | null>();
    const supabase = createClientComponentClient();
    const router = useRouter();

    const getUser = async () => {
        const { 
            error, 
            data: {user}
        } = await supabase.auth.getUser();
        
        if(error) {
            console.log("UserNav.getUser:", error);            
        }else {
            setUser(user);
        }
    }

    useEffect( () => {
        getUser();
    });

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    }

    return (
        <>
            {user && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/avatar1.png" alt="user avatar" />
                        <AvatarFallback>RS</AvatarFallback>
                        </Avatar>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.email?.split("@")[0]}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            Profile
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                        Log out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>)
            }
        </>
    );
  }