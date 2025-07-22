import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Card, Statistic, Progress, Row, Col, Badge, Tooltip } from 'antd';
import { 
    UserOutlined, 
    ProjectOutlined, 
    TrophyOutlined,
    BulbOutlined,
    BookOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

const DataOverview = () => {
    const { portfolioData } = useSelector(state => state.root);
    const [stats, setStats] = useState({});
    const [completionRate, setCompletionRate] = useState(0);

    const calculateSectionCompletion = (section, requiredFields) => {
        if (!section) return { completion: 0, filled: 0, total: requiredFields.length };
        
        const filledFields = requiredFields.filter(field => {
            const value = section[field];
            return value && value !== '' && value !== null && value !== undefined;
        }).length;
        
        return {
            completion: Math.round((filledFields / requiredFields.length) * 100),
            filled: filledFields,
            total: requiredFields.length
        };
    };

    const calculateStats = useCallback(() => {
        const data = portfolioData;
        
        // Calculate completion rates for each section
        const sections = {
            introduction: calculateSectionCompletion(data?.introduction, [
                'firstName', 'lastName', 'welcomeText', 'jobTitle', 'description', 'profileImage'
            ]),
            about: calculateSectionCompletion(data?.about, [
                'description', 'skills', 'experience'
            ]),
            experiences: {
                count: data?.experiences?.length || 0,
                completion: data?.experiences?.length > 0 ? 100 : 0
            },
            projects: {
                count: data?.projects?.length || 0,
                completion: data?.projects?.length > 0 ? 100 : 0
            },
            education: {
                count: data?.education?.length || 0,
                completion: data?.education?.length > 0 ? 100 : 0
            },
            certificates: {
                count: data?.certificates?.length || 0,
                completion: data?.certificates?.length > 0 ? 100 : 0
            },
            skills: {
                count: data?.skills?.length || 0,
                completion: data?.skills?.length > 0 ? 100 : 0
            }
        };

        // Calculate overall completion
        const totalSections = Object.keys(sections).length;
        const totalCompletion = Object.values(sections).reduce((sum, section) => {
            return sum + (section.completion || 0);
        }, 0);
        
        setCompletionRate(Math.round(totalCompletion / totalSections));
        setStats(sections);
    }, [portfolioData]);

    useEffect(() => {
        if (portfolioData) {
            calculateStats();
        }
    }, [portfolioData, calculateStats]);

    const getStatusColor = (completion) => {
        if (completion >= 80) return '#52c41a';
        if (completion >= 50) return '#faad14';
        return '#ff4d4f';
    };

    const getStatusIcon = (completion) => {
        if (completion >= 80) return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
        if (completion >= 50) return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
    };

    return (
        <div className="space-y-6">
            {/* Overall Stats Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Portfolio Data Overview</h2>
                        <p className="text-gray-600">Complete overview of your portfolio data and completion status</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">{completionRate}%</div>
                        <div className="text-sm text-gray-500">Overall Complete</div>
                    </div>
                </div>
                
                {/* Overall Progress Bar */}
                <div className="mt-4">
                    <Progress 
                        percent={completionRate} 
                        strokeColor={{
                            '0%': '#108ee9',
                            '50%': '#87d068',
                            '100%': '#52c41a',
                        }}
                        className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Portfolio Completion Status</span>
                        <span>Target: 100%</span>
                    </div>
                </div>
            </div>

            {/* Section Statistics */}
            <Row gutter={[16, 16]}>
                {/* Introduction Section */}
                <Col xs={24} sm={12} lg={8}>
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <UserOutlined className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Introduction</h3>
                                    <p className="text-xs text-gray-500">Personal details</p>
                                </div>
                            </div>
                            {getStatusIcon(stats.introduction?.completion || 0)}
                        </div>
                        <Progress 
                            percent={stats.introduction?.completion || 0}
                            size="small"
                            strokeColor={getStatusColor(stats.introduction?.completion || 0)}
                        />
                        <div className="mt-2 text-xs text-gray-500">
                            {stats.introduction?.filled || 0} of {stats.introduction?.total || 6} fields completed
                        </div>
                    </Card>
                </Col>

                {/* Projects Section */}
                <Col xs={24} sm={12} lg={8}>
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <ProjectOutlined className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Projects</h3>
                                    <p className="text-xs text-gray-500">Portfolio showcase</p>
                                </div>
                            </div>
                            <Badge count={stats.projects?.count || 0} showZero color="#52c41a" />
                        </div>
                        <Statistic 
                            value={stats.projects?.count || 0} 
                            suffix="Projects"
                            valueStyle={{ fontSize: '20px', color: '#52c41a' }}
                        />
                    </Card>
                </Col>

                {/* Experience Section */}
                <Col xs={24} sm={12} lg={8}>
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <BulbOutlined className="text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Experience</h3>
                                    <p className="text-xs text-gray-500">Work history</p>
                                </div>
                            </div>
                            <Badge count={stats.experiences?.count || 0} showZero color="#722ed1" />
                        </div>
                        <Statistic 
                            value={stats.experiences?.count || 0} 
                            suffix="Positions"
                            valueStyle={{ fontSize: '20px', color: '#722ed1' }}
                        />
                    </Card>
                </Col>

                {/* Education Section */}
                <Col xs={24} sm={12} lg={8}>
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <BookOutlined className="text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Education</h3>
                                    <p className="text-xs text-gray-500">Academic background</p>
                                </div>
                            </div>
                            <Badge count={stats.education?.count || 0} showZero color="#fa8c16" />
                        </div>
                        <Statistic 
                            value={stats.education?.count || 0} 
                            suffix="Degrees"
                            valueStyle={{ fontSize: '20px', color: '#fa8c16' }}
                        />
                    </Card>
                </Col>

                {/* Certificates Section */}
                <Col xs={24} sm={12} lg={8}>
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <TrophyOutlined className="text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Certificates</h3>
                                    <p className="text-xs text-gray-500">Achievements</p>
                                </div>
                            </div>
                            <Badge count={stats.certificates?.count || 0} showZero color="#fadb14" />
                        </div>
                        <Statistic 
                            value={stats.certificates?.count || 0} 
                            suffix="Certificates"
                            valueStyle={{ fontSize: '20px', color: '#fadb14' }}
                        />
                    </Card>
                </Col>

                {/* Skills Section */}
                <Col xs={24} sm={12} lg={8}>
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <FileTextOutlined className="text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Skills</h3>
                                    <p className="text-xs text-gray-500">Technical abilities</p>
                                </div>
                            </div>
                            <Badge count={stats.skills?.count || 0} showZero color="#f5222d" />
                        </div>
                        <Statistic 
                            value={stats.skills?.count || 0} 
                            suffix="Skills"
                            valueStyle={{ fontSize: '20px', color: '#f5222d' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Tooltip title="Add new project to showcase">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer text-center">
                            <ProjectOutlined className="text-2xl text-blue-600 mb-2" />
                            <div className="text-sm font-medium">Add Project</div>
                        </div>
                    </Tooltip>
                    <Tooltip title="Update work experience">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-400 transition-colors cursor-pointer text-center">
                            <BulbOutlined className="text-2xl text-purple-600 mb-2" />
                            <div className="text-sm font-medium">Add Experience</div>
                        </div>
                    </Tooltip>
                    <Tooltip title="Add education details">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-400 transition-colors cursor-pointer text-center">
                            <BookOutlined className="text-2xl text-orange-600 mb-2" />
                            <div className="text-sm font-medium">Add Education</div>
                        </div>
                    </Tooltip>
                    <Tooltip title="Upload certificates">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-yellow-400 transition-colors cursor-pointer text-center">
                            <TrophyOutlined className="text-2xl text-yellow-600 mb-2" />
                            <div className="text-sm font-medium">Add Certificate</div>
                        </div>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default DataOverview;