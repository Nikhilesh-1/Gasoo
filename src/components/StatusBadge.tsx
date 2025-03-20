
import React from 'react';
import { cn } from '@/lib/utils';

type StatusBadgeProps = {
  level: number;
  className?: string;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ level, className }) => {
  const getStatusConfig = () => {
    if (level > 70) {
      return {
        label: 'Optimal',
        className: 'status-badge-green',
      };
    } else if (level >= 40) {
      return {
        label: 'Adequate',
        className: 'status-badge-yellow',
      };
    } else {
      return {
        label: 'Low',
        className: 'status-badge-red',
      };
    }
  };

  const { label, className: statusClassName } = getStatusConfig();

  return (
    <span className={cn('status-badge animate-fade-in', statusClassName, className)}>
      {label}
    </span>
  );
};

export default StatusBadge;
