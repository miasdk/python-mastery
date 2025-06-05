import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight, 
  Trophy, 
  Star, 
  Zap, 
  Copy,
  Terminal,
  RotateCcw 
} from "lucide-react";
import { CodeExecutionResult } from "@/types";
import { useState } from "react";

interface OutputPanelProps {
  result?: CodeExecutionResult;
  onNextProblem: () => void;
  showNextButton: boolean;
}

export function OutputPanel({ result, onNextProblem, showNextButton }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const copyOutput = () => {
    if (result?.output) {
      navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatExecutionTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      <Tabs defaultValue="output" className="flex-1 flex flex-col">
        {/* Tab Navigation - Enhanced */}
        <div className="border-b border-gray-200 bg-gray-50">
          <TabsList className="grid w-full grid-cols-2 bg-transparent">
            <TabsTrigger value="output" className="flex items-center data-[state=active]:bg-white">
              <Terminal className="w-3 h-3 mr-2" />
              Output
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center data-[state=active]:bg-white">
              <CheckCircle className="w-3 h-3 mr-2" />
              Tests
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="output" className="h-full overflow-y-auto m-0">
            {/* Console Header */}
            <div className="p-4 border-b border-gray-100 bg-white">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                  <Terminal className="w-4 h-4 mr-2 text-gray-600" />
                  Console Output
                </h4>
                
                <div className="flex items-center space-x-2">
                  {/* Status Badge */}
                  {result && (
                    <Badge className={
                      result.success 
                        ? "bg-green-100 text-green-800 border-green-200" 
                        : "bg-red-100 text-red-800 border-red-200"
                    }>
                      {result.success ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {result.success ? 'Success' : 'Error'}
                    </Badge>
                  )}
                  
                  {/* Copy Button */}
                  {result?.output && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={copyOutput}
                      className="h-7 w-7 p-0"
                      title="Copy output"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Execution Stats */}
              {result && (
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatExecutionTime(result.execution_time || 0)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3" />
                    <span>{result.test_results?.length || 0} tests</span>
                  </div>
                </div>
              )}
            </div>

            {/* Terminal Output - Enhanced */}
            <div className="p-4">
              <Card className="bg-gray-900 text-white overflow-hidden">
                <CardContent className="p-0">
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-400 text-xs font-mono">Python Console</span>
                    </div>
                    {result && (
                      <span className="text-gray-500 text-xs font-mono">
                        {formatExecutionTime(result.execution_time || 0)}
                      </span>
                    )}
                  </div>
                  
                  {/* Terminal Content */}
                  <div className="p-4 font-mono text-sm min-h-[120px]">
                    {result ? (
                      <div className={`space-y-1 transition-all duration-500 ${
                        result.success ? 'animate-fade-in' : 'animate-shake'
                      }`}>
                        <div className="text-gray-400 text-xs"> Running your code...</div>
                        {result.output && (
                          <div className="text-gray-100 whitespace-pre-wrap animate-slide-up">
                            {result.output}
                          </div>
                        )}
                        {result.success ? (
                          <div className="text-emerald-400 animate-bounce-in flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            All tests passed!
                          </div>
                        ) : (
                          <div className="text-red-400 animate-pulse flex items-center">
                            <XCircle className="w-4 h-4 mr-2" />
                            {result.error || 'Some tests failed'}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500 flex items-center justify-center h-24">
                        <div className="text-center">
                          <Terminal className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                          <div>Click "Run Code" to see output...</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* XP Gains and Progress Updates - Simplified */}
            {result?.success && result?.progress?.xp_gained && result.progress.xp_gained > 0 && (
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 border-t border-emerald-200">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-2 animate-bounce-in">
                    <Trophy className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-800 animate-fade-in">
                    Problem Solved! 🎉
                  </h3>
                </div>

                {/* XP Breakdown - Enhanced */}
                {result.progress?.xp_breakdown && (
                  <Card className="mb-3">
                    <CardContent className="p-3">
                      <div className="font-medium text-gray-900 mb-2 text-sm">XP Breakdown:</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base XP:</span>
                          <span className="font-medium text-blue-600">+{result.progress.xp_breakdown.base_xp}</span>
                        </div>
                        {result.progress.xp_breakdown.efficiency_bonus > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Efficiency Bonus:</span>
                            <span className="font-medium text-emerald-600">+{result.progress.xp_breakdown.efficiency_bonus}</span>
                          </div>
                        )}
                        {result.progress.xp_breakdown.hint_penalty > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hint Penalty:</span>
                            <span className="font-medium text-amber-600">-{result.progress.xp_breakdown.hint_penalty}</span>
                          </div>
                        )}
                        <div className="border-t pt-1 flex justify-between font-semibold">
                          <span>Total:</span>
                          <span className="text-emerald-600">+{result.progress.xp_breakdown.total_gained}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Updated Stats - Enhanced */}
                {result.progress.updated_stats && (
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                    <Card className="p-2">
                      <div className="text-gray-500">Total XP</div>
                      <div className="font-bold text-blue-600">
                        {result.progress.updated_stats.total_xp}
                      </div>
                    </Card>
                    <Card className="p-2">
                      <div className="text-gray-500">Problems</div>
                      <div className="font-bold text-emerald-600">
                        {result.progress.updated_stats.total_problems}
                      </div>
                    </Card>
                    <Card className="p-2">
                      <div className="text-gray-500">Streak</div>
                      <div className="font-bold text-orange-600">
                        {result.progress.updated_stats.current_streak}
                      </div>
                    </Card>
                  </div>
                )}

                {/* Achievement Notifications - Enhanced */}
                {result.progress.new_achievements && result.progress.new_achievements.length > 0 && (
                  <div className="space-y-2">
                    {result.progress.new_achievements.map((achievement, index) => (
                      <Card key={index} className="bg-amber-50 border-amber-200 animate-slide-in-right">
                        <CardContent className="p-3">
                          <div className="flex items-center">
                            <Star className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" />
                            <div>
                              <div className="font-bold text-amber-800">{achievement.title}</div>
                              <div className="text-xs text-amber-700">{achievement.description}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Tests Tab - Enhanced */}
          <TabsContent value="tests" className="h-full overflow-y-auto m-0">
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Test Cases
              </h4>
              
              {result?.test_results ? (
                <div className="space-y-3">
                  {result.test_results.map((test, index) => (
                    <Card 
                      key={index}
                      className={`transition-all duration-300 ${
                        test.passed 
                          ? 'bg-emerald-50 border-emerald-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-sm font-medium ${
                            test.passed ? 'text-emerald-800' : 'text-red-800'
                          }`}>
                            Test Case {test.test_case}
                          </span>
                          <Badge className={
                            test.passed 
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          }>
                            {test.passed ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {test.passed ? 'PASS' : 'FAIL'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-xs font-mono">
                          <div className="flex">
                            <span className="text-gray-500 w-16 flex-shrink-0">Input:</span>
                            <span className="text-gray-900 break-all">
                              {JSON.stringify(test.input)}
                            </span>
                          </div>
                          <div className="flex">
                            <span className="text-gray-500 w-16 flex-shrink-0">Expected:</span>
                            <span className="text-gray-900 break-all">
                              {JSON.stringify(test.expected)}
                            </span>
                          </div>
                          <div className="flex">
                            <span className="text-gray-500 w-16 flex-shrink-0">Actual:</span>
                            <span className={`break-all ${
                              test.passed ? 'text-emerald-700' : 'text-red-700'
                            }`}>
                              {JSON.stringify(test.actual)}
                            </span>
                          </div>
                          {test.error && (
                            <div className="bg-red-100 border border-red-200 rounded p-2 mt-2">
                              <div className="text-red-600 font-medium text-xs">Error:</div>
                              <div className="text-red-700 text-xs">{test.error}</div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <div className="font-medium mb-1">No test results yet</div>
                  <div className="text-sm">Run your code to see test results</div>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Action Buttons - Enhanced */}
      {showNextButton && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <Button
            onClick={onNextProblem}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:scale-105"
          >
            Next Problem
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}