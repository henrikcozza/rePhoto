import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

interface NextRequestWithImage extends NextRequest {
    imageUrl: string,
}

export async function POST(req: NextRequestWithImage, res: NextResponse){

    const { imageUrl } = await req.json();
    const supabase = createRouteHandlerClient({cookies});
    const {data: {session},
            error} = await supabase.auth.getSession();

    if(!session || error) new NextResponse("Login in order to restore image", {
        status: 500,
    });    
    
    const startRestoreProcess = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + process.env.REPLICATE_API_TOKEN,
        },
        body: JSON.stringify({
            version:
            "c75db81db6cbd809d93cc3b7e7a088a351a3349c9fa02b6d393e35e0d51ba799",
            input: {
                HR: false,
                image: imageUrl,
                with_scratch: true,
            }
        }),
    });

    let jsonStartProcessResponse = await startRestoreProcess.json();
    console.log(jsonStartProcessResponse);
    
    let endpointUrl = jsonStartProcessResponse.urls.get;

    let restoredImage: string | null = null;

    let intervalo = setInterval( async () => {
        console.log("Pooling image from Replicate...");
        let finalResponse = await fetch(endpointUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
            },
        });

        let jsonFinalResponse = await finalResponse.json();

        if(jsonFinalResponse.status === "succeeded") {
            restoredImage = jsonFinalResponse.output;
        } else if(jsonFinalResponse.status === "failed") {
            clearInterval(intervalo); 
            // TODO: Gerar erro para a interface de usuario
        } else {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
        }
    }, 3000);    

    return NextResponse.json({data: restoredImage ? restoredImage : "Failed to restore Image."}, {
        status: 200
    });
}