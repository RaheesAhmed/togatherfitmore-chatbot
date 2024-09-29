"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import io, { Socket } from 'socket.io-client';
import QRCodeHead from './QRCodeHead';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Declare QRCode as a global variable
declare global {
    interface Window {
        QRCode: any;
    }
}

export default function WhatsAppQRCode() {
    const apiUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [qrCode, setQrCode] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const qrCodeRef = useRef<HTMLDivElement>(null);
    const [qrCodeLoaded, setQrCodeLoaded] = useState(false);

    useEffect(() => {
        // Load QRCode script dynamically
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
        script.async = true;
        script.onload = () => setQrCodeLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        fetchWhatsAppStatus();
        const newSocket = io(apiUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            withCredentials: true,
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected');
            setError(null);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setError(`Failed to connect to server: ${err.message}`);
        });

        newSocket.on('qr', (qr) => {
            console.log('QR code received', qr);
            setQrCode(qr);
            setIsConnected(false);
            if (qrCodeRef.current && qrCodeLoaded) {
                qrCodeRef.current.innerHTML = '';
                new window.QRCode(qrCodeRef.current, {
                    text: qr,
                    width: 256,
                    height: 256,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: window.QRCode.CorrectLevel.H
                });
            }
        });

        newSocket.on('ready', () => {
            console.log('WhatsApp client is ready');
            toast({
                title: 'WhatsApp Connected',
                description: 'Your WhatsApp is now connected!',
            });
            setQrCode('');
            setIsConnected(true);
        });

        newSocket.on('disconnected', () => {
            console.log('WhatsApp client disconnected');
            setIsConnected(false);
            setQrCode('');
        });

        return () => {
            if (newSocket) newSocket.close();
        };
    }, [apiUrl, qrCodeLoaded]);

    const fetchWhatsAppStatus = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/whatsapp-status`);
            if (!response.ok) throw new Error('Failed to fetch WhatsApp status');
            const data = await response.json();
            setIsEnabled(data.isEnabled);
            setIsConnected(data.isConnected);
        } catch (error) {
            console.error('Error fetching WhatsApp status:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch WhatsApp status',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleWhatsAppBot = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/whatsapp-toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ enable: !isEnabled }),
            });
            if (!response.ok) throw new Error('Failed to toggle WhatsApp bot');
            const data = await response.json();
            setIsEnabled(!isEnabled);
            toast({
                title: 'Success',
                description: data.message,
            });
            if (!isEnabled) {
                setQrCode('');
                setIsConnected(false);
            }
            await fetchWhatsAppStatus();
        } catch (error) {
            console.error('Error toggling WhatsApp bot:', error);
            toast({
                title: 'Error',
                description: 'Failed to toggle WhatsApp bot',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <QRCodeHead />
            <Card>

                <CardContent>
                    <div className="flex items-center justify-between p-6">
                        <span><FontAwesomeIcon icon={faCheckCircle} className='mr-2 text-green-500' />WhatsApp Bot Status</span>
                        <Switch
                            checked={isEnabled}
                            onCheckedChange={toggleWhatsAppBot}
                            disabled={isLoading}
                        />
                    </div>
                    <p className="mt-2">
                        Status: {isLoading ? 'Loading...' : (isEnabled ? <span className="text-green-500">Enabled</span> : <span className="text-red-500">Disabled</span>)}
                    </p>
                    {isEnabled && (
                        <p className="mt-2">
                            Connection Status: {isConnected ? <span className="text-green-500">Connected</span> : <span className="text-red-500">Disconnected</span>}
                        </p>
                    )}
                    {isEnabled && !isConnected && qrCode && qrCodeLoaded && (
                        <div className="mt-4">
                            <p>Scan the QR code to connect your WhatsApp:</p>
                            <p className='text-sm text-gray-500'>Please wait for the connection to be established it can take up to 1 minute</p>
                            <div ref={qrCodeRef} className="mt-2 flex justify-center"></div>
                        </div>
                    )}
                    {isEnabled && isConnected && (
                        <p className="mt-4 text-green-500">WhatsApp is connected and ready to use!</p>
                    )}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <Button
                        onClick={fetchWhatsAppStatus}
                        disabled={isLoading}
                        className="mt-4"
                    >
                        Refresh Status
                    </Button>
                </CardContent>
            </Card>
        </>
    );
}