import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import { authService } from '../../services/authService';
import { setUser } from '../../store/slices/authSlice';
import { RegisterCredentials } from '../../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterCredentials & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterCredentials & { confirmPassword: string }) => {
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await authService.register(registerData);
      dispatch(setUser(response.data.user));
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full glass-panel rounded-2xl shadow-2xl p-8 animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4 border border-primary-500/30">
            <UserPlus className="w-8 h-8 text-primary-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-white/60 mt-2">Start tracking your finances today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Confirm
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm',
                  validate: (value: string) => value === password || 'No match',
                })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2.5 px-4 rounded-xl hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg shadow-primary-600/20"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/60">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
