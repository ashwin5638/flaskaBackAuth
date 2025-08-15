"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Phone } from "lucide-react";

interface HomeProps {
  phoneNumber: string;
  selfieImage: string;
}

export default function Home({ phoneNumber, selfieImage }: HomeProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 p-4">
        <CheckCircle className="h-16 w-16 text-green-500"/>
        <div className="space-y-2">
            <h2 className="text-2xl font-bold">Authentication Complete!</h2>
            <p className="text-muted-foreground">You have successfully logged in.</p>
        </div>
      
        <div className="flex items-center space-x-4 bg-muted p-4 rounded-lg">
            <Avatar className="h-20 w-20 border-4 border-primary">
                <AvatarImage src={selfieImage} alt="User selfie" />
                <AvatarFallback>YOU</AvatarFallback>
            </Avatar>
            <div className="text-left">
                <p className="font-semibold text-lg">Welcome!</p>
                <div className="flex items-center text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{phoneNumber}</span>
                </div>
            </div>
        </div>
    </div>
  );
}
