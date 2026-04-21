import React, { useState, useEffect } from 'react';
import { recurringService } from '../services';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [recurringItems, setRecurringItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecurring();
  }, []);

  const fetchRecurring = async () => {
    setLoading(true);
    try {
      const res = await recurringService.getAll();
      setRecurringItems(res.data?.recurringTransactions || []);
    } catch (error) {
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart;
  const endDate = monthEnd;

  const dateFormat = "MMMM yyyy";
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  const startDayOfWeek = getDay(monthStart); // 0 = Sunday

  // Get items due on a specific day
  const getItemsForDay = (day: Date) => {
    return recurringItems.filter(item => {
      if (!item.isActive) return false;
      const nextDate = new Date(item.nextDate);
      
      // Basic check: if the nextDate is exactly this day
      if (isSameDay(nextDate, day)) return true;

      // Handle frequencies (simplistic for this view)
      if (item.frequency === 'monthly' && nextDate.getDate() === day.getDate() && day >= nextDate) return true;
      if (item.frequency === 'yearly' && nextDate.getDate() === day.getDate() && nextDate.getMonth() === day.getMonth() && day >= nextDate) return true;

      return false;
    });
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  return (
    <div className="p-6 h-full animate-fade-in flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Bill Calendar</h2>
          <p className="text-white/60 mt-1">Visualize your upcoming recurring bills and income.</p>
        </div>
        <div className="flex space-x-2 bg-surface border border-white/10 rounded-xl p-1">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="px-4 py-2 font-semibold text-white flex items-center min-w-[150px] justify-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-primary-400" />
            {format(currentDate, dateFormat)}
          </div>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-white/10 bg-white/5">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-3 text-center text-sm font-medium text-white/60">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5 auto-rows-fr">
          {/* Empty cells for days before the 1st */}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="border-r border-b border-white/5 bg-white/[0.02]" />
          ))}

          {/* Actual days */}
          {daysInMonth.map((day) => {
            const dayItems = getItemsForDay(day);
            const isCurrentDay = isToday(day);

            return (
              <div key={day.toString()} className={`border-r border-b border-white/5 p-2 overflow-y-auto custom-scrollbar relative transition-colors ${isCurrentDay ? 'bg-primary-500/10' : 'hover:bg-white/5'}`}>
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium mb-2 ${isCurrentDay ? 'bg-primary-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'text-white/60'}`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayItems.map(item => (
                    <div key={item._id} className={`text-xs px-2 py-1 rounded border ${item.type === 'income' ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-300'} truncate cursor-pointer hover:opacity-80 transition-opacity`} title={`${item.categoryId?.name}: ${formatCurrency(item.amount)}`}>
                      {item.categoryId?.icon} {item.categoryId?.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
