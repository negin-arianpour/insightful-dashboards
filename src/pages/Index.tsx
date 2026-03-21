import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, MessageSquare, Upload, Zap, ArrowRight, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Drop your data",
    description: "Upload CSV, Excel, or JSON files. We parse and understand your business metrics instantly.",
  },
  {
    icon: BarChart3,
    title: "Auto-generated dashboards",
    description: "AI analyzes your data structure and builds relevant charts, KPIs, and trend visualizations.",
  },
  {
    icon: MessageSquare,
    title: "Ask anything",
    description: "Chat with your dashboard. Ask questions in plain English and get visual answers in real-time.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg tracking-tight">DataLens</span>
        </div>
        <Link to="/dashboard">
          <Button variant="hero" size="lg">
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-28 max-w-4xl mx-auto text-center">
        <div className="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 text-primary text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Business Intelligence
          </div>
        </div>
        <h1 className="fade-up fade-up-delay-1 text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] mb-5">
          Turn raw data into
          <br />
          actionable dashboards
        </h1>
        <p className="fade-up fade-up-delay-2 text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your business data and let AI create beautiful, interactive dashboards. Then ask questions in plain English to uncover insights.
        </p>
        <div className="fade-up fade-up-delay-3 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard">
            <Button variant="hero" size="lg" className="text-base px-8 h-12">
              Upload your data <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-base px-8 h-12">
            See a demo
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-32 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`fade-up fade-up-delay-${i + 1} bg-card rounded-xl p-7 card-hover border border-border/60`}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-[0.935rem]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>DataLens © 2026</span>
          <span>Built with AI</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
