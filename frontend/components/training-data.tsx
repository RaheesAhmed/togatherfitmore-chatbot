'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Link, Mic } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usePublicUrl } from '@/lib/public_url'
const TrainingDataUpload = () => {
    const [fileUpload, setFileUpload] = useState<File | null>(null)
    const [url, setUrl] = useState('')
    const [podcastUrl, setPodcastUrl] = useState('')
    const [podcastFile, setPodcastFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isTrainingComplete, setIsTrainingComplete] = useState(false)
    const { toast } = useToast()

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        setFileUpload(file)
    }

    const handlePodcastFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        setPodcastFile(file)
    }

    const handleSubmit = async (type: 'file' | 'url' | 'podcast') => {
        setIsLoading(true)
        setIsTrainingComplete(false)
        try {
            if (type === 'file' && fileUpload) {
                const formData = new FormData()
                formData.append('file', fileUpload)

                const response = await fetch(`${usePublicUrl}/api/upload-training`, {
                    method: 'POST',
                    body: formData,
                })

                if (!response.ok) {
                    throw new Error('Failed to upload file')
                }

                toast({
                    title: "Success",
                    description: "File uploaded and processed successfully",
                })

                setIsTrainingComplete(true)
                setFileUpload(null)
            } else if (type === 'url') {
                const response = await fetch(`${usePublicUrl}/api/url`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url }),
                })

                if (!response.ok) {
                    throw new Error('Failed to process URL')
                }

                toast({
                    title: "Success",
                    description: "URL processed successfully",
                })

                setIsTrainingComplete(true)
                setUrl('')
            } else if (type === 'podcast') {
                const formData = new FormData()
                formData.append('file', podcastFile as Blob)

                const response = await fetch(`${usePublicUrl}/api/podcast`, {
                    method: 'POST',
                    body: formData,
                })

                if (!response.ok) {
                    throw new Error('Failed to process podcast')
                }

                toast({
                    title: "Success",
                    description: "Podcast processed successfully",
                })

                setIsTrainingComplete(true)
                setPodcastUrl('')
                setPodcastFile(null)


            }
        } catch (error) {
            console.error('Error uploading file:', error)
            toast({
                title: "Error",
                description: "Failed to upload and process file",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto mb-4">
            <CardHeader>
                <CardTitle>Upload Training Data</CardTitle>
                <CardDescription>Add new data to train your AI model</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="file" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="file">File Upload</TabsTrigger>
                        <TabsTrigger value="url">URL</TabsTrigger>
                        <TabsTrigger value="podcast">Podcast</TabsTrigger>
                    </TabsList>
                    <TabsContent value="file">
                        <div className="space-y-4">
                            <Label htmlFor="file-upload">Upload File (txt, doc, pptx, pdf)</Label>
                            <Input
                                id="file-upload"
                                type="file"
                                accept=".txt,.doc,.docx,.pptx,.pdf"
                                onChange={handleFileUpload}
                                className="cursor-pointer"
                                disabled={isLoading}
                            />
                            {fileUpload && <p className="text-sm text-muted-foreground">Selected file: {fileUpload.name}</p>}
                            <Button
                                onClick={() => handleSubmit('file')}
                                className="w-full"
                                disabled={!fileUpload || isLoading}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                {isLoading ? 'Uploading...' : 'Upload File'}
                            </Button>
                            {isTrainingComplete && (
                                <p className="text-sm text-green-600 font-semibold mt-2">
                                    Training completed successfully!
                                </p>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="url">
                        <div className="space-y-4">
                            <Label htmlFor="url-input">Enter URL</Label>
                            <Input
                                id="url-input"
                                type="url"
                                placeholder="https://example.com/data"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                disabled={isLoading}
                            />
                            <Button onClick={() => handleSubmit('url')} className="w-full" disabled={!url || isLoading}>
                                <Link className="w-4 h-4 mr-2" />
                                {isLoading ? 'Processing...' : 'Add URL'}
                            </Button>
                            {isTrainingComplete && (
                                <p className="text-sm text-green-600 font-semibold mt-2">
                                    URL processed successfully!
                                </p>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="podcast">
                        <div className="space-y-4">
                            <Label htmlFor="podcast-url">Podcast URL</Label>
                            <Input
                                id="podcast-url"
                                type="url"
                                placeholder="https://example.com/podcast.mp3"
                                value={podcastUrl}
                                onChange={(e) => setPodcastUrl(e.target.value)}
                            />
                            <div className="flex items-center">
                                <div className="flex-grow">
                                    <Label htmlFor="podcast-file" className="cursor-pointer">
                                        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg border-muted-foreground hover:border-primary transition-colors">
                                            <div className="text-center">
                                                <Mic className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">Click to upload podcast file (MP3)</span>
                                            </div>
                                        </div>
                                        <Input
                                            id="podcast-file"
                                            type="file"
                                            accept=".mp3"
                                            onChange={handlePodcastFileUpload}
                                            className="hidden"
                                            disabled={isLoading}
                                        />
                                    </Label>
                                </div>
                            </div>
                            {podcastFile && <p className="text-sm text-muted-foreground">Selected file: {podcastFile.name}</p>}
                            <Button
                                onClick={() => handleSubmit('podcast')}
                                className="w-full"
                                disabled={(!podcastUrl && !podcastFile) || isLoading}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Add Podcast
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

export default TrainingDataUpload