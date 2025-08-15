"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { PhoneSchema } from "@/lib/schemas";
import { sendOtp } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface PhoneFormProps {
  onSuccess: (phoneNumber: string) => void;
}

export default function PhoneForm({ onSuccess }: PhoneFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof PhoneSchema>>({
    resolver: zodResolver(PhoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = (values: z.infer<typeof PhoneSchema>) => {
    startTransition(async () => {
      const result = await sendOtp(values);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        onSuccess(values.phoneNumber);
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
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    {...field} 
                    placeholder="+919876543210" 
                    type="tel"
                    className="pl-10"
                    disabled={isPending}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending} variant="default">
          {isPending ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>
    </Form>
  );
}
