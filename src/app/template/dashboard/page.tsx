'use client'
import Navbar from "@/components/Navbar2";
import { supabaseClient } from "@/utils/supabaseClient";
import { useAuth, useSession } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DiMongodb } from "react-icons/di";
import { SiGooglegemini, SiSupabase, SiClerk, SiHuggingface } from "react-icons/si";
import { PiOpenAiLogo } from "react-icons/pi";
import { FaEye, FaEyeSlash, FaCopy } from "react-icons/fa";
import { BsFillEyeFill } from "react-icons/bs";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SecureItem {
  id: number;
  created_at: string;
  user_id: string;
  key: string | null;
  api_name: string | null;
  second_key: string | null;
}

function getIconForAPI(apiName: string) {
  const lowerCaseApiName = apiName.toLowerCase();
  if (lowerCaseApiName.includes('mongodb')) return <DiMongodb size={30} />;
  if (lowerCaseApiName.includes('gemini')) return <SiGooglegemini size={30} />;
  if (lowerCaseApiName.includes('openai')) return <PiOpenAiLogo size={30} />;
  if (lowerCaseApiName.includes('supabase')) return <SiSupabase size={30} />;
  if (lowerCaseApiName.includes('clerk')) return <SiClerk size={30} />;
  if (lowerCaseApiName.includes('huggingface')) return <SiHuggingface size={30} />;
  return apiName.charAt(0).toUpperCase(); // Fallback to first letter if no icon match
}

function Dashboard() {
  const { session } = useSession();
  const { userId } = useAuth();
  const [data, setData] = useState<SecureItem[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!userId) {
      redirect('/sign-in');
    }

    async function fetchData() {
      if (session && userId) {
        const token = await session.getToken({ template: "supabase" });
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
          .from('2Secure')
          .select('*')
          .eq('user_id', userId);
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setData(data as SecureItem[]);
        }
      }
    }

    fetchData();
  }, [session, userId]);

  const groupedData = data.reduce((acc, item) => {
    const apiName = item.api_name || 'Unknown';
    if (!acc[apiName]) {
      acc[apiName] = [];
    }
    acc[apiName].push(item);
    return acc;
  }, {} as Record<string, SecureItem[]>);

  const toggleVisibility = (id: number) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optionally, you can add a toast notification here
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto mt-8 p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(groupedData).map(([apiName, items]) => (
            <Card key={apiName} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="">
                    <AvatarFallback className="bg-white flex items-center justify-center text-4xl">
                      {getIconForAPI(apiName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{apiName}</CardTitle>
                    <CardDescription>API Key</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type={visibleKeys[item.id] ? "text" : "password"}
                        value={item.key || ''}
                        readOnly
                        className="flex-grow font-mono text-sm"
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => toggleVisibility(item.id)}
                              className="w-8 h-8"
                            >
                              {visibleKeys[item.id] ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{visibleKeys[item.id] ? "Hide" : "Show"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(item.key || '')}
                              className="w-8 h-8"
                            >
                              <FaCopy className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {item.second_key && (
                      <div className="flex items-center space-x-2">
                        <Input
                          type={visibleKeys[item.id] ? "text" : "password"}
                          value={item.second_key}
                          readOnly
                          className="flex-grow font-mono text-sm"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => toggleVisibility(item.id)}
                                className="w-8 h-8"
                              >
                                {visibleKeys[item.id] ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{visibleKeys[item.id] ? "Hide" : "Show"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => copyToClipboard(item.second_key || '')}
                                className="w-8 h-8"
                              >
                                <FaCopy className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
