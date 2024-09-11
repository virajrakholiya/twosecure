'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Shield, 
  Key, 
  Database, 
  Plus, 
  UserPlus, 
  Lock, 
  Unlock,
} from "lucide-react"
import { useAuth } from "@clerk/nextjs";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/template');
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded || isSignedIn) {
    return null; // or a loading spinner
  }

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/template');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span className="font-bold">2Secure</span>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a href="#features" className="transition-colors hover:text-foreground/80">Features</a>
            <a href="#how-it-works" className="transition-colors hover:text-foreground/80">How It Works</a>
            <a href="#faq" className="transition-colors hover:text-foreground/80">FAQ</a>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-24 overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                Secure Your API Keys for Free with 2Secure
              </h1>
              <p className="text-xl sm:text-2xl mb-10 text-gray-300">
                Professional-grade API key management at zero cost
              </p>
              <SignUpButton mode="modal">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-200"
                  onClick={handleGetStarted}
                >
                  Get Started - It's Free
                </Button>
              </SignUpButton>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-24 bg-gray-50">
  <div className="container mx-auto">
    <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Key Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { icon: Lock, title: "Encrypted Storage", description: "Bank-level encryption for your API keys" },
        { icon: Key, title: "Easy Access", description: "One-click secure retrieval of your keys" },
        { icon: Database, title: "Multi-API Support", description: "Manage keys for popular APIs and custom services" },
        { icon: Plus, title: "Custom API Addition", description: "Add and secure keys for any API" }
      ].map((feature, index) => (
        <Card key={index} className="text-center p-6 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <feature.icon className="h-12 w-12 mb-4 mx-auto text-blue-500" />
            <CardTitle className="text-lg font-semibold text-gray-900">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>
        {/* How 2Secure Works Section */}
        <section id="how-it-works" className="py-24 bg-gray-900">
  <div className="container flex flex-col items-center justify-center">
    <h2 className="text-4xl font-extrabold tracking-tight text-white mb-16 text-center">How 2Secure Works</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {[
        { icon: UserPlus, title: "Sign Up", description: "Create your free account" },
        { icon: Key, title: "Add Keys", description: "Securely store your API keys" },
        { icon: Unlock, title: "Access Anytime", description: "Retrieve your keys securely" }
      ].map((step, index) => (
        <div key={index} className="flex flex-col items-center bg-gray-800 text-white p-8 rounded-xl shadow-lg transition-transform transform hover:scale-105">
          <div className="bg-white text-gray-900 rounded-full p-6 mb-6 shadow-lg transition-all duration-300 hover:bg-gray-200">
            <step.icon className="h-12 w-12 text-gray-900 transition-colors duration-300" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-center">{`Step ${index + 1}: ${step.title}`}</h3>
          <p className="text-gray-300 text-center">{step.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* FAQ Section */}
        <section id="faq" className="py-24">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {[
                  { 
                    question: "Is 2Secure really free?", 
                    answer: "Yes, 2Secure is completely free for individual users and small teams. We offer premium features for enterprise users, which helps us keep the core service free for everyone." 
                  },
                  { 
                    question: "How secure is 2Secure?", 
                    answer: "We use bank-level encryption to store your API keys. Our systems are regularly audited by third-party security experts to ensure the highest level of protection for your data." 
                  },
                  { 
                    question: "Can I use 2Secure for any API?", 
                    answer: "While we have built-in support for popular APIs, you can add and secure keys for any custom API you use." 
                  },
                  { 
                    question: "How do I retrieve my API keys?", 
                    answer: "You can securely retrieve your API keys with a single click from your 2Secure dashboard. We also provide SDKs for popular programming languages to integrate key retrieval directly into your applications." 
                  }
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">Start Securing Your API Keys Now</h2>
              <p className="text-xl mb-10 text-gray-300">No credit card required, always free</p>
              <SignUpButton mode="modal">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                  Create Your Free Account
                </Button>
              </SignUpButton>
            </div>
          </div>
        </section>
      </main>

  
    </div>
  )
}
