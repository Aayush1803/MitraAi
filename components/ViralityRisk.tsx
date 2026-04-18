'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { ViralityRisk as ViralityRiskType } from '@/lib/types';

interface ViralityRiskProps {
  data: ViralityRiskType;
}

const LEVEL_CONFIG = {
  Low: { color: '#22C55E', trackColor: 'rgba(34,197,94,0.2)', label: 'Low Risk', bgClass: 'badge-true' },
  Medium: { color: '#F59E0B', trackColor: 'rgba(245,158,11,0.2)', label: 'Medium Risk', bgClass: 'badge-misleading' },
  High: { color: '#EF4444', trackColor: 'rgba(239,68,68,0.2)', label: 'High Risk', bgClass: 'badge-false' },
};

export default function ViralityRisk({ data }: ViralityRiskProps) {
  const config = LEVEL_CONFIG[data.level];

  // Gauge arc parameters
  const size = 200;
  const cx = size / 2;
  const cy = size / 2 + 20;
  const r = 75;
  const startAngle = -210;
  const endAngle = 30;
  const totalAngle = endAngle - startAngle;
  const scoreAngle = startAngle + (data.score / 100) * totalAngle;

  function polarToCartesian(angle: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(start: number, end: number) {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const needlePt = polarToCartesian(scoreAngle);
  const arcLength = (totalAngle / 360) * 2 * Math.PI * r;

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-red-400" />
        </div>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Virality Risk</h3>
        <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${config.bgClass}`}>
          {config.label}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Gauge */}
        <div className="flex-shrink-0">
          <svg width={size} height={size * 0.75} viewBox={`0 0 ${size} ${size * 0.75}`}>
            {/* Track */}
            <path
              d={describeArc(startAngle, endAngle)}
              fill="none"
              stroke="var(--bg-border)"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Colored zones */}
            {[
              { start: startAngle, end: startAngle + totalAngle * 0.33, color: '#22C55E' },
              { start: startAngle + totalAngle * 0.33, end: startAngle + totalAngle * 0.66, color: '#F59E0B' },
              { start: startAngle + totalAngle * 0.66, end: endAngle, color: '#EF4444' },
            ].map((zone, i) => (
              <path
                key={i}
                d={describeArc(zone.start, zone.end)}
                fill="none"
                stroke={zone.color}
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.2"
              />
            ))}

            {/* Active arc */}
            <motion.path
              d={describeArc(startAngle, endAngle)}
              fill="none"
              stroke={config.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${arcLength}`}
              initial={{ strokeDashoffset: arcLength }}
              animate={{ strokeDashoffset: arcLength - (data.score / 100) * arcLength }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            />

            {/* Needle */}
            <motion.line
              x1={cx}
              y1={cy}
              x2={needlePt.x}
              y2={needlePt.y}
              stroke={config.color}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            />
            <circle cx={cx} cy={cy} r="5" fill={config.color} />

            {/* Score text */}
            <text x={cx} y={cy - 25} textAnchor="middle" fill="var(--text-primary, #fff)" fontSize="28" fontWeight="900" fontFamily="Inter">
              {data.score}
            </text>
            <text x={cx} y={cy - 8} textAnchor="middle" fill="var(--text-muted, #4A4A60)" fontSize="10" fontFamily="Inter">
              VIRALITY INDEX
            </text>

            {/* Zone labels */}
            <text x="20" y={size * 0.72} textAnchor="middle" fill="#22C55E" fontSize="9" fontFamily="Inter">LOW</text>
            <text x={cx} y={size * 0.72} textAnchor="middle" fill="#F59E0B" fontSize="9" fontFamily="Inter">MED</text>
            <text x={size - 20} y={size * 0.72} textAnchor="middle" fill="#EF4444" fontSize="9" fontFamily="Inter">HIGH</text>
          </svg>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)' }}>
            <p className="text-xs uppercase tracking-wide font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Why this score?</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{data.reason}</p>
          </div>

          {/* Spread indicators */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'WhatsApp Groups', value: data.score > 60 ? 'Very Likely' : data.score > 30 ? 'Possible' : 'Unlikely', hot: data.score > 60 },
              { label: 'Twitter/X', value: data.score > 70 ? 'Trending Risk' : data.score > 40 ? 'Moderate' : 'Low', hot: data.score > 70 },
            ].map(indicator => (
              <div key={indicator.label} className="p-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{indicator.label}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: indicator.hot ? '#EF4444' : 'var(--text-secondary)' }}>
                  {indicator.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
