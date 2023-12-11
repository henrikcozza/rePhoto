"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Form, 
    FormControl, 
    FormDescription, 
    FormField, 
    FormItem, 
    FormLabel,
    FormMessage, 
} from "@/components/ui/form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z.string({
            required_error: "Email is required."
        }).email({
            message: "Must be a valid email."
        }),
    password: z.string({
            required_error: "Password is required."
        }).min(7, {
            message: "Password must have at least 7 characters"
        }).max(12),
    confirm: z.string({
            required_error: "Confirm password is required."
        })
}).refine( (data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
});

export function CreateAccountForm() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirm: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const supabase = createClientComponentClient();
            const { email, password, confirm } = values;         
        
            const { error,
            data: {user},
            } = await supabase.auth.signUp({
                email,
                password,
                // disabled email verification
                // options: {
                    //     emailRedirectTo: `${location.origin}/auth/callback`,
                    // },
                });
                
            if(user) {
                form.reset();
                // disabled email verification
                // router.push("/");
                router.refresh();
            }
            
        } catch(error) {
            console.log("CreateAccountForm", error);
        }
    };

    return (
        <main className="flex flex-col justify-center
        items-center space-y-2">
            <span className="text-lg">You will love it.</span>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col space-y-2"
                >
                    <FormField 
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="E-mail"
                                        {...field}
                                        />
                                </FormControl>
                                <FormDescription>This is your E-mail</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="password"
                                        {...field}
                                        />
                                </FormControl>
                                <FormDescription>This is your Password</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name="confirm"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Retry Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="confirm password"
                                        {...field}
                                        />
                                </FormControl>
                                <FormDescription>This is your Password</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* criar campo de validação dupla da senha aqui */}
                    <Button type="submit">Create Account</Button>
                </form>
            </Form>   
        </main>
    );
}