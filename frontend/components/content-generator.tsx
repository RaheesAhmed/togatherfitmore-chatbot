'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import ReactMarkdown from 'react-markdown'

const usePublicUrl = process.env.NEXT_PUBLIC_URL

export default function ContentGenerator() {
    const [formData, setFormData] = useState({
        title_or_topic: '',
        keywords: '',
        tone: '',
        style: '',
        word_count: '',
        target_audience: ''
    })
    const [generatedContent, setGeneratedContent] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setGeneratedContent('')

        try {
            const response = await fetch(`${usePublicUrl}/api/generate-content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error('Failed to generate content')
            }

            const data = await response.json()
            setGeneratedContent(data.response)
        } catch (error) {
            console.error('Error:', error)
            setGeneratedContent('An error occurred while generating content. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>Content Generator</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title_or_topic">Title or Topic</Label>
                                <Input
                                    id="title_or_topic"
                                    name="title_or_topic"
                                    value={formData.title_or_topic}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                                <Input
                                    id="keywords"
                                    name="keywords"
                                    value={formData.keywords}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tone">Tone</Label>
                                <Select name="tone" onValueChange={(value) => handleSelectChange('tone', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select tone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="formal">Formal</SelectItem>
                                        <SelectItem value="casual">Casual</SelectItem>
                                        <SelectItem value="humorous">Humorous</SelectItem>
                                        <SelectItem value="serious">Serious</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="style">Style</Label>
                                <Select name="style" onValueChange={(value) => handleSelectChange('style', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="informative">Informative</SelectItem>
                                        <SelectItem value="persuasive">Persuasive</SelectItem>
                                        <SelectItem value="narrative">Narrative</SelectItem>
                                        <SelectItem value="descriptive">Descriptive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="word_count">Word Count</Label>
                                <Input
                                    id="word_count"
                                    name="word_count"
                                    type="number"
                                    value={formData.word_count}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="target_audience">Target Audience</Label>
                                <Input
                                    id="target_audience"
                                    name="target_audience"
                                    value={formData.target_audience}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                'Generate Content'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {generatedContent && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Generated Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose dark:prose-invert max-w-none">
                            <ReactMarkdown>{generatedContent}</ReactMarkdown>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}