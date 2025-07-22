import React from 'react';
import { Modal, Button, Progress } from 'antd';

const SessionWarningModal = ({ 
    visible, 
    timeLeft, 
    onExtendSession, 
    onLogout,
    onClose 
}) => {
    // Format time left for display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progressPercent = timeLeft > 0 ? ((60 - timeLeft) / 60) * 100 : 100; // 60 seconds warning period
    
    // Enhanced visual feedback based on time remaining
    const getUrgencyLevel = () => {
        if (timeLeft <= 10) return 'critical';
        if (timeLeft <= 30) return 'high';
        return 'medium';
    };

    const urgencyLevel = getUrgencyLevel();

    return (
        <Modal
            title={
                <div className={`flex items-center space-x-2 ${
                    urgencyLevel === 'critical' ? 'text-red-600' : 
                    urgencyLevel === 'high' ? 'text-orange-600' : 'text-orange-600'
                }`}>
                    <span className={`text-2xl ${urgencyLevel === 'critical' ? 'animate-bounce' : ''}`}>
                        {urgencyLevel === 'critical' ? '🚨' : '⚠️'}
                    </span>
                    <span className="font-bold">
                        {urgencyLevel === 'critical' ? 'URGENT: Session Expiring!' : 'Session Expiring Soon'}
                    </span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            closable={false}
            maskClosable={false}
            className={`session-warning-modal ${urgencyLevel === 'critical' ? 'animate-pulse' : ''}`}
            width={500}
        >
            <div className="text-center py-6">
                <div className="mb-6">
                    <div className={`text-6xl mb-4 ${urgencyLevel === 'critical' ? 'animate-pulse' : ''}`}>
                        {urgencyLevel === 'critical' ? '🔥' : '⏰'}
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${
                        urgencyLevel === 'critical' ? 'text-red-700' : 'text-gray-800'
                    }`}>
                        {urgencyLevel === 'critical' ? 
                            'IMMEDIATE ACTION REQUIRED!' : 
                            'Your session will expire in:'
                        }
                    </h3>
                    <div className={`text-4xl font-bold mb-4 ${
                        urgencyLevel === 'critical' ? 'text-red-600 animate-pulse' : 
                        urgencyLevel === 'high' ? 'text-orange-500' : 'text-red-500'
                    }`}>
                        {formatTime(timeLeft)}
                    </div>
                    <Progress
                        percent={progressPercent}
                        status={urgencyLevel === 'critical' ? 'exception' : 'active'}
                        strokeColor={{
                            '0%': '#108ee9',
                            '50%': '#f0ad4e',
                            '100%': urgencyLevel === 'critical' ? '#dc3545' : '#d9534f',
                        }}
                        className={`mb-4 ${urgencyLevel === 'critical' ? 'animate-pulse' : ''}`}
                    />
                    <p className={`mb-6 ${
                        urgencyLevel === 'critical' ? 'text-red-600 font-semibold' : 'text-gray-600'
                    }`}>
                        {urgencyLevel === 'critical' ? 
                            '🚨 Your session will expire immediately! Please extend now to avoid losing work.' :
                            'You\'ve been inactive for too long. Your session will automatically expire for security reasons.'
                        }
                    </p>
                </div>

                <div className="flex justify-center space-x-4">
                    <Button
                        type="primary"
                        size="large"
                        onClick={onExtendSession}
                        className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 px-8 py-2 h-auto font-semibold"
                        icon={<span className="mr-2">🔄</span>}
                    >
                        Stay Logged In
                    </Button>
                    <Button
                        size="large"
                        onClick={onLogout}
                        className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 px-8 py-2 h-auto font-semibold"
                        icon={<span className="mr-2">🚪</span>}
                    >
                        Logout Now
                    </Button>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                    💡 Tip: Any mouse movement or clicking will reset your session timer
                </div>
            </div>
        </Modal>
    );
};

export default SessionWarningModal;
