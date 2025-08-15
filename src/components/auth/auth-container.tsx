import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import type { ReactNode } from "react";

interface AuthContainerProps {
  title: string;
  children: ReactNode;
}

export default function AuthContainer({ title, children }: AuthContainerProps) {
  return (
    <Card className="w-full max-w-md shadow-2xl rounded-2xl">
      <CardHeader>
        <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-primary/10 p-3 rounded-full">
                <Camera className="h-8 w-8 text-primary"/>
            </div>
            <h1 className="text-2xl font-bold text-foreground">SelfieAuth</h1>
        </div>
        <CardTitle className="text-center pt-4 text-xl font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
