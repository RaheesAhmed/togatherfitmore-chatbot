'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, MessageCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    memory?: string;
}

export default function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [messages])

    const handleSendMessage = async () => {
        if (inputMessage.trim() === '' || isLoading) return

        const newUserMessage: Message = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
        }

        setMessages((prevMessages) => [...prevMessages, newUserMessage])
        setInputMessage('')
        setIsLoading(true)

        try {
            const usePublicUrl = process.env.NEXT_PUBLIC_URL
            const response = await fetch(`${usePublicUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputMessage }),
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json()
            const botResponse: Message = {
                id: Date.now() + 1,
                text: data.response,
                sender: 'bot',
                memory: data.memory ? 'Memory updated' : undefined,
            }

            setMessages((prevMessages) => [...prevMessages, botResponse])
        } catch (error) {
            console.error('Error:', error)
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: 'Sorry, there was an error processing your request.',
                sender: 'bot',
            }
            setMessages((prevMessages) => [...prevMessages, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-20 right-4 z-50"
                    >
                        <Card className="w-96 h-[calc(100vh-120px)] max-h-[600px] flex flex-col shadow-lg rounded-xl overflow-hidden">
                            <CardHeader className="bg-primary text-primary-foreground py-4 flex flex-row items-center justify-between">
                                <CardTitle className="text-xl font-bold flex items-center">
                                    <Bot className="w-6 h-6 mr-2" />
                                    AI Chat Assistant
                                </CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-primary-foreground">
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="flex-grow overflow-hidden p-0">
                                <ScrollArea className="h-full px-4" ref={scrollAreaRef}>
                                    <div className="space-y-4 pb-4 pt-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`flex items-end max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarFallback>
                                                            {message.sender === 'user' ? 'U' : 'B'}
                                                        </AvatarFallback>
                                                        <AvatarImage src={message.sender === 'user' ? '/user-avatar.png' : '/bot-avatar.png'} />
                                                    </Avatar>
                                                    <div
                                                        className={`mx-2 p-3 rounded-2xl text-sm ${message.sender === 'user'
                                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                                            : 'bg-secondary text-secondary-foreground rounded-bl-none'
                                                            }`}
                                                    >
                                                        {message.text}
                                                        {message.memory && (
                                                            <div className="mt-2 text-xs opacity-70">
                                                                {message.memory}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex justify-start">
                                                <div className="flex items-center bg-secondary text-secondary-foreground rounded-2xl p-3 text-sm">
                                                    <div className="animate-pulse flex space-x-2">
                                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                            <div className="p-4 bg-background">
                                <div className="flex items-center bg-secondary rounded-lg p-2">
                                    <Input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSendMessage()
                                            }
                                        }}
                                        className="flex-grow border-none bg-transparent focus:ring-0"
                                        disabled={isLoading}
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 ml-2"
                                        disabled={isLoading}
                                    >
                                        <Send className="w-4 h-4" />
                                        <span className="sr-only">Send message</span>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                initial={false}
                animate={isOpen ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-4 right-4 z-50"
            >
                <Button
                    className="rounded-full w-12 h-12 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <MessageCircle className="h-6 w-6" />
                    <span className="sr-only">Toggle chat</span>
                </Button>
            </motion.div>
        </>
    )
}