import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Heart,
  Smile,
  Shield,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { FootnoteDisclaimer } from '../common/FootnoteDisclaimer';

export const PatientProgress: React.FC = () => {
  const { currentPatient, sessions } = useApp();

  const patientSessions = sessions.filter(s => s.patientId === currentPatient.id);

  const [weeklyGoals, setWeeklyGoals] = useState([
    { id: 'g1', text: 'Practice gentle onset with morning reading (3x)', completed: true },
    { id: 'g2', text: 'Log 1 self-reflection on speaking comfort during meetings', completed: true },
    { id: 'g3', text: 'Listen back to one recording without self-criticism', completed: false },
    { id: 'g4', text: 'Diaphragmatic breathing relaxation before video calls', completed: false }
  ]);

  const toggleGoal = (id: string) => {
    setWeeklyGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  // Prepare chart data points for comfort and confidence over time
  // Default mock trajectory points if few sessions
  const chartPoints = patientSessions.length > 0
    ? [...patientSessions].reverse().map((s, idx) => ({
        index: idx,
        date: s.date.split(' ')[0],
        comfort: s.ratings.comfort,
        confidence: s.ratings.confidence,
        anxiety: s.ratings.anxiety,
        effort: s.ratings.effort,
        exercise: s.exerciseTitle
      }))
    : [
        { index: 0, date: '08-10', comfort: 2, confidence: 2, anxiety: 4, effort: 4, exercise: 'Initial Reading' },
        { index: 1, date: '08-15', comfort: 3, confidence: 3, anxiety: 3, effort: 3, exercise: 'Gentle-Onset' },
        { index: 2, date: '08-20', comfort: 3, confidence: 4, anxiety: 3, effort: 3, exercise: 'Paced Speech' },
        { index: 3, date: '08-24', comfort: 4, confidence: 4, anxiety: 2, effort: 2, exercise: 'Custom Plosives' },
        { index: 4, date: '08-25', comfort: 4, confidence: 4, anxiety: 2, effort: 3, exercise: 'Presentation Prep' }
      ];

  const svgWidth = 600;
  const svgHeight = 220;
  const padding = { top: 20, right: 30, bottom: 40, left: 40 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const getX = (idx: number) => {
    if (chartPoints.length <= 1) return padding.left + graphWidth / 2;
    return padding.left + (idx / (chartPoints.length - 1)) * graphWidth;
  };

  const getY = (val: number) => {
    // scale 1 to 5
    const normalized = (val - 1) / 4; // 0 to 1
    return padding.top + (1 - normalized) * graphHeight;
  };

  const comfortPath = chartPoints
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.comfort)}`)
    .join(' ');

  const confidencePath = chartPoints
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.confidence)}`)
    .join(' ');

  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  return (
    <div id="patient-progress-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 sm:p-8 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            Self-Perception & Ease Trends
          </span>
          <span className="text-xs text-slate-500">
            Subjective well-being over time
          </span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 font-serif">
          Comfort & Confidence Reflections
        </h2>

        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Tracking how speech feels from the inside out. Rather than measuring speech errors, we observe changes in your physical ease, readiness to participate, and speaking comfort.
        </p>
      </div>

      {/* 1. PROGRESS CHART: Comfort & Confidence Over Time */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Longitudinal Ease Trajectory (1–5 Scale)
            </h3>
            <p className="text-xs text-slate-500">
              Ratings recorded after each practice session
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-teal-700 inline-block" />
              <span className="font-medium text-slate-700">Physical Comfort</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="font-medium text-slate-700">Confidence</span>
            </div>
          </div>
        </div>

        {/* Calm SVG Chart */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[500px] relative">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto text-slate-400"
              aria-label="Line chart showing comfort and confidence ratings rising over time"
            >
              {/* Grid Lines for 1 to 5 scale */}
              {[1, 2, 3, 4, 5].map(rating => {
                const y = getY(rating);
                return (
                  <g key={rating}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 10}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="11"
                      fill="#64748B"
                      fontFamily="sans-serif"
                    >
                      {rating}
                    </text>
                  </g>
                );
              })}

              {/* Data Lines */}
              <path
                d={comfortPath}
                fill="none"
                stroke="#0F766E"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={confidencePath}
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points */}
              {chartPoints.map((pt, i) => (
                <g key={i}>
                  {/* Comfort Point */}
                  <circle
                    cx={getX(i)}
                    cy={getY(pt.comfort)}
                    r="5"
                    fill="#0F766E"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-7 transition-all"
                    onMouseEnter={() => setHoveredPoint({ ...pt, metric: 'Comfort', val: pt.comfort })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Confidence Point */}
                  <circle
                    cx={getX(i)}
                    cy={getY(pt.confidence)}
                    r="5"
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-7 transition-all"
                    onMouseEnter={() => setHoveredPoint({ ...pt, metric: 'Confidence', val: pt.confidence })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* X Axis Date Label */}
                  <text
                    x={getX(i)}
                    y={svgHeight - 12}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#64748B"
                    fontFamily="sans-serif"
                  >
                    {pt.date}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip display */}
            {hoveredPoint && (
              <div className="absolute top-2 right-4 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-lg pointer-events-none space-y-1">
                <p className="font-semibold text-teal-300">{hoveredPoint.exercise}</p>
                <p className="text-slate-300">Date: {hoveredPoint.date}</p>
                <p>
                  Comfort: <strong className="text-teal-400">{hoveredPoint.comfort}/5</strong> • Confidence: <strong className="text-emerald-400">{hoveredPoint.confidence}/5</strong>
                </p>
                <p className="text-[11px] text-slate-400">
                  Tension level: {hoveredPoint.anxiety}/5
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-4 flex items-start gap-3 text-xs text-teal-950">
          <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <p>
            <strong>Therapy Insight:</strong> Self-perceived ease has trended upward over recent sessions. Physical effort ratings indicate reduced jaw and shoulder tension during vocal initiations.
          </p>
        </div>
      </section>

      {/* 2. WEEKLY GOALS CHECKLIST */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Weekly Gentle Goals
            </h3>
            <p className="text-xs text-slate-500">
              Personal intentions for comfortable communication. Check items off at your pace.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
            {weeklyGoals.filter(g => g.completed).length} of {weeklyGoals.length} completed
          </span>
        </div>

        <div className="space-y-2 pt-2">
          {weeklyGoals.map(goal => (
            <div
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-3.5 rounded-xl border transition flex items-center gap-3 cursor-pointer ${
                goal.completed
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {goal.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 shrink-0" />
              )}
              <span className={`text-sm ${goal.completed ? 'line-through opacity-80' : 'font-medium'}`}>
                {goal.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      <FootnoteDisclaimer />
    </div>
  );
};
