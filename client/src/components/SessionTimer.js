import React, { useState, useEffect } from 'react';
import { Clock, Activity, AlertTriangle, Shield, Timer, Zap } from 'lucide-react';
import { Progress, Badge, Tooltip } from 'antd';

const SessionTimer = ({ 
    remainingTime, 
    remainingSeconds, 
    isActive, 
    showWarning,
    className = '',
    onExtendSession
}) => {
    const [pulse, setPulse] = useState(false);
    const [timeHistory, setTimeHistory] = useState([]);

    // Calculate progress percentage (5 minutes = 300 seconds)
    const progressPercentage = Math.max(0, (remainingSeconds / 300) * 100);
    
    // Track activity changes for visual feedback
    useEffect(() => {
        if (isActive) {
            setPulse(true);
            setTimeout(() => setPulse(false), 1000);
            
            // Track time history for analytics
            setTimeHistory(prev => [
                ...prev.slice(-9), // Keep last 10 entries
                { time: new Date(), remaining: remainingSeconds, active: isActive }
            ]);
        }
    }, [isActive, remainingSeconds]);

    // Determine status and colors
    const getStatus = () => {
        if (showWarning || remainingSeconds <= 60) return {
            color: 'danger',
            bgColor: 'bg-red-500',
            textColor: 'text-red-400',
            borderColor: 'border-red-500/30',
            gradient: 'from-red-500/20 to-red-600/10'
        };
        if (remainingSeconds <= 120) return {
            color: 'warning',
            bgColor: 'bg-yellow-500',
            textColor: 'text-yellow-400',
            borderColor: 'border-yellow-500/30',
            gradient: 'from-yellow-500/20 to-yellow-600/10'
        };
        return {
            color: 'success',
            bgColor: 'bg-green-500',
            textColor: 'text-green-400',
            borderColor: 'border-green-500/30',
            gradient: 'from-green-500/20 to-green-600/10'
        };
    };

    const status = getStatus();

    // Format display time with enhanced formatting
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return {
            minutes: mins.toString().padStart(2, '0'),
            seconds: secs.toString().padStart(2, '0'),
            display: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        };
    };

    const timeFormat = formatTime(remainingSeconds);

    // Get warning level
    const getWarningLevel = () => {
        if (remainingSeconds <= 30) return 'critical';
        if (remainingSeconds <= 60) return 'high';
        if (remainingSeconds <= 120) return 'medium';
        return 'low';
    };

    return (
        <div className={`session-timer space-y-3 ${className}`}>
            {/* Enhanced Main Timer Display */}
            <div className={`relative overflow-hidden bg-gradient-to-br ${status.gradient} backdrop-blur-md rounded-2xl border ${status.borderColor} shadow-lg transition-all duration-300 ${
                pulse ? 'scale-105 shadow-xl' : ''
            }`}>
                {/* Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-pulse" />
                
                <div className="relative p-4">
                    <div className="flex items-center justify-between">
                        {/* Left Section - Status & Timer */}
                        <div className="flex items-center space-x-4">
                            {/* Status Icon with Animation */}
                            <Tooltip title={`Session ${isActive ? 'Active' : 'Idle'} - ${getWarningLevel()} priority`}>
                                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full ${
                                    showWarning ? 'bg-red-500/20 animate-pulse' : 
                                    isActive ? 'bg-green-500/20' : 'bg-gray-500/20'
                                } transition-all duration-300`}>
                                    {showWarning ? (
                                        <AlertTriangle className={`w-6 h-6 ${status.textColor} animate-bounce`} />
                                    ) : isActive ? (
                                        <Activity className={`w-6 h-6 ${status.textColor} ${pulse ? 'animate-pulse' : ''}`} />
                                    ) : (
                                        <Shield className="w-6 h-6 text-gray-400" />
                                    )}
                                    
                                    {/* Activity Pulse Ring */}
                                    {isActive && (
                                        <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-20" />
                                    )}
                                </div>
                            </Tooltip>

                            {/* Enhanced Timer Display */}
                            <div className="space-y-1">
                                <div className="flex items-baseline space-x-1">
                                    <Clock className="w-4 h-4 text-white/60" />
                                    <span className="text-xs text-white/60 font-medium">Session Time</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <span className={`font-mono text-2xl font-bold ${status.textColor} transition-colors duration-300`}>
                                        {timeFormat.minutes}
                                    </span>
                                    <span className={`font-mono text-xl ${status.textColor} opacity-75 animate-pulse`}>:</span>
                                    <span className={`font-mono text-2xl font-bold ${status.textColor} transition-colors duration-300`}>
                                        {timeFormat.seconds}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Progress & Stats */}
                        <div className="text-right space-y-2">
                            {/* Progress Ring */}
                            <div className="relative w-16 h-16">
                                <Progress
                                    type="circle"
                                    percent={progressPercentage}
                                    size={64}
                                    strokeColor={
                                        status.color === 'danger' ? '#ef4444' :
                                        status.color === 'warning' ? '#f59e0b' : '#10b981'
                                    }
                                    strokeWidth={8}
                                    showInfo={false}
                                    className="transform rotate-90"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-bold text-white/80">
                                        {Math.round(progressPercentage)}%
                                    </span>
                                </div>
                            </div>

                            {/* Activity Badge */}
                            <Badge 
                                status={isActive ? 'processing' : 'default'} 
                                text={
                                    <span className="text-xs text-white/60 font-medium">
                                        {isActive ? 'Active' : 'Idle'}
                                    </span>
                                }
                            />
                        </div>
                    </div>

                    {/* Enhanced Progress Bar */}
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs text-white/60">
                            <span>Time Remaining</span>
                            <span>{getWarningLevel().toUpperCase()} Priority</span>
                        </div>
                        <div className="relative w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-1000 ease-out ${status.bgColor} ${
                                    showWarning ? 'animate-pulse' : ''
                                }`}
                                style={{ width: `${progressPercentage}%` }}
                            />
                            {/* Progress Glow Effect */}
                            <div 
                                className="absolute top-0 h-full bg-white/20 transition-all duration-1000"
                                style={{ width: `${Math.min(progressPercentage + 10, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Warning Message */}
            {showWarning && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 backdrop-blur-sm animate-pulse">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
                            <div>
                                <span className="text-sm text-red-200 font-semibold">Critical: Session Expiring</span>
                                <div className="text-xs text-red-300/80">Please extend or save your work</div>
                            </div>
                        </div>
                        {onExtendSession && (
                            <button
                                onClick={onExtendSession}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                            >
                                <Zap className="w-3 h-3 inline mr-1" />
                                Extend
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Session Info & Analytics */}
            <div className="bg-white/5 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-white/60">
                    <div className="flex items-center space-x-2">
                        <Timer className="w-3 h-3" />
                        <span>Session Policy</span>
                    </div>
                    <Badge count={timeHistory.length} size="small" style={{ backgroundColor: '#52c41a' }} />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-white/80 font-semibold">5:00</div>
                        <div className="text-xs text-white/50">Auto-logout</div>
                    </div>
                    <div>
                        <div className="text-yellow-400 font-semibold">1:00</div>
                        <div className="text-xs text-white/50">Warning</div>
                    </div>
                    <div>
                        <div className="text-green-400 font-semibold">{timeHistory.filter(t => t.active).length}</div>
                        <div className="text-xs text-white/50">Activities</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionTimer;
