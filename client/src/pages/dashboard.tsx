import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { ProgressOverview } from "@/components/progress-overview";
import { DashboardData } from "@/types";
import { Link } from "wouter";
import { BookOpen, Code, Trophy, TrendingUp } from "lucide-react";

// Helper function to extract clean description for dashboard preview
function getCleanDescription(description: string): string {
  const lines = description.split('\n');
  
  // Find the "What You're Building:" line and return the next non-empty line
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("What You're Building:")) {
      for (let j = i + 1; j < lines.length; j++) {
        const cleanLine = lines[j].trim();
        if (cleanLine && !cleanLine.startsWith('**') && !cleanLine.startsWith('-')) {
          // Extract just the first sentence
          const firstSentence = cleanLine.split('.')[0];
          return firstSentence.length > 60 ? firstSentence.slice(0, 60) + '...' : firstSentence + '.';
        }
      }
    }
  }
  
  return "Continue with your next coding challenge";
}

export default function Dashboard() {
  // Mock user ID - in a real app, this would come from authentication
  const userId = 1;

  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: [`/api/dashboard/${userId}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-4">Welcome to PyLearn!</h1>
            <p className="text-gray-600 mb-4">Let's get you started on your Python learning journey.</p>
            <Button className="w-full">Create Account</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        sections={dashboardData.sections}
        currentProblemId={dashboardData.current_problem?.id}
        stats={dashboardData.stats}
        achievements={dashboardData.recent_achievements}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {dashboardData.user.username}!
              </h1>
              <p className="text-gray-600">Ready to continue your Python journey?</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm text-gray-500">Problems Solved</div>
                <div className="text-lg font-bold text-green-600">{dashboardData.stats.problems_solved}/60</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total XP</div>
                <div className="text-lg font-bold text-blue-600">{dashboardData.stats.total_xp}</div>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {dashboardData.user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(dashboardData.stats.progress_percentage)}%</div>
                  <p className="text-xs text-muted-foreground">Overall completion</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
                  <Code className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.stats.problems_solved}</div>
                  <p className="text-xs text-muted-foreground">Total completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">{dashboardData.stats.current_streak}</div>
                  <p className="text-xs text-muted-foreground">Days in a row</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total XP</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{dashboardData.stats.total_xp}</div>
                  <p className="text-xs text-muted-foreground">Experience points</p>
                </CardContent>
              </Card>
            </div>

            {/* Continue Learning */}
            {dashboardData.current_problem && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Continue Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{dashboardData.current_problem.title}</h3>
                      <p className="text-gray-600">{getCleanDescription(dashboardData.current_problem.description)}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {dashboardData.current_problem.difficulty}
                        </span>
                        <span className="text-sm text-gray-500">
                          +{dashboardData.current_problem.xp_reward} XP
                        </span>
                      </div>
                    </div>
                    <Link href={`/problem/${dashboardData.current_problem.id}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Start Problem
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Achievements */}
            {dashboardData.recent_achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardData.recent_achievements.slice(0, 6).map((achievement, index) => (
                      <div key={index} className="flex items-center p-3 bg-amber-50 rounded-lg">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                          <Trophy className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium text-amber-900">{achievement.title}</div>
                          <div className="text-xs text-amber-700">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
