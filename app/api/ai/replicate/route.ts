import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { boolean } from "zod";

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
            "version": "9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
            "input": {
                "img": imageUrl,
                "scale": 2,
                "version": "v1.4"
            }
        }),
    });
    
    let jsonStartProcessResponse = await startRestoreProcess.json();
    console.log(jsonStartProcessResponse);
    
    let endpointUrl = jsonStartProcessResponse.urls.get;

    let restoredImage: string | null = null;

    
    let run = true;
    let counter = 3000;
    let jsonFinalResponse = {status: "no-start"};
    while (!restoredImage){
        if(counter == 0){
            counter = 3000;
            console.log("Pooling image from Replicate...",jsonFinalResponse.status);

            let finalResponse = await fetch(endpointUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
                },
            });            
            jsonFinalResponse = await finalResponse.json();   
            
            if(jsonFinalResponse.status === "succeeded") {
                restoredImage = jsonFinalResponse.output;        
            } else if(jsonFinalResponse.status === "failed") {
                break;      
                // TODO: Gerar erro para a interface de usuário
            } else {
                await new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                })
            }
        }
        counter -=1;     
    }

    
    return NextResponse.json({data: restoredImage ? restoredImage : "Failed to restore Image."}, {
        status: 200
    });
}