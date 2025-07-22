import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Progress, notification } from 'antd';
import { ReloadOutlined, CheckCircleOutlined, DatabaseOutlined, ClockCircleOutlined } from '@ant-design/icons';

const AdminRefreshButton = ({ onRefresh, disabled = false, lastRefreshTime = null }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshProgress, setRefreshProgress] = useState(0);
    const [timeSinceRefresh, setTimeSinceRefresh] = useState('');

    // Update time since last refresh
    useEffect(() => {
        if (lastRefreshTime) {
            const updateTimer = () => {
                const now = new Date();
                const diff = Math.floor((now - new Date(lastRefreshTime)) / 1000);
                
                if (diff < 60) {
                    setTimeSinceRefresh(`${diff}s ago`);
                } else if (diff < 3600) {
                    setTimeSinceRefresh(`${Math.floor(diff / 60)}m ago`);
                } else {
                    setTimeSinceRefresh(`${Math.floor(diff / 3600)}h ago`);
                }
            };

            updateTimer();
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }
    }, [lastRefreshTime]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        setRefreshProgress(0);

        // Animated progress
        const progressInterval = setInterval(() => {
            setRefreshProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + Math.random() * 20;
            });
        }, 200);

        try {
            // Show notification
            const key = 'refresh-notification';
            notification.info({
                key,
                message: '🔄 Refreshing Data',
                description: 'Fetching latest portfolio data and extending session...',
                duration: 2,
                icon: <ReloadOutlined spin />
            });

            await onRefresh();
            
            // Complete progress
            setRefreshProgress(100);
            
            // Success notification
            setTimeout(() => {
                notification.success({
                    key,
                    message: '✅ Refresh Complete',
                    description: 'Data updated successfully and session extended!',
                    duration: 3,
                    icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
                });
            }, 500);

        } catch (error) {
            notification.error({
                message: '❌ Refresh Failed',
                description: 'Failed to refresh data. Please try again.',
                duration: 4
            });
        } finally {
            clearInterval(progressInterval);
            setTimeout(() => {
                setIsRefreshing(false);
                setRefreshProgress(0);
            }, 1500);
        }
    };

    const getRefreshStatus = () => {
        if (!lastRefreshTime) return 'Never refreshed';
        return `Last: ${timeSinceRefresh}`;
    };

    const shouldShowWarning = () => {
        if (!lastRefreshTime) return false;
        const now = new Date();
        const diff = (now - new Date(lastRefreshTime)) / 1000;
        return diff > 300; // 5 minutes
    };

    return (
        <div className="relative">
            {/* Main Refresh Button */}
            <Tooltip 
                title={
                    <div className="text-center">
                        <div className="font-semibold mb-1">🔄 Smart Refresh System</div>
                        <div className="text-xs space-y-1">
                            <div>• Fetches latest portfolio data</div>
                            <div>• Extends admin session timeout</div>
                            <div>• Clears browser cache</div>
                            <div className="pt-1 border-t border-gray-400">
                                📊 {getRefreshStatus()}
                            </div>
                        </div>
                    </div>
                } 
                placement="bottom"
            >
                <Button
                    type="primary"
                    icon={isRefreshing ? <ReloadOutlined spin /> : <DatabaseOutlined />}
                    onClick={handleRefresh}
                    disabled={disabled || isRefreshing}
                    className={`
                        relative overflow-hidden
                        bg-gradient-to-r from-green-500 to-blue-600 
                        hover:from-green-600 hover:to-blue-700 
                        border-none text-white font-semibold
                        transition-all duration-300 transform hover:scale-105
                        shadow-lg hover:shadow-xl
                        ${shouldShowWarning() ? 'animate-pulse bg-gradient-to-r from-orange-500 to-red-600' : ''}
                        ${isRefreshing ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    size="large"
                >
                    <span className="relative z-10 flex items-center space-x-2">
                        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                        {shouldShowWarning() && !isRefreshing && (
                            <span className="text-xs bg-white/20 px-1 rounded">!</span>
                        )}
                    </span>
                    
                    {/* Progress overlay */}
                    {isRefreshing && (
                        <div 
                            className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300"
                            style={{ width: `${refreshProgress}%` }}
                        />
                    )}
                </Button>
            </Tooltip>

            {/* Status Indicator */}
            <div className="absolute -bottom-6 left-0 right-0 text-center">
                <div className={`text-xs transition-all duration-300 ${
                    shouldShowWarning() 
                        ? 'text-orange-600 font-semibold' 
                        : 'text-gray-500'
                }`}>
                    {isRefreshing ? (
                        <div className="flex items-center justify-center space-x-1">
                            <Progress 
                                percent={Math.round(refreshProgress)} 
                                size="small" 
                                showInfo={false}
                                strokeColor="#52c41a"
                                className="w-16"
                            />
                            <span>{Math.round(refreshProgress)}%</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center space-x-1">
                            <ClockCircleOutlined />
                            <span>{getRefreshStatus()}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminRefreshButton;
