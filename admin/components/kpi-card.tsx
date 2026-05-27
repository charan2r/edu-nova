import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  icon?: ReactNode
  loading?: boolean
}

export function KPICard({ title, value, change, icon, loading = false }: KPICardProps) {
  const isPositive = change ? change > 0 : false

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            {loading ? (
              <div className="h-8 w-24 bg-muted rounded animate-pulse" />
            ) : (
              <>
                <span className="text-3xl font-bold text-foreground">{value}</span>
                {change !== undefined && (
                  <span className={`text-sm font-medium flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(change)}%
                  </span>
                )}
              </>
            )}
          </div>
        </div>
        {icon && (
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
