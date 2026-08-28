import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Heart,
  TrendingUp,
  Activity,
  Sparkles,
  ArrowRight,
  Smile,
  Frown,
  Meh,
  Flame,
} from 'lucide-react';

export const EmotionsView: React.FC = () => {
  const { chapters, scenes, setActiveSceneId, setActiveView } = useStoryOS();

  // Map each scene to emotional intensity
  const sceneEmotions = scenes.map((s, idx) => {
    // Generate an intensity and label based on mood or mock sensible values
    const mood = s.mood || 'Reflektif';
    let val = 50;
    if (mood.toLowerCase().includes('duka') || mood.toLowerCase().includes('patah') || mood.toLowerCase().includes('krisis')) val = 15;
    else if (mood.toLowerCase().includes('tegang') || mood.toLowerCase().includes('konflik')) val = 85;
    else if (mood.toLowerCase().includes('haru') || mood.toLowerCase().includes('hangat')) val = 75;
    else if (mood.toLowerCase().includes('nostalgia') || mood.toLowerCase().includes('tenang')) val = 55;

    return {
      id: s.id,
      title: s.title,
      mood: s.mood || 'Tenang / Mengalir',
      intensity: val,
      index: idx + 1,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div className="flex items-center gap-2 text-amber-600 text-xs font-mono font-semibold uppercase mb-1">
          <Activity className="w-4 h-4" />
          <span>Analisis Ritme & Dinamika Emosi</span>
        </div>
        <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
          Kurva Perjalanan Emosional & Resonansi Pembaca
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Pastikan naskah memiliki pasang surut emosional (emotional roller-coaster). Cerita yang bagus tidak pernah datar, melainkan menari antara harapan, duka, ketegangan, dan katarsis.
        </p>
      </div>

      {/* Visual Emotional Curve Graph */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold font-serif-book text-stone-900 dark:text-stone-100 flex items-center justify-between">
          <span>Tinggi Rendah Ketegangan per Adegan</span>
          <span className="text-[11px] font-mono text-stone-400">Total {sceneEmotions.length} Adegan Terdaftar</span>
        </h3>

        {/* Visual Bar representation */}
        <div className="pt-6 pb-2">
          <div className="h-44 flex items-end gap-3 sm:gap-6 border-b border-l border-stone-200 dark:border-stone-700 px-4 pb-2">
            {sceneEmotions.map((item) => (
              <div
                key={item.id}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative cursor-pointer"
                onClick={() => {
                  setActiveSceneId(item.id);
                  setActiveView('writing_studio');
                }}
              >
                {/* Tooltip */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-stone-900 text-white text-[10px] p-2 rounded-lg whitespace-nowrap shadow-lg z-20">
                  <p className="font-bold">{item.title}</p>
                  <p className="text-amber-300">Mood: {item.mood}</p>
                  <p>Intensitas: {item.intensity}%</p>
                </div>

                <div
                  style={{ height: `${item.intensity}%` }}
                  className={`w-full max-w-[40px] rounded-t-lg transition-all group-hover:scale-x-110 ${
                    item.intensity > 70
                      ? 'bg-gradient-to-t from-rose-500 to-amber-500'
                      : item.intensity < 30
                      ? 'bg-gradient-to-t from-indigo-800 to-indigo-500'
                      : 'bg-gradient-to-t from-amber-600 to-amber-400'
                  }`}
                />

                <span className="text-[10px] font-mono text-stone-400 group-hover:text-amber-600">
                  #{item.index}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[11px] font-mono text-stone-400 px-4 pt-2">
            <span>Awal Cerita</span>
            <span>Titik Tengah (Midpoint)</span>
            <span>Klimaks & Akhir</span>
          </div>
        </div>
      </div>

      {/* Breakdown List */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold font-serif-book text-stone-900 dark:text-stone-100">
          Daftar Rincian Suasana Adegan
        </h3>

        <div className="space-y-2">
          {scenes.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => {
                setActiveSceneId(s.id);
                setActiveView('writing_studio');
              }}
              className="p-3.5 bg-stone-50 dark:bg-stone-800/40 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 rounded-xl border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-mono font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold font-serif-book text-stone-900 dark:text-stone-100">
                    {s.title}
                  </h4>
                  <p className="text-xs text-stone-500 font-serif-reading">
                    {s.summary || 'Belum ada sinopsis adegan.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium">
                  {s.mood || 'Reflektif'}
                </span>
                <span className="text-xs text-amber-600 hidden sm:inline font-mono">Buka di Editor →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
