"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { DiMongodb } from "react-icons/di";
import { SiGooglegemini } from "react-icons/si";
import { PiOpenAiLogo } from "react-icons/pi";
import { SiSupabase, SiClerk, SiHuggingface } from "react-icons/si";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabaseClient } from "@/utils/supabaseClient";
import { useSession, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { TbApi } from "react-icons/tb";

function Page() {
  const [apiKey, setApiKey] = useState("");
  const [secondApiKey, setSecondApiKey] = useState(""); // State for the second API key
  const [selectedApi, setSelectedApi] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog open
  const [customApiName, setCustomApiName] = useState("");

  const { session } = useSession();
  const { userId } = useAuth();
  if (!userId) {
    redirect("/sign-in");
  }
  const data = [
    {
      id: 1,
      title: "OpenAI",
      icon: <PiOpenAiLogo size={30} />,
      api_name: "OpenAI",
    },
    {
      id: 2,
      title: "MongoDB",
      icon: <DiMongodb size={30} />,
      api_name: "MongoDB",
    },
    {
      id: 3,
      title: "Supabase",
      icon: <SiSupabase size={30} />,
      api_name: "Supabase",
    },
    { id: 4, title: "Clerk", icon: <SiClerk size={30} />, api_name: "Clerk" },
    {
      id: 5,
      title: "Gemini",
      icon: <SiGooglegemini size={30} />,
      api_name: "Gemini",
    },
    {
      id: 6,
      title: "HuggingFace",
      icon: <SiHuggingface size={30} />,
      api_name: "HuggingFace",
    },
  ];

  const customApiCard = {
    id: data.length + 1,
    title: "Custom API",
    icon: <TbApi size={30} />,
    api_name: "Custom",
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!session || !userId) {
      console.error("User not authenticated");
      return;
    }

    const token = await session.getToken({ template: "supabase" });
    const supabase = await supabaseClient(token);

    const { error } = await supabase.from("2Secure").insert({
      user_id: userId,
      key: apiKey,
      second_key:
        selectedApi === "Supabase" || selectedApi === "Clerk"
          ? secondApiKey
          : null, // Add the second API key conditionally
      api_name: selectedApi || "", // Add the selected API name
    });

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully");
      setApiKey("");
      setSecondApiKey(""); // Reset the second API key
      setSelectedApi(null); // Reset selected API
      setIsDialogOpen(false); // Close the dialog on successful submission
    }
  };

  const handleCustomApiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session || !userId) {
      console.error("User not authenticated");
      return;
    }

    const token = await session.getToken({ template: "supabase" });
    const supabase = await supabaseClient(token);

    const { error } = await supabase.from("2Secure").insert({
      user_id: userId,
      key: apiKey,
      second_key: secondApiKey,
      api_name: customApiName,
    });

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Custom API data inserted successfully");
      setApiKey("");
      setSecondApiKey("");
      setCustomApiName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="min-h-full">
      <Navbar />
      <div className="px-5">
        <h1 className="text-2xl font-medium mt-3">Explore Templates</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
          {data.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback style={{ width: "100px", height: "100px" }}>
                      {item.icon}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>API Key</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardFooter>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      variant="default"
                      onClick={() => {
                        setSelectedApi(item.api_name);
                        setIsDialogOpen(true); // Open the dialog
                      }}
                    >
                      Add Your API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add API Key</DialogTitle>
                      <DialogDescription>
                        Enter your API key
                        {selectedApi === "Supabase" || selectedApi === "Clerk"
                          ? "keys"
                          : "key"}{" "}
                        below:
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API Key"
                        className="w-full border border-gray-300 rounded p-2"
                        required
                      />
                      {(selectedApi === "Supabase" ||
                        selectedApi === "Clerk") && (
                        <input
                          type="text"
                          value={secondApiKey}
                          onChange={(e) => setSecondApiKey(e.target.value)}
                          placeholder="Enter your Secret Key"
                          className="w-full border border-gray-300 rounded p-2"
                          required
                        />
                      )}
                      <Button
                        type="submit"
                        variant="default"
                        className="w-full"
                      >
                        Submit
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
          
          {/* Custom API Card */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback style={{ width: "100px", height: "100px" }}>
                    {customApiCard.icon}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{customApiCard.title}</CardTitle>
                  <CardDescription>Add Custom API Key</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardFooter>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    variant="default"
                    onClick={() => {
                      setSelectedApi(customApiCard.api_name);
                      setIsDialogOpen(true);
                    }}
                  >
                    Add Custom API Key
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Custom API Key</DialogTitle>
                    <DialogDescription>
                      Enter your custom API details below:
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCustomApiSubmit} className="space-y-4">
                    <input
                      type="text"
                      value={customApiName}
                      onChange={(e) => setCustomApiName(e.target.value)}
                      placeholder="Enter API Name"
                      className="w-full border border-gray-300 rounded p-2"
                      required
                    />
                    <input
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter API Key"
                      className="w-full border border-gray-300 rounded p-2"
                      required
                    />
                    <input
                      type="text"
                      value={secondApiKey}
                      onChange={(e) => setSecondApiKey(e.target.value)}
                      placeholder="Enter Secret Key (optional)"
                      className="w-full border border-gray-300 rounded p-2"
                    />
                    <Button
                      type="submit"
                      variant="default"
                      className="w-full"
                    >
                      Submit
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Page;
