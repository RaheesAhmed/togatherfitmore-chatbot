'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot } from "lucide-react"

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

const usePublicUrl = process.env.NEXT_PUBLIC_URL

const ChatInterface = () => {
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
            const response = await fetch(`${usePublicUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputMessage }),
            })

            if (!response.ok) {
                throw new Error('Failed to get response from the chat API')
            }

            const data = await response.json()
            const botResponse: Message = {
                id: Date.now() + 1,
                text: data.response,
                sender: 'bot',
                memory: data.memory ? 'Memory updated' : undefined, // Simplify memory display
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
        <div className="flex justify-center items-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-2xl h-[600px] flex flex-col shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-primary text-primary-foreground py-4">
                    <CardTitle className="text-2xl font-bold flex items-center justify-center">
                        <Bot className="w-6 h-6 mr-2" />
                        AI Chat Assistant
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full p-4">
                    <ScrollArea className="flex-grow mb-4 pr-4" ref={scrollAreaRef}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                            >
                                <div
                                    className={`flex items-end max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
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
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="flex items-center bg-secondary text-secondary-foreground rounded-2xl p-3 text-sm">
                                    <div className="animate-pulse flex space-x-2">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
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
                </CardContent>
            </Card>
        </div>
    )
}

export default ChatInterface