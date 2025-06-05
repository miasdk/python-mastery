import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  BookOpen, 
  Target, 
  Building2, 
  ChevronDown, 
  ChevronRight, 
  Lightbulb,
  Search,
  Trophy
} from "lucide-react";
import { ProblemDetail } from "@/types";

interface ProblemDescriptionProps {
  problem: ProblemDetail;
  onHintUsed: () => void;
}

export function ProblemDescription({ problem, onHintUsed }: ProblemDescriptionProps) {
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [isResearchOpen, setIsResearchOpen] = useState(true);
  const [isObjectivesOpen, setIsObjectivesOpen] = useState(false);
  const [isProfessionalOpen, setIsProfessionalOpen] = useState(false);

  const revealNextHint = () => {
    if (revealedHints < problem.hints.length) {
      setRevealedHints(revealedHints + 1);
      onHintUsed();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '15-20 min';
      case 'medium': return '25-35 min';
      case 'hard': return '40-60 min';
      default: return '20-30 min';
    }
  };

  return (
    <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        {/* Problem Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{problem.title}</h1>
            <div className="flex items-center space-x-3">
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
              <span className="text-sm text-gray-600">{formatTime(problem.difficulty)}</span>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm font-medium text-blue-600">{problem.xp_reward} XP</span>
            </div>
          </div>
        </div>

        {/* Business Context */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Business Context</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{problem.description}</p>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Research Topics Section - NEW! */}
        {problem.researchTopics && problem.researchTopics.length > 0 && (
          <Collapsible open={isResearchOpen} onOpenChange={setIsResearchOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto mb-3">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-semibold text-gray-900">🔍 Research Topics & Key Concepts</h3>
                </div>
                {isResearchOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mb-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-sm text-emerald-800 mb-3 font-medium">
                  Before you start coding, explore these Python concepts that professional developers use for this type of system:
                </p>
                <ul className="space-y-2">
                  {problem.researchTopics.map((topic, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span className="text-sm text-emerald-800">
                        <strong>{topic.split(':')[0]}:</strong> {topic.split(':')[1] || topic}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 p-3 bg-emerald-100 rounded-md">
                  <p className="text-xs text-emerald-700">
                    <strong>💡 Pro Tip:</strong> Research these concepts first to solve this problem like a professional developer!
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Learning Objectives - NEW! */}
        {problem.learningObjectives && problem.learningObjectives.length > 0 && (
          <Collapsible open={isObjectivesOpen} onOpenChange={setIsObjectivesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto mb-3">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">🎯 Learning Objectives</h3>
                </div>
                {isObjectivesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-3">
                  By completing this problem, you'll master:
                </p>
                <ul className="space-y-2">
                  {problem.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Trophy className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-blue-800">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Professional Context - NEW! */}
        {problem.professionalContext && (
          <Collapsible open={isProfessionalOpen} onOpenChange={setIsProfessionalOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto mb-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">💼 Professional Context</h3>
                </div>
                {isProfessionalOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mb-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800 leading-relaxed">
                  {problem.professionalContext}
                </p>
                {problem.businessCategory && (
                  <div className="mt-3">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {problem.businessCategory.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Progressive Hints */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <h3 className="font-semibold text-gray-900">Progressive Hints</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHints(!showHints)}
            >
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </Button>
          </div>

          {showHints && (
            <div className="space-y-3">
              {problem.hints.slice(0, revealedHints).map((hint, index) => (
                <div
                  key={index}
                  className="bg-amber-50 border border-amber-200 rounded-lg p-3 animate-fade-in"
                >
                  <div className="flex items-start space-x-2">
                    <Badge className="bg-amber-100 text-amber-800 text-xs">
                      Hint {index + 1}
                    </Badge>
                  </div>
                  <p className="text-sm text-amber-800 mt-2">{hint}</p>
                </div>
              ))}

              {revealedHints < problem.hints.length && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={revealNextHint}
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Reveal Next Hint ({revealedHints + 1}/{problem.hints.length})
                </Button>
              )}

              {revealedHints === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Try solving the problem first! Hints are available if you get stuck.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={revealNextHint}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    Need a hint? Click here
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}