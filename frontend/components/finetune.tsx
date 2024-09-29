'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const usePublicUrl = process.env.NEXT_PUBLIC_URL

interface FineTuningJob {
    id: string;
    status: string;
    model: string;
    created_at: string;
}

const availableModels = [
    "gpt-4o-2024-08-06",
    "gpt-4o-mini-2024-07-18",
    "gpt-4-0613",
    "gpt-3.5-turbo-0125",
    "gpt-3.5-turbo-1106",
    "gpt-3.5-turbo-0613",
    "babbage-002",
    "davinci-002"
]

export default function FineTuning() {
    const [model, setModel] = useState('')
    const [trainingFile, setTrainingFile] = useState<File | null>(null)
    const [validationFile, setValidationFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [jobId, setJobId] = useState('')
    const [jobStatus, setJobStatus] = useState<FineTuningJob | null>(null)
    const [preparedFileContent, setPreparedFileContent] = useState('')
    const [preparationFile, setPreparationFile] = useState<File | null>(null)

    const handlePrepareTraining = async () => {
        if (!preparationFile) {
            setError('Please select a file to prepare')
            return
        }

        setIsLoading(true)
        setError('')
        setPreparedFileContent('')

        const formData = new FormData()
        formData.append('file', preparationFile)

        try {
            const response = await fetch(`${usePublicUrl}/api/prepare-training`, {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to prepare training file')
            }

            const data = await response.json()
            setPreparedFileContent(data.generatedFile)
        } catch (error) {
            setError('An error occurred while preparing the training file')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        const formData = new FormData()
        formData.append('model', model)
        if (trainingFile) formData.append('training_file', trainingFile)
        if (validationFile) formData.append('validation_file', validationFile)

        try {
            const response = await fetch(`${usePublicUrl}/api/finetune`, {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to start fine-tuning job')
            }

            const data = await response.json()
            setJobId(data.response.id)
        } catch (error) {
            setError('An error occurred while starting the fine-tuning job')
        } finally {
            setIsLoading(false)
        }
    }

    const checkJobStatus = async () => {
        if (!jobId) return

        try {
            const response = await fetch(`${usePublicUrl}/api/finetune-status`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ job_id: jobId }),
            })

            if (!response.ok) {
                throw new Error('Failed to fetch job status')
            }

            const data = await response.json()
            setJobStatus(data.response)
        } catch (error) {
            setError('An error occurred while fetching the job status')
        }
    }

    useEffect(() => {
        if (jobId) {
            const interval = setInterval(checkJobStatus, 5000) // Check every 5 seconds
            return () => clearInterval(interval)
        }
    }, [jobId])

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Prepare Training File</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="preparation-file">Upload File for Preparation</Label>
                            <Input
                                id="preparation-file"
                                type="file"
                                onChange={(e) => setPreparationFile(e.target.files?.[0] || null)}
                            />
                        </div>
                        <Button onClick={handlePrepareTraining} disabled={isLoading || !preparationFile}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Preparing...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Prepare Training File
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {preparedFileContent && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Prepared Training File Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={preparedFileContent}
                            readOnly
                            className="h-40"
                        />
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Fine-Tuning</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="model">Model</Label>
                            <Select value={model} onValueChange={setModel}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableModels.map((modelOption) => (
                                        <SelectItem key={modelOption} value={modelOption}>
                                            {modelOption}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="training-file">Training File</Label>
                            <Input
                                id="training-file"
                                type="file"
                                onChange={(e) => setTrainingFile(e.target.files?.[0] || null)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="validation-file">Validation File (Optional)</Label>
                            <Input
                                id="validation-file"
                                type="file"
                                onChange={(e) => setValidationFile(e.target.files?.[0] || null)}
                            />
                        </div>
                        <Button type="submit" disabled={isLoading || !model || !trainingFile} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Starting Fine-Tuning...
                                </>
                            ) : (
                                'Start Fine-Tuning'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {error && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {jobStatus && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Job Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p><strong>Job ID:</strong> {jobStatus.id}</p>
                            <p><strong>Status:</strong> {jobStatus.status}</p>
                            <p><strong>Model:</strong> {jobStatus.model}</p>
                            <p><strong>Created At:</strong> {new Date(jobStatus.created_at).toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}