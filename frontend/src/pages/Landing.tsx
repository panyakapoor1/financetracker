import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { 
  LayoutDashboard, 
  ArrowRight, 
  Wallet, 
  PieChart, 
  Target, 
  Calendar, 
  Trophy,
  ShieldCheck,
  Zap,
  TrendingUp
} from 'lucide-react';

const Landing = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "circOut"
      }
    }
  };

  const features = [
    {
      icon: <LayoutDashboard className="w-6 h-6 text-primary-400" />,
      title: "Smart Dashboard",
      description: "Get a comprehensive overview of your financial health at a glance."
    },
    {
      icon: <Wallet className="w-6 h-6 text-primary-400" />,
      title: "Transaction Tracking",
      description: "Detailed logging and categorization of all your income and expenses."
    },
    {
      icon: <PieChart className="w-6 h-6 text-primary-400" />,
      title: "Budget Management",
      description: "Set and track spending limits to keep your finances on track."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary-400" />,
      title: "Insightful Reports",
      description: "Visualize spending patterns with beautiful, interactive charts."
    },
    {
      icon: <Target className="w-6 h-6 text-primary-400" />,
      title: "Savings Goals",
      description: "Create and track milestones for your future big purchases."
    },
    {
      icon: <Calendar className="w-6 h-6 text-primary-400" />,
      title: "Recurring Events",
      description: "Stay ahead of bills with a smart calendar for recurring transactions."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center glass-panel px-6 py-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-500 rounded-lg">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">FinanceTracker</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-white/70 hover:text-white transition-colors font-medium">
              Log in
            </Link>
            <Link 
              to="/register" 
              className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-xl transition-all font-semibold shadow-lg shadow-primary-900/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-primary-400 text-sm font-medium mb-8"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Secure & Private Financial Tracking</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Take Control of Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              Financial Future
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            The all-in-one platform to track expenses, set budgets, and grow your savings with advanced analytics and beautiful visualizations.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/register" 
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl transition-all font-bold text-lg flex items-center justify-center gap-2 group shadow-xl shadow-primary-900/40"
            >
              Start Tracking Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#features" 
              className="w-full sm:w-auto glass-panel hover:bg-white/10 text-white px-8 py-4 rounded-2xl transition-all font-bold text-lg"
            >
              Explore Features
            </a>
          </motion.div>
        </div>
      </section>


      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need</h2>
            <p className="text-white/60 text-lg">Powerful tools to help you manage every aspect of your money.</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="glass-panel p-8 rounded-3xl hover:border-primary-500/50 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Achievements Section / Gamification Preview */}
      <section className="py-32 px-6 bg-gradient-to-b from-transparent to-primary-900/10">
        <div className="max-w-7xl mx-auto glass-panel p-12 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary-500/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary-500/10 blur-[100px]" />
          
          <div className="grid md:grid-cols-2 items-center gap-16 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Trophy className="w-4 h-4" />
                <span>Gamified Experience</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">Stay Motivated with Achievements</h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Turn your financial goals into a game. Earn badges, level up, and unlock rewards as you hit your savings milestones and maintain consistent tracking.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Unlock unique financial badges",
                  "Track your progress against milestones",
                  "Celebrate every small win on your journey"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <div className="w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3 h-3 text-primary-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="text-primary-400 font-bold flex items-center gap-2 group">
                Check out the rewards system
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((_, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="glass-panel aspect-square flex flex-col items-center justify-center p-6 rounded-2xl"
                  >
                    <Trophy className={`w-12 h-12 mb-4 ${i === 0 ? 'text-yellow-500' : 'text-white/20'}`} />
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500" style={{ width: i === 0 ? '100%' : `${30 + i * 15}%` }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-500 rounded-lg">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">FinanceTracker</span>
            </div>
            <p className="text-white/40 max-w-xs text-center md:text-left">
              Simplifying financial management for everyone, everywhere.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12">
            <div className="flex flex-col gap-3">
              <span className="font-bold text-sm uppercase tracking-widest text-white/20">Product</span>
              <a href="#features" className="text-white/60 hover:text-white transition-colors">Features</a>
              <Link to="/login" className="text-white/60 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="text-white/60 hover:text-white transition-colors">Register</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-sm">
          © 2024 FinanceTracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
