import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Medal } from "lucide-react";
import { Achievement, UserStats } from "@/types";

interface ProgressOverviewProps {
  stats: UserStats;
  achievements: Achievement[];
}

export function ProgressOverview({ stats, achievements }: ProgressOverviewProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-blue-600 font-semibold">
            {Math.round(stats.progress_percentage)}%
          </span>
        </div>
        <Progress value={stats.progress_percentage} className="mb-4" />
        
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
      </CardContent>
    </Card>
  );
}
