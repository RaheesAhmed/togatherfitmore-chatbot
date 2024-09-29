'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { ArrowRight, Bot, FileText, Podcast, Zap, MessageSquare, Cpu, Wifi, Upload, Trash2, Download, FileAudio, Globe, RefreshCw } from 'lucide-react'

export default function Home() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username && password) {
      router.push('/dashboard')
    } else {
      alert('Please enter both username and password')
    }
  }

  const features = [
    { icon: Bot, title: "AI Chat", description: "Engage in intelligent conversations with our advanced AI model" },
    { icon: FileText, title: "Document Processing", description: "Upload and analyze documents with ease" },
    { icon: Podcast, title: "Podcast Transcription", description: "Automatically transcribe and summarize podcasts" },
    { icon: Zap, title: "Content Generation", description: "Create high-quality content tailored to your needs" },
    { icon: MessageSquare, title: "WhatsApp Integration", description: "Seamlessly interact with the AI through WhatsApp" },
    { icon: Cpu, title: "Fine-Tuning", description: "Improve AI model performance with custom training" },
    { icon: Wifi, title: "Real-Time Communication", description: "Utilize WebSocket and Socket.IO for instant updates" },
    { icon: Globe, title: "URL Processing", description: "Extract and analyze content from web pages" },
  ]

  const capabilities = [
    { icon: Upload, text: "Upload and process various file formats (PDFs, audio, etc.)" },
    { icon: Bot, text: "Generate human-like responses to complex queries" },
    { icon: FileAudio, text: "Transcribe and summarize podcast episodes" },
    { icon: Zap, text: "Create custom content based on specific requirements" },
    { icon: MessageSquare, text: "Integrate with WhatsApp for seamless communication" },
    { icon: Cpu, text: "Perform fine-tuning to improve AI model performance" },
    { icon: Download, text: "Download and process Spotify podcasts" },
    { icon: RefreshCw, text: "Real-time updates and notifications via WebSocket" },
    { icon: Globe, text: "Process and analyze content from URLs" },
    { icon: Trash2, text: "Manage and delete training data as needed" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text animate-gradient">FitMore AI Assistant</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90">Admin Login</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Admin Login</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 border-primary focus:ring-2 focus:ring-primary"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-primary focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Login</Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <main className="container mx-auto py-12">
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">Your Advanced AI Assistant</h2>
          <p className="text-xl text-muted-foreground mb-8">Empowering your workflow with cutting-edge AI solutions</p>

        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
              <feature.icon className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="bg-muted p-8 rounded-lg mb-16">
          <h2 className="text-3xl font-bold mb-6">What Our AI Can Do</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {capabilities.map((capability, index) => (
              <div key={index} className="flex items-center space-x-3">
                <capability.icon className="w-6 h-6 text-primary" />
                <span>{capability.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Advanced Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Fine-Tuning</h3>
              <p className="mb-4">Enhance the AI model's performance with custom training data. Our fine-tuning process allows you to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Upload your own training data</li>
                <li>Create fine-tuning jobs</li>
                <li>Monitor job status</li>
                <li>Improve AI responses for your specific use case</li>
              </ul>
            </div>
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">WhatsApp Integration</h3>
              <p className="mb-4">Interact with the AI assistant directly through WhatsApp. Features include:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Enable/disable WhatsApp bot</li>
                <li>Set custom instructions for WhatsApp interactions</li>
                <li>Real-time message processing</li>
                <li>Seamless integration with your existing WhatsApp workflow</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-muted p-8 rounded-lg mb-16">
          <h2 className="text-3xl font-bold mb-6">Technical Highlights</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Real-Time Communication</h3>
              <p>Our application leverages WebSocket and Socket.IO technologies to provide real-time updates and notifications, ensuring you always have the latest information at your fingertips.</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Robust Backend</h3>
              <p>Built on Express.js, our backend provides a wide range of API endpoints for file uploads, podcast processing, URL analysis, and more, giving you full control over the AI assistant's capabilities.</p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Revolutionize Your Workflow?</h2>
          <p className="text-xl text-muted-foreground mb-8">Experience the power of advanced AI-assisted productivity today</p>

        </section>
      </main>

      <footer className="bg-muted mt-16 py-8">
        <div className="container mx-auto text-center text-muted-foreground">
          © 2024 FitMore. All rights reserved.
        </div>
      </footer>
    </div>
  )
}