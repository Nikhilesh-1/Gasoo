
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import StatusBadge from './StatusBadge';
import { Progress } from '@/components/ui/progress';

type GasCylinderProps = {
  level: number;
  className?: string;
};

const GasCylinder: React.FC<GasCylinderProps> = ({ level, className }) => {
  // Format the level to display with 2 decimal places
  const formattedLevel = level.toFixed(2);
  
  const [animateLevel, setAnimateLevel] = useState(0);
  const [bubbles, setBubbles] = useState<Array<{ id: number; left: number; delay: number; size: number }>>([]);

  useEffect(() => {
    // Smooth animation for level changes
    const timer = setTimeout(() => setAnimateLevel(level), 100);
    
    // Generate random bubbles
    const newBubbles = Array.from({ length: 7 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 0.7 + 0.3,
    }));
    
    setBubbles(newBubbles);
    
    return () => clearTimeout(timer);
  }, [level]);

  const getLiquidColor = () => {
    if (level > 70) return 'bg-gas-green';
    if (level >= 40) return 'bg-gas-yellow';
    return 'bg-gas-red';
  };

  const getLiquidOpacity = () => {
    if (level > 70) return 'opacity-80';
    if (level >= 40) return 'opacity-90';
    return 'opacity-90';
  };

  const getTextColor = () => {
    if (level > 70) return 'text-gas-green';
    if (level >= 40) return 'text-gas-yellow';
    return 'text-gas-red';
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Large percentage display */}
      <div className="mb-4 text-center">
        <div className={cn('text-5xl font-bold mb-1 transition-colors', getTextColor())}>
          {formattedLevel}%
        </div>
        <div className="flex items-center justify-center">
          <StatusBadge level={level} />
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full mb-6">
        <Progress 
          value={level} 
          className="h-3 w-full"
          style={{
            background: 'rgba(0,0,0,0.05)',
            '--tw-gradient-from': level > 70 ? '#34C759' : level >= 40 ? '#F8B84E' : '#ea384c'
          } as React.CSSProperties}
        />
      </div>
      
      <div className="cylinder-container h-56 w-36 mx-auto" style={{ boxShadow: '0 10px 30px -15px rgba(0,0,0,0.15)' }}>
        {/* Top cap */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-16 h-4 bg-gray-300 rounded-full z-10"></div>
        
        {/* Cylinder body */}
        <div className="h-full w-full flex items-center justify-center overflow-hidden">
          {/* Liquid */}
          <div 
            className={cn(
              'cylinder-liquid animate-liquid-rise',
              getLiquidColor(),
              getLiquidOpacity()
            )}
            style={{ 
              '--level-height': `${animateLevel}%`,
              height: `${animateLevel}%`,
              boxShadow: `0 0 20px 0 ${level > 70 ? 'rgba(52, 199, 89, 0.3)' : level >= 40 ? 'rgba(248, 184, 78, 0.3)' : 'rgba(234, 56, 76, 0.3)'}`
            } as React.CSSProperties}
          >
            {/* Bubbles */}
            {level > 10 && bubbles.map(bubble => (
              <div
                key={bubble.id}
                className="absolute rounded-full bg-white animate-bubble-rise opacity-70"
                style={{
                  width: `${bubble.size * 10}px`,
                  height: `${bubble.size * 10}px`,
                  left: `${bubble.left}%`,
                  bottom: '5%',
                  animationDelay: `${bubble.delay}s`,
                  animationDuration: `${2 + bubble.delay}s`
                }}
              />
            ))}
          </div>
          
          {/* Level marks */}
          <div className="absolute inset-y-0 right-3 flex flex-col justify-between py-4 pointer-events-none">
            {[0, 25, 50, 75, 100].map((mark) => (
              <div key={mark} className="flex items-center">
                <div className="h-px w-2 bg-gray-400" />
                <span className="text-[10px] text-gray-500 ml-1">{mark}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasCylinder;
