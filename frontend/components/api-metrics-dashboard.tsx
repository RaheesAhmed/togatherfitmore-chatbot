"use client"

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface Metrics {
    totalRequests: number;
    activeUsers: number;
    overallErrorRate: number;
    peakConcurrentRequests: number;
    endpointUsage: Record<string, number>;
    avgResponseTimes: Record<string, number>;
    contentGenerationCount: number;
    podcastProcessingCount: number;
    whatsAppMessageCount: number;
    finetuningJobsCreated: number;
    averageContentGenerationTime: number;
    averagePodcastProcessingTime: number;
    trainingDataUploads: number;
    totalTrainingDataSize: number;
}

const MetricCard = ({ title, value }: { title: string; value: string | number }) => (
    <Card className="w-full">
        <CardContent className="p-3 lg:p-4">
            <h3 className="font-bold text-sm lg:text-base mb-1 lg:mb-2">{title}</h3>
            <p className="text-lg lg:text-xl font-semibold">{value}</p>
        </CardContent>
    </Card>
);

export default function ApiMetricsDashboard() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchMetrics = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/api/metrics`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setMetrics(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching metrics:', error);
            setError('Failed to fetch metrics. Please try again later.');
        }
    };

    useEffect(() => {
        fetchMetrics();
        const intervalId = setInterval(fetchMetrics, 30000); // Update every 30 seconds
        return () => clearInterval(intervalId);
    }, []);

    if (error) return <div className="text-red-500 p-4">{error}</div>;
    if (!metrics) return <div className="p-4">Loading metrics...</div>;

    const endpointUsageData = Object.entries(metrics.endpointUsage || {}).map(([name, count]) => ({ name, count }));
    const responseTimeData = Object.entries(metrics.avgResponseTimes || {}).map(([name, time]) => ({ name, time }));

    const featureUsageData = [
        { name: 'Content Generation', value: metrics.contentGenerationCount || 0 },
        { name: 'Podcast Processing', value: metrics.podcastProcessingCount || 0 },
        { name: 'WhatsApp Messages', value: metrics.whatsAppMessageCount || 0 },
        { name: 'Fine-tuning Jobs', value: metrics.finetuningJobsCreated || 0 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="space-y-4 p-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <MetricCard title="Total Requests" value={metrics.totalRequests || 0} />
                <MetricCard title="Active Users" value={metrics.activeUsers || 0} />
                <MetricCard title="Error Rate" value={`${(metrics.overallErrorRate || 0).toFixed(2)}%`} />
                <MetricCard title="Peak Concurrent Requests" value={metrics.peakConcurrentRequests || 0} />
            </div>

            <Card>
                <CardContent className="p-2 lg:p-4">
                    <h3 className="font-bold text-base lg:text-lg mb-2 lg:mb-4">Endpoint Usage</h3>
                    <div className="h-60 lg:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={endpointUsageData}>
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                <Bar dataKey="count" fill="var(--primary)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-2 lg:p-4">
                    <h3 className="font-bold text-base lg:text-lg mb-2 lg:mb-4">Average Response Times</h3>
                    <div className="h-60 lg:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={responseTimeData}>
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                <Line type="monotone" dataKey="time" stroke="var(--primary)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-2 lg:p-4">
                        <h3 className="font-bold text-base lg:text-lg mb-2 lg:mb-4">Feature Usage</h3>
                        <div className="h-60 lg:h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={featureUsageData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius="80%"
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {featureUsageData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-2 lg:p-4">
                        <h3 className="font-bold text-base lg:text-lg mb-2 lg:mb-4">Performance Metrics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <MetricCard
                                title="Avg Content Generation Time"
                                value={`${(metrics.averageContentGenerationTime || 0).toFixed(2)}ms`}
                            />
                            <MetricCard
                                title="Avg Podcast Processing Time"
                                value={`${(metrics.averagePodcastProcessingTime || 0).toFixed(2)}ms`}
                            />
                            <MetricCard
                                title="Training Data Uploads"
                                value={metrics.trainingDataUploads || 0}
                            />
                            <MetricCard
                                title="Total Training Data Size"
                                value={`${((metrics.totalTrainingDataSize || 0) / (1024 * 1024)).toFixed(2)} MB`}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}