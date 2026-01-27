import { useState } from "react";
import { useChatAnalytics, TimePeriod } from "@/hooks/useChatAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageSquare,
  Clock,
  Users,
  TrendingUp,
  Bot,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import ConversationVolumeChart from "./ConversationVolumeChart";
import ResponseTimeChart from "./ResponseTimeChart";
import PeakHoursChart from "./PeakHoursChart";

const periodLabels: Record<TimePeriod, string> = {
  today: "Today",
  "7days": "Last 7 Days",
  "30days": "Last 30 Days",
  all: "All Time",
};

const ChatAnalytics = () => {
  const [period, setPeriod] = useState<TimePeriod>("7days");
  const analytics = useChatAnalytics(period);

  const formatResponseTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  const stats = [
    {
      title: "Total Conversations",
      value: analytics.totalConversations,
      icon: MessageSquare,
      color: "text-blue-500",
    },
    {
      title: "Today",
      value: analytics.conversationsToday,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Avg Response Time",
      value: formatResponseTime(analytics.avgResponseTime),
      icon: Clock,
      color: "text-orange-500",
    },
    {
      title: "Lead Conversion",
      value: `${analytics.leadConversionRate.toFixed(1)}%`,
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Agent Handled",
      value: analytics.agentHandledCount,
      icon: UserCheck,
      color: "text-teal-500",
    },
    {
      title: "Bot Handled",
      value: analytics.botHandledCount,
      icon: Bot,
      color: "text-gray-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(Object.keys(periodLabels) as TimePeriod[]).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {periodLabels[p]}
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={analytics.refresh}
          disabled={analytics.isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${analytics.isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-4">
              {analytics.isLoading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversation Volume</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ConversationVolumeChart data={analytics.dailyTrend} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Peak Activity Hours</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <PeakHoursChart data={analytics.hourlyDistribution} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Messages per Conversation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Messages per Conversation</p>
              <p className="text-3xl font-bold">{analytics.messagesPerConversation.toFixed(1)}</p>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{analytics.agentHandledCount}</p>
                <p className="text-xs text-muted-foreground">Agent Handled</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-muted-foreground">{analytics.botHandledCount}</p>
                <p className="text-xs text-muted-foreground">Bot Only</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatAnalytics;
