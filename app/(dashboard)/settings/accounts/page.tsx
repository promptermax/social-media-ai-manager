import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Facebook, Twitter, Linkedin } from "lucide-react";

const platforms = [
  {
    name: "Facebook",
    icon: Facebook,
    provider: "facebook",
    enabled: false, // TODO: Set to true when OAuth is configured
  },
  {
    name: "Twitter",
    icon: Twitter,
    provider: "twitter",
    enabled: false, // TODO: Set to true when OAuth is configured
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    provider: "linkedin",
    enabled: false, // TODO: Set to true when OAuth is configured
  },
];

export default function AccountsPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Connect Social Accounts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {platforms.map((platform) => (
          <Card key={platform.name} className="rounded-xl border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <platform.icon className="h-6 w-6 text-blue-600" />
                {platform.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        className="w-full"
                        disabled={!platform.enabled}
                        onClick={() => {
                          // TODO: Implement signIn(provider) when enabled
                        }}
                      >
                        Connect
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!platform.enabled && (
                    <TooltipContent>
                      <span>OAuth not yet configured. Ask a developer to enable this platform.</span>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 