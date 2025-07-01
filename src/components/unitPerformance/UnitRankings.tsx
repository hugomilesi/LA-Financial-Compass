
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, Trophy, Medal, Award } from 'lucide-react';
import { UnitRanking } from '@/types/unitPerformance';

interface UnitRankingsProps {
  rankings: UnitRanking[];
  onUnitClick: (unitId: string) => void;
}

export const UnitRankings = ({ rankings, onUnitClick }: UnitRankingsProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <div className="w-5 h-5 flex items-center justify-center text-gray-500 font-bold">{rank}</div>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Overall Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Ranking Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rankings.map((unit) => (
              <div 
                key={unit.unitId}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onUnitClick(unit.unitId)}
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(unit.rank)}
                  <div>
                    <h3 className="font-medium text-gray-900">{unit.unitName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Score: {unit.overallScore.toFixed(1)}</span>
                      {getTrendIcon(unit.trend)}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Desempenho Geral</span>
                    <Badge className={getScoreBadgeColor(unit.overallScore)}>
                      {unit.overallScore.toFixed(0)}%
                    </Badge>
                  </div>
                  <Progress value={unit.overallScore} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ranking Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...rankings]
                .sort((a, b) => b.financialScore - a.financialScore)
                .map((unit, index) => (
                  <div key={unit.unitId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="text-sm font-medium">{unit.unitName}</span>
                    </div>
                    <span className={`text-sm font-medium ${getScoreColor(unit.financialScore)}`}>
                      {unit.financialScore.toFixed(1)}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ranking Operacional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...rankings]
                .sort((a, b) => b.operationalScore - a.operationalScore)
                .map((unit, index) => (
                  <div key={unit.unitId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="text-sm font-medium">{unit.unitName}</span>
                    </div>
                    <span className={`text-sm font-medium ${getScoreColor(unit.operationalScore)}`}>
                      {unit.operationalScore.toFixed(1)}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ranking Estratégico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...rankings]
                .sort((a, b) => b.strategicScore - a.strategicScore)
                .map((unit, index) => (
                  <div key={unit.unitId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="text-sm font-medium">{unit.unitName}</span>
                    </div>
                    <span className={`text-sm font-medium ${getScoreColor(unit.strategicScore)}`}>
                      {unit.strategicScore.toFixed(1)}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
