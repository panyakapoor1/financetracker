import React, { useState, useEffect } from 'react';
import { achievementService } from '../services';
import { Award, Lock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
    // Silently evaluate on load in case new ones were earned
    achievementService.evaluateAchievements().then(res => {
      if (res.data?.newUnlocks && res.data.newUnlocks.length > 0) {
        res.data.newUnlocks.forEach((badge: any) => {
          toast.success(`New Achievement Unlocked: ${badge.name}! 🏆`, { duration: 5000 });
        });
        fetchAchievements(); // refresh list
      }
    }).catch(console.error);
  }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await achievementService.getAchievements();
      setAchievements(res.data?.achievements || []);
    } catch (error) {
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  if (loading && achievements.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progress = Math.round((unlockedCount / achievements.length) * 100) || 0;

  return (
    <div className="p-6 h-full animate-fade-in flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Achievements</h2>
          <p className="text-white/60 mt-1">Unlock badges by reaching your financial goals.</p>
        </div>
        <div className="bg-surface border border-white/10 rounded-2xl p-4 flex items-center shadow-lg">
          <div className="mr-4">
            <p className="text-sm text-white/60 font-medium">Progress</p>
            <p className="text-xl font-bold text-white">{unlockedCount} / {achievements.length}</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-white/10 flex items-center justify-center relative">
            <div 
              className="absolute inset-0 rounded-full border-4 border-primary-500 transition-all duration-1000"
              style={{ clipPath: `polygon(50% 50%, 50% 0, ${progress > 25 ? '100% 0' : '50% 0'}, ${progress > 50 ? '100% 100%' : '100% 0'}, ${progress > 75 ? '0 100%' : '100% 100'}, 0 0)` }}
            />
            <span className="font-bold text-sm text-white z-10">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement: any) => {
            const isUnlocked = achievement.unlocked;
            return (
              <div 
                key={achievement.id} 
                className={`glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-500 hover:-translate-y-1 ${!isUnlocked ? 'opacity-60 grayscale-[50%]' : ''}`}
              >
                {!isUnlocked && (
                  <div className="absolute top-4 right-4 bg-black/40 p-2 rounded-full backdrop-blur-md">
                    <Lock className="w-4 h-4 text-white/50" />
                  </div>
                )}
                {isUnlocked && (
                  <div className="absolute top-4 right-4 text-green-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
                
                <div 
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 shadow-xl transition-transform duration-500 ${isUnlocked ? 'scale-110' : ''}`}
                  style={{ backgroundColor: `${achievement.color}20`, border: `2px solid ${isUnlocked ? achievement.color : 'rgba(255,255,255,0.1)'}` }}
                >
                  {achievement.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white text-center mb-2">{achievement.name}</h3>
                <p className="text-white/60 text-sm text-center mb-4">{achievement.description}</p>
                
                {isUnlocked && achievement.unlockedAt ? (
                  <div className="text-xs font-medium text-center text-primary-400/80 bg-primary-500/10 py-1.5 px-3 rounded-full inline-block mx-auto w-full">
                    Unlocked on {format(new Date(achievement.unlockedAt), 'MMM dd, yyyy')}
                  </div>
                ) : (
                  <div className="text-xs font-medium text-center text-white/30 bg-white/5 py-1.5 px-3 rounded-full inline-block mx-auto w-full">
                    Locked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
