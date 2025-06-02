import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, ArrowRight, Trophy, Star, Zap } from "lucide-react";
import { CodeExecutionResult } from "@/types";

interface OutputPanelProps {
  result?: CodeExecutionResult;
  onNextProblem: () => void;
  showNextButton: boolean;
}

export function OutputPanel({ result, onNextProblem, showNextButton }: OutputPanelProps) {
  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      <Tabs defaultValue="output" className="flex-1 flex flex-col">
        {/* Tab Navigation */}
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="output" className="flex items-center">
            <i className="fas fa-terminal mr-2 text-xs"></i>
            Output
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center">
            <CheckCircle className="w-3 h-3 mr-2" />
            Tests
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="output" className="h-full overflow-y-auto m-0">
            <div className="p-4 border-b border-gray-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Console Output</h4>
              <Card className="bg-gray-900 text-white">
                <CardContent className="p-3 font-mono text-sm">
                  {result ? (
                    <div className={`space-y-1 transition-all duration-500 ${
                      result.success ? 'animate-fade-in' : 'animate-shake'
                    }`}>
                      {result.output && (
                        <div className="text-gray-300 animate-slide-up">{result.output}</div>
                      )}
                      {result.success ? (
                        <div className="text-emerald-400 animate-bounce-in">✓ All tests passed!</div>
                      ) : (
                        <div className="text-red-400 animate-pulse">
                          {result.error || '✗ Some tests failed'}
                        </div>
                      )}
                      {result.execution_time && (
                        <div className="text-gray-400 text-xs animate-fade-in-delayed">
                          Execution time: {result.execution_time}ms
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      Click "Run Code" to see output...
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* XP Gains and Progress Updates */}
            {result?.success && result?.progress?.xp_gained && result.progress.xp_gained > 0 && (
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 border-t border-emerald-200">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-2 animate-bounce-in">
                    <Trophy className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-800 animate-fade-in">
                    Problem Solved!
                  </h3>
                  <div className="text-2xl font-bold text-emerald-600 animate-pulse">
                    +{result.progress?.xp_gained} XP
                  </div>
                </div>

                {/* XP Breakdown */}
                {result.progress?.xp_breakdown && (
                  <div className="bg-white rounded-lg p-3 mb-3 text-sm">
                    <div className="font-medium text-gray-900 mb-2">XP Breakdown:</div>
                    <div className="space-y-1 text-gray-600">
                      <div className="flex justify-between">
                        <span>Base XP:</span>
                        <span className="font-medium">+{result.progress.xp_breakdown.base_xp}</span>
                      </div>
                      {result.progress.xp_breakdown.efficiency_bonus > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Efficiency Bonus:</span>
                          <span className="font-medium">+{result.progress.xp_breakdown.efficiency_bonus}</span>
                        </div>
                      )}
                      {result.progress.xp_breakdown.hint_penalty > 0 && (
                        <div className="flex justify-between text-amber-600">
                          <span>Hint Penalty:</span>
                          <span className="font-medium">-{result.progress.xp_breakdown.hint_penalty}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Updated Stats */}
                {result.progress.updated_stats && (
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white rounded-lg p-2">
                      <div className="text-gray-500">Total XP</div>
                      <div className="font-bold text-blue-600">
                        {result.progress.updated_stats.total_xp}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <div className="text-gray-500">Problems</div>
                      <div className="font-bold text-emerald-600">
                        {result.progress.updated_stats.total_problems}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <div className="text-gray-500">Streak</div>
                      <div className="font-bold text-orange-600">
                        {result.progress.updated_stats.current_streak}
                      </div>
                    </div>
                  </div>
                )}

                {/* Achievement Notifications */}
                {result.progress.new_achievements && result.progress.new_achievements.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {result.progress.new_achievements.map((achievement, index) => (
                      <div key={index} className="bg-amber-100 border border-amber-300 rounded-lg p-3 animate-slide-in-right">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-amber-600 mr-2" />
                          <div>
                            <div className="font-bold text-amber-800">{achievement.title}</div>
                            <div className="text-xs text-amber-700">{achievement.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Performance Metrics */}
            {result && (
              <div className="p-4 bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Performance</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Execution Time</div>
                    <div className="font-medium text-gray-900">
                      {result.execution_time ? `${result.execution_time}ms` : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Attempts</div>
                    <div className="font-medium text-gray-900">
                      {result.progress?.attempts || 1}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tests" className="h-full overflow-y-auto m-0">
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Test Cases</h4>
              
              {result?.test_results ? (
                <div className="space-y-3">
                  {result.test_results.map((test, index) => (
                    <Card 
                      key={index}
                      className={`transition-all duration-300 transform hover:scale-102 ${
                        test.passed 
                          ? 'bg-emerald-50 border-emerald-200 animate-slide-in-right' 
                          : 'bg-red-50 border-red-200 animate-slide-in-right'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium ${
                            test.passed ? 'text-emerald-800' : 'text-red-800'
                          }`}>
                            Test Case {test.test_case}
                          </span>
                          {test.passed ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div className={`text-xs space-y-1 ${
                          test.passed ? 'text-emerald-700' : 'text-red-700'
                        }`}>
                          <div>Input: {JSON.stringify(test.input)}</div>
                          <div>Expected: {JSON.stringify(test.expected)}</div>
                          <div>Got: {JSON.stringify(test.actual)}</div>
                          {test.error && (
                            <div className="text-red-600 font-medium">Error: {test.error}</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Run your code to see test results
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Action Buttons */}
      {showNextButton && (
        <div className="border-t border-gray-200 p-4">
          <Button
            onClick={onNextProblem}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:scale-105 animate-bounce-in"
          >
            Next Problem
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
