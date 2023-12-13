import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { RedirectType, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/user-app/user-app-sidebar";
import UserAppHeader from "@/components/user-app/user-app-header";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ImageUploadPlaceHolder from "@/components/user-app/img-upload-placeholder";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAppImage } from "@/components/user-app/user-app-image";


export default async function UserApp() {

    let loggedIn = false;
    const supabase = createServerComponentClient({cookies});
    try {
      const { 
        data: { session }, 
      } = await supabase.auth.getSession();
      if(session) {
        loggedIn = true;            
      }

    } catch(error) {
      console.log("UseApp", error);
    } finally {
      if(!loggedIn) redirect("/", RedirectType.replace);
    }

    const {data: restoredImages, error} = await supabase.storage.from(process.env.
            NEXT_PUBLIC_SUPABASE__APP_BUCKET_IMAGE_FOLDER).
            list(process.env.NEXT_PUBLIC_SUPABASE__APP_BUCKET_IMAGE_FOLDER_RESTORED, {
                limit: 10,
                offset: 0,
                sortBy: { column: "name", order: "asc"},
            });
    const {data: {publicUrl} } = await supabase.storage
            .from(process.env.NEXT_PUBLIC_SUPABASE__APP_BUCKET_IMAGE_FOLDER)
            .getPublicUrl(process.env.NEXT_PUBLIC_SUPABASE__APP_BUCKET_IMAGE_FOLDER_RESTORED)

    return (
        <>          
            <div className="md:block">
                <UserAppHeader />
                <div className="border-t">
                <div className="bg-background">
                    <div className="grid md:grid-cols-5">
                    <Sidebar  className="hidden md:block"/>
                    <div className="col-span-3 md:col-span-4 md:border-l">
                        <div className="h-full px-4 py-6 md:px-8">
                        <Tabs defaultValue="photos" className="h-full space-y-6">
                            <div className="space-between flex items-center">
                            <TabsList>
                                <TabsTrigger value="photos" className="relative">
                                Photos
                                </TabsTrigger>
                                <TabsTrigger value="documents">Documents</TabsTrigger>
                                <TabsTrigger value="other" disabled>
                                Other
                                </TabsTrigger>
                            </TabsList>
                            <div className="ml-auto mr-4">
                                <Button>
                                <PlusCircleIcon className="mr-2 h-4 w-4" />
                                Add Collection
                                </Button>
                            </div>
                            </div>
                            <TabsContent
                            value="photos"
                            className="border-none p-0 outline-none"
                            >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                <h2 className="text-2xl font-semibold tracking-tight">
                                    Photo Collection
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    The photos you already enhanced
                                </p>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex flex-col items-center
                            justify-center space-y-2">
                                <ImageUploadPlaceHolder />
                                <ScrollArea>
                                <div className="grid grid-cols-1 
                                    sm:grid-cols-2 
                                    md:grid-cols-3
                                    lg:grid-cols-4
                                    gap-4
                                    justify-evenly
                                    p-4">
                                    {
                                        restoredImages?.map((restoredImage) => (
                                        <UserAppImage
                                            key={restoredImage.name}
                                            image={restoredImage}
                                            publicUrl={publicUrl}
                                            className="w-[250px]"
                                            aspectRatio="square"
                                            width={250}
                                            height={330}
                                        />
                                        ))
                                    }
                                </div>                               
                                </ScrollArea>
                            </div>
                            
                            <Separator className="my-4" />                            
                            </TabsContent>
                            <TabsContent
                            value="documents"
                            className="h-full flex-col border-none p-0 data-[state=active]:flex"
                            >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                <h2 className="text-2xl font-semibold tracking-tight">
                                    New Episodes
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Your favorite podcasts. Updated daily.
                                </p>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            {/* <PodcastEmptyPlaceholder /> */}
                            </TabsContent>
                        </Tabs>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}