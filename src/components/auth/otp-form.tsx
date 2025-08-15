"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { OTPSchema } from "@/lib/schemas";
import { verifyOtp } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

interface OtpFormProps {
  onSuccess: () => void;
  phoneNumber: string;
}

export default function OtpForm({ onSuccess, phoneNumber }: OtpFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof OTPSchema>>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (values: z.infer<typeof OTPSchema>) => {
    startTransition(async () => {
      const result = await verifyOtp(values);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        onSuccess();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <p className="text-center text-muted-foreground text-sm">
            Enter the 6-digit code sent to {phoneNumber}. For this demo, the OTP is 123456.
        </p>
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                 <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    {...field} 
                    placeholder="123456" 
                    type="text" 
                    maxLength={6}
                    className="pl-10 text-center tracking-[1.5em]"
                    disabled={isPending}
                  />
                 </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending} variant="default">
          {isPending ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>
    </Form>
  );
}
