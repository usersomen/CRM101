import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart3, Users, Mail, Calendar, Bell, Settings, Search,
  Plus, TrendingUp, DollarSign, UserPlus, CheckCircle,
  Clock, MessageSquare, Phone, FileText, ChevronRight,
  Filter, PieChart, FolderOpen, ListChecks, MessageCircle,
  BrainCircuit, ChevronDown, Upload, UserCheck, Target,
  Share2, ClipboardList, Bot, LineChart, Briefcase,
  LogOut, Sun, Moon
} from 'lucide-react';
import SideNav from '../components/SideNav';
import ChatInterface from '../components/ChatBot/ChatInterface';

function DashboardCard({ title, value, trend, icon: Icon, type }: {
  title: string;
  value: string;
  trend?: { value: string; positive: boolean };
  icon: React.ElementType;
  type: 'revenue' | 'leads' | 'deals' | 'response';
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      className={`modern-card ${type} rounded-xl shadow-lg p-6 card-float`}
      onMouseMove={handleMouseMove}
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`,
      } as React.CSSProperties}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-semibold dark:text-white">{value}</h3>
          {trend && (
            <div className={`flex items-center mt-2 ${
              trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${!trend.positive && 'rotate-180'}`} />
              <span className="text-sm">{trend.value}</span>
            </div>
          )}
        </div>
        <div className="p-3 glass rounded-lg">
          <Icon className={`h-6 w-6 ${
            type === 'revenue' ? 'text-indigo-600 dark:text-indigo-400' :
            type === 'leads' ? 'text-purple-600 dark:text-purple-400' :
            type === 'deals' ? 'text-emerald-600 dark:text-emerald-400' :
            'text-amber-600 dark:text-amber-400'
          }`} />
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ icon: Icon, title, time, description }: {
  icon: React.ElementType;
  title: string;
  time: string;
  description: string;
}) {
  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="p-2 bg-indigo-50 rounded-lg">
        <Icon className="h-5 w-5 text-indigo-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="text-xs text-gray-400">{time}</div>
    </div>
  );
}

function TaskItem({ title, dueDate, priority }: {
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}) {
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <input type="checkbox" className="rounded border-gray-300" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority]}`}>
          {priority}
        </span>
        <span className="text-sm text-gray-500">{dueDate}</span>
      </div>
    </div>
  );
}

function NavDropdown({ label, icon: Icon, items }: {
  label: string;
  icon: React.ElementType;
  items: { label: string; icon: React.ElementType; action?: () => void }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 focus:outline-none"
      >
        <Icon className="h-5 w-5 mr-2" />
        {label}
        <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action?.();
                  setIsOpen(false);
                }}
                className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navigationItems = [
    {
      id: 'contacts',
      label: 'Contacts',
      icon: Users,
      items: [
        { label: 'All Contacts', icon: Users },
        { label: 'Add New Contact', icon: UserPlus },
        { label: 'Import/Export Contacts', icon: Upload },
        { label: 'Contact Segments/Lists', icon: ListChecks }
      ]
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: Target,
      items: [
        { label: 'All Leads', icon: Users },
        { label: 'New Lead', icon: UserPlus },
        { label: 'Lead Stages/Pipeline', icon: PieChart },
        { label: 'Lead Scoring', icon: Target },
        { label: 'Import/Export Leads', icon: Upload }
      ]
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: Briefcase,
      items: [
        { label: 'All Projects', icon: FolderOpen },
        { label: 'New Project', icon: Plus },
        { label: 'Project Templates', icon: FileText },
        { label: 'Task List', icon: ListChecks },
        { label: 'Task Board', icon: ClipboardList },
        { label: 'Time Tracking', icon: Clock }
      ]
    },
    {
      id: 'sales',
      label: 'Sales & Finance',
      icon: DollarSign,
      items: [
        { label: 'Deals/Opportunities', icon: Target },
        { label: 'Quotes', icon: FileText },
        { label: 'Invoices', icon: FileText },
        { label: 'Payments', icon: DollarSign },
        { label: 'Expenses', icon: DollarSign },
        { label: 'Revenue Reports', icon: LineChart },
        { label: 'Financial Reports', icon: LineChart },
        { label: 'Payment Reminders', icon: Bell }
      ]
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageCircle,
      items: [
        { label: 'Unified Inbox', icon: Mail },
        { label: 'Compose Email', icon: Mail },
        { label: 'Compose Message', icon: MessageSquare },
        { label: 'Email Templates', icon: FileText },
        { label: 'Meeting Scheduler', icon: Calendar }
      ]
    },
    {
      id: 'client-portal',
      label: 'Client Portal',
      icon: Users,
      items: [
        { label: 'Portal Settings', icon: Settings },
        { label: 'Shared Files', icon: FolderOpen },
        { label: 'Messages', icon: MessageSquare },
        { label: 'Project Updates', icon: ClipboardList }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: LineChart,
      items: [
        { label: 'Sales Reports', icon: LineChart },
        { label: 'Marketing Reports', icon: LineChart },
        { label: 'Project Reports', icon: LineChart },
        { label: 'Financial Reports', icon: LineChart },
        { label: 'Custom Reports', icon: LineChart },
        { label: 'Dashboards', icon: PieChart }
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: Settings,
      items: [
        { label: 'Calculator', icon: Plus },
        { label: 'Currency Converter', icon: DollarSign },
        { label: 'Notes', icon: FileText },
        { label: 'Integrations', icon: Share2 }
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'} border-b backdrop-blur-md transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <BarChart3 className={`h-8 w-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} animate-float`} />
                <span className={`ml-2 text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>FlowCRM</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-indigo-400 hover:bg-gray-700/50' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100/50'
                }`}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-indigo-400 hover:bg-gray-700/50' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100/50'
              } relative`}>
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800 animate-pulse" />
              </button>
              <button className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-indigo-400 hover:bg-gray-700/50' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100/50'
              }`}>
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={handleLogout}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-indigo-400 hover:bg-gray-700/50' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100/50'
                }`}
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <nav className={`fixed top-16 left-0 right-0 z-40 ${isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'} border-b backdrop-blur-md transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14">
            <div className="flex space-x-1">
              {navigationItems.map((item) => (
                <NavDropdown
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  items={item.items}
                />
              ))}
            </div>
          </div>
        </div>
      </nav>

      <SideNav />

      <main className="transition-all duration-300 ease-in-out pt-32">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-3 py-2 border rounded-xl leading-5 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300`}
                  placeholder="Search contacts, deals, or activities..."
                />
              </div>
            </div>
            <div className="ml-4 flex items-center space-x-4">
              <button className={`inline-flex items-center px-4 py-2 border rounded-xl text-sm font-medium transition-all duration-300 ${
                isDarkMode
                  ? 'border-gray-700 text-gray-200 bg-gray-800 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Add Deal
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4 dashboard-grid">
            <DashboardCard
              title="Total Revenue"
              value="$124,500"
              trend={{ value: "+12.5%", positive: true }}
              icon={DollarSign}
              type="revenue"
            />
            <DashboardCard
              title="New Leads"
              value="64"
              trend={{ value: "+8.1%", positive: true }}
              icon={UserPlus}
              type="leads"
            />
            <DashboardCard
              title="Deals Won"
              value="24"
              trend={{ value: "+2.3%", positive: true }}
              icon={CheckCircle}
              type="deals"
            />
            <DashboardCard
              title="Avg. Response Time"
              value="2.4h"
              trend={{ value: "-10.5%", positive: true }}
              icon={Clock}
              type="response"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="glass rounded-xl shadow-lg p-6 hover-lift pipeline-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Pipeline</h2>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">View all</button>
              </div>
              <div className="space-y-4">
                {[
                  { stage: 'Qualified', value: '$45,000', deals: 12 },
                  { stage: 'Meeting', value: '$78,000', deals: 8 },
                  { stage: 'Proposal', value: '$125,000', deals: 5 },
                  { stage: 'Negotiation', value: '$260,000', deals: 3 },
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                        : 'bg-white/50 hover:bg-gray-50/50'
                    }`}
                  >
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.stage}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.deals} deals</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl shadow-lg p-6 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">View all</button>
              </div>
              <div className="space-y-2">
                <ActivityItem
                  icon={MessageSquare}
                  title="New Message"
                  time="5m ago"
                  description="Sarah replied to your proposal"
                />
                <ActivityItem
                  icon={Phone}
                  title="Call Scheduled"
                  time="1h ago"
                  description="Meeting with Alex at 3 PM"
                />
                <ActivityItem
                  icon={FileText}
                  title="Contract Signed"
                  time="2h ago"
                  description="Project X contract finalized"
                />
                <ActivityItem
                  icon={Mail}
                  title="Email Sent"
                  time="3h ago"
                  description="Follow-up email to Mike"
                />
              </div>
            </div>

            <div className="glass rounded-xl shadow-lg p-6 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tasks</h2>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">View all</button>
              </div>
              <div className="space-y-2">
                <TaskItem
                  title="Send proposal to Client A"
                  dueDate="Today"
                  priority="high"
                />
                <TaskItem
                  title="Follow up with leads"
                  dueDate="Tomorrow"
                  priority="medium"
                />
                <TaskItem
                  title="Update sales report"
                  dueDate="Next week"
                  priority="low"
                />
                <TaskItem
                  title="Client meeting prep"
                  dueDate="Today"
                  priority="high"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <ChatInterface />
    </div>
  );
}