'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { TriangleAlert as AlertTriangle, Clock } from 'lucide-react';
import { getHighRiskClients } from '@/lib/database';

interface RiskAlert {
  id: string;
  clientName: string;
  assessmentType: string;
  riskLevel: 'high' | 'moderate' | 'low';
  completedAt: string;
  riskFlags: string[];
}

export function RiskAlerts() {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const highRiskClients = await getHighRiskClients();
        setAlerts(highRiskClients);
      } catch (error) {
        console.error('Error fetching risk alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No Risk Alerts</AlertTitle>
        <AlertDescription>
          All clients are currently at low risk levels.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Alert key={alert.id} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="flex items-center justify-between">
            <span>High Risk Alert - {alert.clientName}</span>
            <Badge variant="destructive">{alert.riskLevel.toUpperCase()}</Badge>
          </AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-1">
              <p>Assessment: {alert.assessmentType}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Completed: {new Date(alert.completedAt).toLocaleString()}</span>
              </div>
              {alert.riskFlags.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Risk Factors:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {alert.riskFlags.map((flag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}