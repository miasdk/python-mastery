import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Lock, 
  Circle, 
  Trophy, 
  Star, 
  Medal,
  ChevronLeft, 
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Flame,
  Zap,
  BookOpen,
  Award
} from "lucide-react";
import { SiPython } from "react-icons/si"; // Official Python logo
import { Section, Achievement } from "@/types";
import { Link, useLocation } from "wouter";
import { calculateLevel } from "@/lib/level-system";
import { cn } from "@/lib/utils";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const levelInfo = calculateLevel(stats.total_xp);

  // Get achievement icons - preserve your existing logic
  const getAchievementIcon = (iconClass: string) => {
    if (iconClass === "fas fa-trophy") return <Trophy className="w-4 h-4 text-amber-600" />;
    if (iconClass === "fas fa-star") return <Star className="w-4 h-4 text-emerald-600" />;
    if (iconClass === "fas fa-medal") return <Medal className="w-4 h-4 text-blue-600" />;
    return <Trophy className="w-4 h-4 text-amber-600" />; // fallback
  };

  if (isCollapsed) {
    return (
      <div className="w-14 bg-white shadow-lg border-r border-gray-200 flex flex-col items-center py-6 space-y-6">
        {/* Expand Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="w-8 h-8 p-0 hover:bg-gray-100"
          title="Expand Sidebar"
        >
          <PanelLeftOpen className="w-4 h-4 text-gray-600" />
        </Button>

        {/* App Icon with Official Python Logo */}
        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-blue-600 rounded-lg flex items-center justify-center">
          <SiPython className="w-5 h-5 text-white" />
        </div>

        {/* Progress Ring */}
        <div className="relative w-10 h-10">
          <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            <path
              d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeDasharray={`${stats.progress_percentage}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-700">
              {Math.round(stats.progress_percentage)}%
            </span>
          </div>
        </div>

        {/* Key Stats - Just Icons */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col items-center" title={`${stats.total_xp} Total XP`}>
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-xs font-medium text-gray-700 mt-1">{stats.total_xp}</span>
          </div>
          
          <div className="flex flex-col items-center" title={`${stats.current_streak} Day Streak`}>
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-medium text-gray-700 mt-1">{stats.current_streak}</span>
          </div>
          
          <div className="flex flex-col items-center" title={`Level ${levelInfo.level}`}>
            <Star className="w-5 h-5 text-blue-500" />
            <span className="text-xs font-medium text-gray-700 mt-1">L{levelInfo.level}</span>
          </div>
        </div>

        {/* Current Section Indicator */}
        <div className="flex flex-col space-y-2">
          {sections.slice(0, 4).map((section) => {
            const isCurrentSection = section.lessons.some(lesson => 
              lesson.problems.some(problem => problem.id === currentProblemId)
            );
            const isCompleted = section.completed_lessons === section.total_lessons && section.total_lessons > 0;
            
            return (
              <div
                key={section.id}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  isCurrentSection
                    ? "bg-blue-500 w-3 h-3"
                    : isCompleted
                    ? "bg-emerald-500"
                    : section.is_locked
                    ? "bg-gray-300"
                    : "bg-gray-400"
                )}
                title={`${section.title} - ${isCompleted ? 'Completed' : isCurrentSection ? 'Current' : 'Available'}`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Header with Official Python Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-blue-600 rounded-lg flex items-center justify-center">
              <SiPython className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PyLearn</h1>
              <p className="text-sm text-gray-500">Interactive Python Learning</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="w-8 h-8 p-0"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Overview - COMPLETELY PRESERVED */}
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
            <div className="text-lg font-bold text-gray-900">{stats.problems_solved}/60</div>
            <div className="text-xs text-gray-500">Problems Solved</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-600">{stats.current_streak}</div>
            <div className="text-xs text-gray-500">Day Streak</div>
          </div>
        </div>

        {/* Level Display - COMPLETELY PRESERVED */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-sm font-medium text-blue-900">
                Level {levelInfo.level} {levelInfo.title}
              </span>
            </div>
            <span className="text-xs text-blue-700">
              {levelInfo.currentXP}/{levelInfo.xpForNextLevel} XP
            </span>
          </div>
          <Progress value={levelInfo.progressPercentage} className="h-1.5" />
          
          {/* Next Unlock Display - PRESERVED */}
          {levelInfo.nextUnlock && levelInfo.xpToNextUnlock && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
              <div className="text-xs font-medium text-amber-800">Next Unlock:</div>
              <div className="text-xs text-amber-700">{levelInfo.nextUnlock}</div>
              <div className="text-xs text-amber-600 mt-1">
                {levelInfo.xpToNextUnlock} XP needed
              </div>
            </div>
          )}
        </div>

        {/* Achievement Badges - COMPLETELY PRESERVED */}
        <div className="mt-4">
          <div className="text-xs font-medium text-gray-700 mb-2">Recent Achievements</div>
          <div className="flex space-x-2">
            {achievements.slice(0, 3).map((achievement, index) => (
              <div
                key={index}
                className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center"
                title={achievement.title}
              >
                {getAchievementIcon(achievement.icon)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Path Navigator - COMPLETELY PRESERVED */}
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
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        ({section.lessons.reduce((sum, lesson) => sum + lesson.completed_problems, 0)}/
                        {section.lessons.reduce((sum, lesson) => sum + lesson.total_problems, 0)} problems)
                      </span>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                      {section.is_locked && <Lock className="w-5 h-5 text-gray-400" />}
                      {!isCompleted && !section.is_locked && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{section.order_index}</span>
                        </div>
                      )}
                    </div>
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
                          
                          <div className="flex-1">
                            <span className={
                              lessonCompleted ? "text-emerald-700" :
                              hasCurrentProblem ? "text-blue-900 font-medium" :
                              lesson.is_locked ? "text-gray-500" :
                              "text-gray-700"
                            }>
                              {lesson.title}
                            </span>
                            <span className="text-xs text-gray-400 ml-2">
                              ({lesson.completed_problems}/{lesson.total_problems})
                            </span>
                          </div>
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