import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ArrowRight, CheckCircle, Users, Zap, Shield } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-float" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">FlowCRM</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/auth')}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/auth?signup=true')}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Transform Your Customer <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Relationships
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-8">
              Streamline your sales process, automate workflows, and build stronger customer relationships with our modern CRM solution.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/auth?signup=true')}
                className="px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Contact Management</h3>
              <p className="text-gray-600 dark:text-gray-300">Organize and manage your contacts efficiently with our intuitive interface.</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">Get intelligent insights and recommendations to optimize your sales process.</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Enterprise Security</h3>
              <p className="text-gray-600 dark:text-gray-300">Your data is protected with enterprise-grade security and encryption.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}