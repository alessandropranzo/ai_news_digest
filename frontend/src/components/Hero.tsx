import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Atom,
  Layers,
  TrendingUp,
  Star,
  Network,
  Book,
  Strikethrough,
  Check,
  AlertCircle,
  FileSignature,
  CircuitBoard,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
const Hero = () => {
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [api, setApi] = useState<any>(null);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const topics = [
    {
      title: "Grid Connection Optimization",
      icon: <Network className="w-8 h-8 text-emerald-400" />,
      color: "from-emerald-400 to-chloris-blue",
    },
    {
      title: "Regulatory Compliance",
      icon: <Book className="w-8 h-8 text-emerald-500" />,
      color: "from-emerald-500 to-chloris-blue",
    },
    {
      title: "Revenue Streams Modelling",
      icon: <TrendingUp className="w-8 h-8 text-chloris-blue" />,
      color: "from-chloris-blue to-emerald-400",
    },
    {
      title: "PPAs Estimation & Matchmaking",
      icon: <FileSignature className="w-8 h-8 text-chloris-blue" />,
      color: "from-chloris-blue to-emerald-400",
    },
    {
      title: "CAD & SLD Automation",
      icon: <CircuitBoard className="w-8 h-8 text-chloris-blue" />,
      color: "from-chloris-blue to-emerald-400",
    },
  ];

  // Set up the automatic carousel rotation
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [api]);

  // Topic progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          setActiveTopicIndex((prev) => (prev + 1) % topics.length);
          return 0;
        }
        return prevProgress + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [topics.length]);

  // Handle email submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("subscribers").insert([
        {
          email: email.trim(),
        },
      ]);
      if (error) {
        if (error.code === "23505") {
          // Unique violation error code
          toast.info("You're already subscribed. Thank you!");
        } else {
          console.error("Error submitting email:", error);
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.success("Thank you for subscribing!", {
          description: "We'll keep you updated on our latest developments.",
        });
        setEmail("");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // List of industry partners with assigned colors
  const industryPartners = [
    {
      name: "Project Developers",
      color: "from-purple-500 to-blue-500",
    },
    {
      name: "EPCs",
      color: "from-emerald-400 to-teal-500",
    },
    {
      name: "O&Ms",
      color: "from-amber-500 to-orange-500",
    },
    {
      name: "IPPs",
      color: "from-blue-500 to-cyan-400",
    },
    {
      name: "Utilities",
      color: "from-rose-500 to-pink-500",
    },
    {
      name: "Traders",
      color: "from-lime-400 to-green-500",
    },
    {
      name: "Investors",
      color: "from-violet-500 to-indigo-400",
    },
  ];
  const togglePartner = (partner: string) => {
    setSelectedPartners((prev) =>
      prev.includes(partner)
        ? prev.filter((p) => p !== partner)
        : [...prev, partner]
    );
  };
  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center py-16">
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-1/4 -right-20 w-80 h-80 bg-chloris-blue/5 rounded-full blur-3xl animate-pulse-slow"
            style={{
              animationDelay: "2s",
            }}
          ></div>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold mb-4 text-gradient animate-fade-in">
          Chloris
        </h1>

        <p
          style={{
            animationDelay: "0.2s",
          }}
          className="text-xl text-foreground/80 mb-6 max-w-xl text-center animate-fade-in md:text-xl"
        >
          Solving problems in Utility-scale Renewables with AI
        </p>

        {/* Email and Book Call section */}
        <div
          className="w-full max-w-4xl mb-12 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              placeholder="Enter your email and..."
              className="flex-1 h-12 min-h-[3rem] px-4 rounded-full bg-muted/50 border border-border/50 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 sm:h-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-emerald-600 to-chloris-blue text-white h-12 px-8 rounded-full hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105 relative overflow-hidden hover:animate-happy-shake active:animate-happy-shake"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">Saving...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">Stay Updated</span>
              )}
            </Button>
          </form>
          {/* Responsive 'or' separator */}
          <div className="flex flex-row sm:flex-col items-center justify-center">
            <span className="mx-2 my-0.5 text-sm text-foreground/60 font-medium select-none">
              or
            </span>
          </div>
          <Button
            variant="outline"
            className="border-emerald-500/30 text-foreground h-12 px-8 rounded-full hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-300 hover:animate-phone-ring active:animate-phone-ring"
            onClick={() =>
              window.open(
                "https://cal.com/alessandrorossi/chloris-intro",
                "_blank"
              )
            }
          >
            Book a Call
          </Button>
        </div>

        <div
          className="mb-12 w-full max-w-3xl animate-fade-in"
          style={{
            animationDelay: "0.6s",
          }}
        >
          <p className="text-lg text-foreground/70 mb-4 text-center">
            Currently exploring topics like:
          </p>

          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent>
              {topics.map((topic, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="border border-border/30 bg-muted/10 backdrop-blur-sm overflow-hidden group hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-500">
                      <CardContent className="flex flex-col items-center justify-center p-6 h-40">
                        <div className="mb-3 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                          {topic.icon}
                        </div>
                        <h3
                          className={`bg-gradient-to-r ${topic.color} bg-clip-text text-transparent font-semibold text-lg text-center`}
                        >
                          {topic.title}
                        </h3>
                        <div className="w-full mt-4">
                          <div className="w-16 h-1 mx-auto rounded-full bg-gradient-to-r from-emerald-500/40 to-chloris-blue/40 group-hover:w-24 transition-all duration-500"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-4">
              <CarouselPrevious className="relative static left-0 right-auto translate-y-0 bg-muted/20 border-border/40 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-colors duration-300" />
              <CarouselNext className="relative static left-0 right-auto translate-y-0 bg-muted/20 border-border/40 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-colors duration-300" />
            </div>
          </Carousel>
        </div>

        {/* Enhanced Industry Partners Section */}
        <div
          className="w-full max-w-4xl mb-8 animate-fade-in"
          style={{
            animationDelay: "0.8s",
          }}
        >
          <h3 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-chloris-blue bg-clip-text text-transparent mb-6 animate-fade-in">
            Interested in talking with
          </h3>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {industryPartners.map((partner, index) => (
              <button
                key={index}
                className={`
                  relative overflow-hidden group transition-all duration-300 transform hover:scale-105
                  rounded-full px-5 py-2.5 outline-none 
                  ${
                    selectedPartners.includes(partner.name)
                      ? `bg-gradient-to-r ${partner.color} text-white shadow-lg`
                      : "bg-muted/30 backdrop-blur border border-border/50 hover:border-emerald-500/30 text-foreground/80"
                  }
                `}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
                onClick={() => togglePartner(partner.name)}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {partner.name}
                  {selectedPartners.includes(partner.name) && (
                    <Star
                      className="inline-block w-3.5 h-3.5 text-yellow-300 animate-fade-in"
                      fill="currentColor"
                    />
                  )}
                </span>

                {/* Animated background and border effects */}
                {!selectedPartners.includes(partner.name) && (
                  <span className="absolute inset-0 border border-transparent group-hover:border-emerald-500/30 rounded-full transition-all duration-500"></span>
                )}

                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-400/40 to-chloris-blue/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              </button>
            ))}
          </div>

          <p className="text-lg bg-gradient-to-r from-emerald-400/90 to-chloris-blue/90 bg-clip-text text-transparent animate-fade-in">
            in the Renewable Energy industry
          </p>
        </div>
      </div>
    </section>
  );
};
export default Hero;
