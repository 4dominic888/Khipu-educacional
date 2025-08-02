import React from 'react'
import * as LucideIcons from 'lucide-react'

interface BasicCardProps {
  title: string;
  quantity: number | string;
  hint?: string;
  orientation?: string,
  IconComponent?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconSize?: number;
}

const BasicCard: React.FC<BasicCardProps> = ({ 
  title, 
  quantity, 
  hint,
  orientation,
  IconComponent = LucideIcons.Package, 
  iconColor = 'text-blue-600',
  iconSize = 8
}) => {
    return (
        <div className={`basic-card ${orientation}`}>
            <div>
                <p className="text-sm text-primary">{title}</p>
                <p className="text-2xl font-bold text-secondary-foreground">{quantity}</p>
                <p className="text-xs text-gray-500">{hint}</p>
            </div>
            <IconComponent className={`w-${iconSize} h-${iconSize} ${iconColor}`} />
        </div>
    )
}

export default BasicCard
