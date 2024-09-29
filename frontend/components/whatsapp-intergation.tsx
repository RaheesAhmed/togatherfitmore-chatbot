"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Script from 'next/script'
import { usePublicUrl } from '@/lib/public_url'
import WhatsAppQRCode from './whatsapp-qrcode'


const publicUrl = usePublicUrl

const WhatsAppSettings = () => {
    const [isEnabled, setIsEnabled] = useState(false)
    const [prompt, setPrompt] = useState('')
    const [connectionStatus, setConnectionStatus] = useState('Disconnected')




    const handleSave = async () => {
        try {
            const response = await fetch(`${usePublicUrl}/api/whatsapp-instructions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ instructions: prompt }),
            });
            if (!response.ok) {
                throw new Error('Failed to set WhatsApp instructions');
            }
            alert('WhatsApp settings saved successfully');
        } catch (error) {
            console.error('Error saving WhatsApp settings:', error);
            alert(`Failed to save WhatsApp settings: ${error.message}`);
        }
    };

    return (
        <>
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>WhatsApp Settings</CardTitle>
                    <CardDescription>Configure your WhatsApp integration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    <div className="space-y-2">
                        <Label htmlFor="whatsapp-prompt">WhatsApp Instructions</Label>
                        <Textarea
                            id="whatsapp-prompt"
                            placeholder="Enter the instructions for your WhatsApp bot"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                        />
                    </div>
                    {isEnabled && !prompt && (
                        <Alert variant="warning">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Attention</AlertTitle>
                            <AlertDescription>
                                Please enter instructions for your WhatsApp bot to function properly.
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">WhatsApp Connection Status</h3>
                        <p id="status">{connectionStatus}</p>
                        <div id="qrcode" className="flex justify-center"></div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave} className="w-full">
                        Save WhatsApp Settings
                    </Button>
                </CardFooter>

            </Card>
            <Card className="w-full max-w-2xl mx-auto mt-4">
                <CardHeader>
                    <CardTitle>WhatsApp QR Code</CardTitle>
                    <CardDescription>Scan the QR code to connect to WhatsApp Kinldy wait for the connection to be established</CardDescription>
                </CardHeader>
                <CardContent>
                    <WhatsAppQRCode />
                </CardContent>
            </Card>

            <Script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.4/socket.io.js" strategy="beforeInteractive" />
            <Script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js" strategy="beforeInteractive" />
            <Script src="/whatsapp-client.js" strategy="afterInteractive" />
        </>
    )
}

export default WhatsAppSettings