'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faComments, faDatabase, faMicrophoneAlt, faPenFancy,
    faBrain, faPlug, faChartBar, faSlidersH, faCog,
} from '@fortawesome/free-solid-svg-icons'

import ChatInterface from "@/components/chat-interface"
import TrainingDataUpload from "@/components/training-data"
import ManageTrainingData from "@/components/manage-trainig-data"
import WhatsAppSettings from "@/components/whatsapp-intergation"
import Settings from '@/components/seetings'
import ContentGenerator from '@/components/content-generator'
import FineTuning from '@/components/finetune'
import APIMetricsDashboard from '@/components/api-metrics-dashboard';

const navItems = [
    { id: 'api-metrics', icon: faChartBar, label: 'API Metrics' },
    { id: 'chat', icon: faComments, label: 'Chat' },
    { id: 'training-data', icon: faDatabase, label: 'Training Data' },
    { id: 'whatsapp', icon: faComments, label: 'WhatsApp' },
    { id: 'voice-cloning', icon: faMicrophoneAlt, label: 'Voice Cloning' },
    { id: 'content-tools', icon: faPenFancy, label: 'Content Tools' },
    { id: 'integrations', icon: faPlug, label: 'Integrations' },
    { id: 'analytics', icon: faChartBar, label: 'Analytics' },
    { id: 'fine-tuning', icon: faSlidersH, label: 'Fine-tuning' },
    { id: 'settings', icon: faCog, label: 'Settings' },
]

export default function Dashboard() {
    const [activePage, setActivePage] = useState('api-metrics')

    return (
        <div className="flex h-screen bg-background text-foreground">
            <div className="w-sidebar-width bg-bg-darker p-8 overflow-y-auto">
                <div className="text-2xl font-bold mb-8">Dashboard</div>
                <nav>
                    {navItems.map((item) => (
                        <div
                            key={item.id}
                            className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out ${activePage === item.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                                }`}
                            onClick={() => setActivePage(item.id)}
                        >
                            <FontAwesomeIcon icon={item.icon} className="mr-3" />
                            {item.label}
                        </div>
                    ))}
                </nav>
            </div>
            <div className="flex-grow p-8 overflow-y-auto">
                {activePage === 'api-metrics' && (
                    <APIMetricsDashboard />
                )}
                {activePage === 'chat' && (
                    <ChatInterface />
                )}
                {activePage === 'training-data' && (
                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl font-bold mb-6">
                            <FontAwesomeIcon icon={faDatabase} className="mr-3" />
                            Training Data
                        </h1>
                        <TrainingDataUpload />
                        <ManageTrainingData />
                    </div>
                )}
                {activePage === 'whatsapp' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">
                            <FontAwesomeIcon icon={faComments} className="mr-3" />
                            WhatsApp Integration
                        </h1>
                        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md mb-6">
                            <WhatsAppSettings />
                        </div>
                    </div>
                )}
                {activePage === 'content-tools' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">
                            <FontAwesomeIcon icon={faPenFancy} className="mr-3" />
                            Content Tools
                        </h1>
                        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md mb-6">
                            <ContentGenerator />
                        </div>
                    </div>
                )}

                {activePage === 'settings' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">
                            <FontAwesomeIcon icon={faCog} className="mr-3" />
                            Settings
                        </h1>
                        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md mb-6">
                            <Settings />
                        </div>
                    </div>
                )}
                {activePage === 'voice-cloning' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">
                            <FontAwesomeIcon icon={faMicrophoneAlt} className="mr-3" />
                            Voice Cloning
                        </h1>
                        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md mb-6">
                            <p>Voice cloning feature coming soon...</p>
                        </div>
                    </div>
                )}
                {activePage === 'integrations' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">
                            <FontAwesomeIcon icon={faPlug} className="mr-3" />
                            Integrations
                        </h1>
                        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md mb-6">
                            <p>Integrations feature coming soon...</p>
                        </div>
                    </div>
                )}
                {activePage === 'analytics' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">
                            <FontAwesomeIcon icon={faChartBar} className="mr-3" />
                            Analytics
                        </h1>
                        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md mb-6">
                            <p>Analytics feature coming soon...</p>
                        </div>
                    </div>
                )}
                {activePage === 'fine-tuning' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">
                            <FontAwesomeIcon icon={faSlidersH} className="mr-3" />
                            Fine-tuning
                        </h1>
                        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md mb-6">
                            <FineTuning />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}