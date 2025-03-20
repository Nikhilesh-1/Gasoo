
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Power } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type RemoteControlProps = {
  className?: string;
};

const RemoteControl: React.FC<RemoteControlProps> = ({ className }) => {
  const [isOn, setIsOn] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingState, setPendingState] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleToggleRequest = (newState: boolean) => {
    setPendingState(newState);
    if (!newState) {
      // Only show confirmation when turning off
      setShowConfirmDialog(true);
    } else {
      // When turning on, apply change immediately
      applyStateChange(newState);
    }
  };

  const applyStateChange = (newState: boolean) => {
    setIsOn(newState);
    setPendingState(null);
    
    toast({
      title: newState ? "Gas valve opened" : "Gas valve closed",
      description: newState 
        ? "The gas supply has been turned on successfully." 
        : "The gas supply has been turned off for safety.",
      variant: newState ? "default" : "destructive",
    });
  };

  const cancelStateChange = () => {
    setPendingState(null);
    setShowConfirmDialog(false);
  };

  return (
    <div className={cn('p-6 dashboard-card', className)}>
      <h3 className="text-lg font-semibold mb-4">Remote Valve Control</h3>
      
      <div className="flex flex-col items-center justify-center gap-4 mt-2">
        <div className={cn(
          'relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300',
          isOn ? 'bg-gas-green/10' : 'bg-gas-red/10'
        )}>
          <Power 
            size={36} 
            className={cn(
              'transition-colors duration-300',
              isOn ? 'text-gas-green' : 'text-gas-red'
            )} 
          />
        </div>
        
        <div className="text-sm font-medium mb-2">
          Status: <span className={isOn ? 'text-gas-green' : 'text-gas-red'}>
            {isOn ? 'Open' : 'Closed'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gas-red">Off</span>
          <Switch 
            checked={isOn} 
            onCheckedChange={handleToggleRequest}
            className="data-[state=checked]:bg-gas-green"
          />
          <span className="text-sm text-gas-green">On</span>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-2">
          {isOn 
            ? "Valve is open. Turn off to stop gas flow." 
            : "Valve is closed for safety. Turn on to resume gas flow."}
        </p>
      </div>
      
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Close Gas Valve?</AlertDialogTitle>
            <AlertDialogDescription>
              This will shut off gas flow to the system. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelStateChange}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => pendingState !== null && applyStateChange(pendingState)}
              className="bg-gas-red hover:bg-gas-red/90"
            >
              Close Valve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RemoteControl;
