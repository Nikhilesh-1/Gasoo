
import React, { useState, useEffect } from 'react';
import GasCylinder from '@/components/GasCylinder';
import UsageGraph from '@/components/UsageGraph';
import RemoteControl from '@/components/RemoteControl';
import StatusBadge from '@/components/StatusBadge';
import { calculateDaysRemaining, generateUsageData, calculateAverageDailyUsage } from '@/utils/gasUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Gauge, AlertTriangle, BarChart3 } from 'lucide-react';

const Index = () => {
  const [gasLevel, setGasLevel] = useState(85);
  const [usageData, setUsageData] = useState(generateUsageData());
  const [averageDailyUsage, setAverageDailyUsage] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);

  // Simulate a live data feed by slightly changing the gas level periodically
  useEffect(() => {
    // Calculate average daily usage from usage data
    const avgUsage = calculateAverageDailyUsage(usageData);
    setAverageDailyUsage(avgUsage);
    
    // Calculate days remaining based on current level and average usage
    const days = calculateDaysRemaining(gasLevel, avgUsage);
    setDaysRemaining(days);

    // Simulate gas usage over time (decreasing level)
    const interval = setInterval(() => {
      setGasLevel(prevLevel => {
        // Decrease by a small random amount (0.1 to 0.3)
        const decrease = Math.random() * 0.2 + 0.1;
        return Math.max(0, prevLevel - decrease);
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [gasLevel, usageData]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 animate-fade-in">
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gas-dark">Gas Monitoring Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time monitoring and control for your gas system</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 text-xs bg-white">
              <Clock size={14} className="mr-1" /> Live Data
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-xs bg-white">
              <Calendar size={14} className="mr-1" /> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Cylinder visualization */}
          <Card className="dashboard-card lg:col-span-1 overflow-visible animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Gas Level</h2>
                <StatusBadge level={gasLevel} />
              </div>
              <GasCylinder level={gasLevel} />
            </CardContent>
          </Card>

          {/* Usage Graph */}
          <Card className="dashboard-card lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <UsageGraph data={usageData} />
          </Card>

          {/* Estimated days remaining */}
          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Estimated Days Remaining</h2>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Gauge size={14} /> Usage Stats
                </Badge>
              </div>
              
              <div className="flex flex-col items-center justify-center h-48">
                <div className="text-6xl font-bold mb-2 animate-pulse-subtle" style={{ color: gasLevel > 40 ? '#34C759' : '#ea384c' }}>
                  {daysRemaining}
                </div>
                <div className="text-lg text-muted-foreground">Days</div>
                
                <div className="mt-6 flex items-center gap-2 text-sm bg-secondary px-3 py-2 rounded-full">
                  <BarChart3 size={16} className="text-gas-blue" />
                  <span>Avg. Daily Usage: <strong>{averageDailyUsage} cubic ft</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Remote Control */}
          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <RemoteControl />
          </Card>

          {/* Safety Information */}
          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Safety Information</h2>
                <AlertTriangle size={20} className="text-gas-yellow" />
              </div>
              
              <div className="mt-2 space-y-4 text-sm">
                <p>• <strong>Emergency Contacts:</strong> Keep emergency gas service numbers readily available.</p>
                <p>• <strong>Regular Maintenance:</strong> Schedule routine inspections of your gas system.</p>
                <p>• <strong>Low Level Warning:</strong> Order a refill when your gas level drops below 30%.</p>
                <p>• <strong>Shut Off:</strong> Use the remote valve control to shut off gas supply in case of emergency.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="max-w-6xl mx-auto mt-12 text-center text-xs text-muted-foreground">
        <p>Gas Monitoring System • {new Date().getFullYear()} • Last updated: {new Date().toLocaleTimeString()}</p>
      </footer>
    </div>
  );
};

export default Index;
