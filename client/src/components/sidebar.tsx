import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock, Circle, Trophy, Star, Medal } from "lucide-react";
import { Section, Achievement } from "@/types";
import { Link, useLocation } from "wouter";

interface SidebarProps {
  sections: Section[];
  currentProblemId?: number;
  stats: {
    progress_percentage: number;
    problems_solved: number;
    current_streak: number;
    total_xp: number;
  };
  achievements: Achievement[];
}

export function Sidebar({ sections, currentProblemId, stats, achievements }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-code text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">PyLearn</h1>
            <p className="text-sm text-gray-500">Interactive Python Learning</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-blue-600 font-semibold">
            {Math.round(stats.progress_percentage)}%
          </span>
        </div>
        <Progress value={stats.progress_percentage} className="mb-4 transition-all duration-700 ease-out" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{stats.problems_solved}</div>
            <div className="text-xs text-gray-500">Problems Solved</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-600">{stats.current_streak}</div>
            <div className="text-xs text-gray-500">Day Streak</div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="mt-4">
          <div className="text-xs font-medium text-gray-700 mb-2">Recent Achievements</div>
          <div className="flex space-x-2">
            {achievements.slice(0, 3).map((achievement, index) => (
              <div
                key={index}
                className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center"
                title={achievement.title}
              >
                {achievement.icon === "fas fa-trophy" && <Trophy className="w-4 h-4 text-amber-600" />}
                {achievement.icon === "fas fa-star" && <Star className="w-4 h-4 text-emerald-600" />}
                {achievement.icon === "fas fa-medal" && <Medal className="w-4 h-4 text-blue-600" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Path Navigator */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Learning Path</h3>
          
          <div className="space-y-4">
            {sections.map((section) => {
              const isCurrentSection = section.lessons.some(lesson => 
                lesson.problems.some(problem => problem.id === currentProblemId)
              );
              const isCompleted = section.completed_lessons === section.total_lessons && section.total_lessons > 0;
              
              return (
                <Card
                  key={section.id}
                  className={`p-4 ${
                    isCompleted
                      ? "bg-emerald-50 border-emerald-200"
                      : isCurrentSection
                      ? "bg-blue-50 border-2 border-blue-300"
                      : section.is_locked
                      ? "bg-gray-50 border-gray-200 opacity-60"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-medium ${
                      isCompleted ? "text-emerald-900" : isCurrentSection ? "text-blue-900" : "text-gray-700"
                    }`}>
                      {section.order_index}. {section.title}
                    </h4>
                    {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                    {section.is_locked && <Lock className="w-5 h-5 text-gray-400" />}
                    {!isCompleted && !section.is_locked && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{section.order_index}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {section.lessons.map((lesson) => {
                      const lessonCompleted = lesson.completed_problems === lesson.total_problems && lesson.total_problems > 0;
                      const hasCurrentProblem = lesson.problems.some(p => p.id === currentProblemId);
                      
                      return (
                        <div key={lesson.id} className="flex items-center text-sm">
                          {lessonCompleted ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                          ) : hasCurrentProblem ? (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                          ) : lesson.is_locked ? (
                            <Lock className="w-4 h-4 text-gray-400 mr-2" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300 mr-2" />
                          )}
                          
                          <span className={
                            lessonCompleted ? "text-emerald-700" :
                            hasCurrentProblem ? "text-blue-900 font-medium" :
                            lesson.is_locked ? "text-gray-500" :
                            "text-gray-700"
                          }>
                            {lesson.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {isCurrentSection && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-blue-700 mb-1">
                        <span>Progress</span>
                        <span>{section.completed_lessons}/{section.total_lessons} lessons</span>
                      </div>
                      <Progress 
                        value={section.total_lessons > 0 ? (section.completed_lessons / section.total_lessons) * 100 : 0} 
                        className="h-1.5"
                      />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
