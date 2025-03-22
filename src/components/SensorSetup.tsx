
import React, { useState, useEffect } from 'react';
import { SensorDevice, scanForSensors, connectToSensor, streamSensorData } from '@/utils/sensorUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, Bluetooth, Battery, RefreshCw, Power } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface SensorSetupProps {
  onSensorConnected: (deviceId: string) => void;
}

const SensorSetup: React.FC<SensorSetupProps> = ({ onSensorConnected }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [availableSensors, setAvailableSensors] = useState<SensorDevice[]>([]);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleScanForSensors = async () => {
    setIsScanning(true);
    try {
      const sensors = await scanForSensors();
      setAvailableSensors(sensors);
      if (sensors.length === 0) {
        toast({
          title: "No sensors found",
          description: "Make sure your sensors are powered on and in range.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error scanning for sensors:", error);
      toast({
        title: "Scan failed",
        description: "There was an error scanning for sensors. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleConnectSensor = async (device: SensorDevice) => {
    setConnectingId(device.id);
    try {
      const success = await connectToSensor(device.id);
      if (success) {
        // Update device status in the list
        setAvailableSensors(prev => 
          prev.map(s => s.id === device.id ? { ...s, isConnected: true } : s)
        );
        
        toast({
          title: "Sensor connected",
          description: `Successfully connected to ${device.name}.`,
          variant: "default"
        });
        
        // Notify parent component
        onSensorConnected(device.id);
      } else {
        toast({
          title: "Connection failed",
          description: "Could not connect to the sensor. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error connecting to sensor:", error);
      toast({
        title: "Connection error",
        description: "An unexpected error occurred while connecting.",
        variant: "destructive"
      });
    } finally {
      setConnectingId(null);
    }
  };

  // Auto-scan when component mounts
  useEffect(() => {
    handleScanForSensors();
  }, []);

  const getSensorIcon = (type: SensorDevice['type']) => {
    switch (type) {
      case 'wifi':
        return <Wifi className="mr-2 h-4 w-4" />;
      case 'bluetooth':
        return <Bluetooth className="mr-2 h-4 w-4" />;
      default:
        return <Power className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <Card className="shadow-md animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center justify-between">
          Sensor Setup
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleScanForSensors} 
            disabled={isScanning}
          >
            <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isScanning ? (
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-gas-red mb-4" />
            <p className="text-sm text-muted-foreground">Scanning for nearby sensors...</p>
          </div>
        ) : availableSensors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No sensors found nearby</p>
            <Button onClick={handleScanForSensors} className="bg-gas-red hover:bg-gas-red/90">
              Scan Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {availableSensors.map(device => (
              <div key={device.id} className="border rounded-lg p-4 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium flex items-center">
                      {getSensorIcon(device.type)}
                      {device.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">ID: {device.id}</p>
                  </div>
                  <Badge 
                    variant={device.isConnected ? "default" : "outline"} 
                    className={device.isConnected ? "bg-green-500" : ""}
                  >
                    {device.isConnected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
                
                {device.batteryLevel !== undefined && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center">
                        <Battery className="h-3 w-3 mr-1" />
                        Battery
                      </span>
                      <span>{device.batteryLevel}%</span>
                    </div>
                    <Progress value={device.batteryLevel} className="h-1.5" />
                  </div>
                )}
                
                {!device.isConnected && (
                  <Button 
                    onClick={() => handleConnectSensor(device)}
                    disabled={connectingId === device.id}
                    className="mt-2 bg-gas-red hover:bg-gas-red/90"
                    size="sm"
                  >
                    {connectingId === device.id ? 'Connecting...' : 'Connect'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SensorSetup;
