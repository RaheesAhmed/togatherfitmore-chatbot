'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

const Settings = () => {
    const [instructions, setInstructions] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const { toast } = useToast()
    const apiUrl = process.env.NEXT_PUBLIC_URL || '';

    const handleSave = async () => {
        if (!instructions) {
            setMessage("Please provide AI instructions.")
            return
        }

        setIsLoading(true)
        setMessage('')
        try {
            console.log('Sending request to:', `${apiUrl}/api/set-system-instruction`);
            const response = await fetch(`${apiUrl}/api/set-system-instruction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ instruction: instructions }),
            })

            const data = await response.json()
            console.log('Response data:', data);

            if (response.ok) {
                console.log('Save successful');
                setMessage("System instruction set successfully")
                setInstructions('') // Clear the textbox
            } else {
                throw new Error(data.error || 'Failed to set system instruction')
            }

        } catch (error) {
            console.error('Error saving settings:', error);
            let errorMessage = "Failed to save settings. Please try again.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setMessage(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure your AI assistant for Website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="instructions">AI Instructions</Label>
                    <Textarea
                        id="instructions"
                        placeholder="Enter instructions for your AI assistant"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        rows={4}
                    />
                </div>

                {(!instructions) && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Attention</AlertTitle>
                        <AlertDescription>
                            Please provide AI instructions for the assistant to function properly.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter className="flex flex-col items-stretch">
                <Button onClick={handleSave} className="w-full" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Settings'}
                </Button>
                {message && (
                    <p className={`mt-2 text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
            </CardFooter>
        </Card>
    )
}

export default Settings