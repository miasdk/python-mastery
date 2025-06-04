import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Zap, Trophy, Target, BookOpen, Briefcase } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    // Simulate immediate login for demo purposes
    window.location.href = "/api/auth/demo-login";
  };

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Interactive Code Editor",
      description: "Write and test Python code with our advanced Monaco editor"
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Business-Focused Problems",
      description: "Learn through real-world scenarios from actual workplace needs"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Progressive Difficulty",
      description: "Master concepts step-by-step from beginner to professional level"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "XP & Achievements",
      description: "Track your progress and earn rewards as you advance"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Comprehensive Curriculum",
      description: "8 sections covering everything from basics to advanced applications"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Feedback",
      description: "Get immediate results and detailed explanations for your code"
    }
  ];

  const sections = [
    "Python Foundations",
    "Control Flow Mastery", 
    "Functions & Modularity",
    "Data Structures & Algorithms",
    "File Operations & Data Persistence",
    "Error Handling & Debugging",
    "Object-Oriented Programming",
    "Real-World Applications"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Master Python for Professional Development
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Learn Python through real-world business applications. Build practical skills 
            with interactive coding challenges designed for workplace readiness.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Start Learning Python
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Badge variant="secondary">Free Demo Available</Badge>
              <span>•</span>
              <span>No Credit Card Required</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Curriculum Overview */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Complete Python Curriculum</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sections.map((section, index) => (
              <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-sm font-medium text-blue-600 mb-1">
                  Section {index + 1}
                </div>
                <div className="text-sm text-gray-800 font-medium">
                  {section}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-blue-600 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Become a Python Professional?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who have advanced their careers with our proven curriculum
          </p>
          <Button 
            onClick={handleLogin}
            size="lg" 
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
          >
            Begin Your Python Journey
          </Button>
        </div>
      </div>
    </div>
  );
}