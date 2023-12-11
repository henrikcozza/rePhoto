import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { RedirectType, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CreateAccountForm } from "@/components/auth/Create-account-form"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { LoginAccountForm } from "@/components/auth/Login-account-form";
 

export default async function Home() {
  let loggedIn = false;
  try {
    const supabase = createServerComponentClient({cookies});
    const { 
      data: { session }, 
    } = await supabase.auth.getSession();
    if(session) loggedIn = true;
  } catch(error) {
    console.log("Home", error);
  } finally {
    if(loggedIn) redirect("/user-app", RedirectType.replace);
  }
  return (
    <main className="flex flex-col h-screen w-full justify-center items-center">
      <Tabs 
        defaultValue="create-account" 
        className="w-[400px] border rounded-md pb-4 shadow-2xl"
      >
        <TabsList className="flex justify-around items-center rounded-b-none h-14">
          <TabsTrigger value="create-account" 
            className=" transiction-all uppercase delay-150">Sign Up</TabsTrigger>
          <TabsTrigger value="login"
            className=" transiction-all uppercase delay-150">Sign In</TabsTrigger>
        </TabsList>
        <TabsContent value="create-account">
          <CreateAccountForm />
        </TabsContent>
        <TabsContent value="login">
          <LoginAccountForm />
        </TabsContent>
      </Tabs>
    </main> 
  );
}
