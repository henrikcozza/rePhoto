import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";


export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    try {
        if(code){
            const supabase = createRouteHandlerClient({ cookies });
            await supabase.auth.exchangeCodeForSession(code)
        }
    } catch(error) {
        console.log("Auth_Callback", error);        
    }

    return NextResponse.redirect(requestUrl.origin)
}