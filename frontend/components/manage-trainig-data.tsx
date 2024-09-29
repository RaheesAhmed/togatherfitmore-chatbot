'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, FileText, Link, Mic, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const usePublicUrl = process.env.NEXT_PUBLIC_URL

interface TrainingData {
    id: string;
    name: {
        loc: {
            lines: {
                to: number;
                from: number;
            }
        };
        source: string;
    };
    type: string;
}

const ManageTrainingData = () => {
    const [trainingData, setTrainingData] = useState<TrainingData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const { toast } = useToast()

    const fetchFiles = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${usePublicUrl}/api/get-all-training`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            setTrainingData(data.response)
        } catch (err) {
            console.error('Error fetching files:', err)
            setError(`Failed to load training data: ${err instanceof Error ? err.message : String(err)}`)
            toast({
                title: "Error",
                description: `Failed to load training data: ${err instanceof Error ? err.message : String(err)}`,
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchFiles()
    }, [])

    const handleDelete = async (fileId: string) => {
        if (!fileId) {
            toast({
                title: "Error",
                description: "Invalid file ID",
                variant: "destructive",
            })
            return
        }

        try {
            setIsDeleting(true)
            const response = await fetch(`${usePublicUrl}/api/delete-training`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileId }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete file')
            }

            toast({
                title: "Success",
                description: data.message,
            })

            setTrainingData(prevData => prevData.filter(item => item.id !== fileId))
        } catch (err) {
            console.error('Error deleting file:', err)
            toast({
                title: "Error",
                description: `Failed to delete file: ${err instanceof Error ? err.message : String(err)}`,
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    const handleDeleteAll = async () => {
        if (trainingData.length === 0) {
            toast({
                title: "Info",
                description: "No files to delete",
            })
            return
        }

        try {
            setIsDeleting(true)
            const ids = trainingData.map(item => item.id)
            const response = await fetch(`${usePublicUrl}/api/delete-all-training`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete all files')
            }

            toast({
                title: "Success",
                description: data.message,
            })

            setTrainingData([])
        } catch (err) {
            console.error('Error deleting all files:', err)
            toast({
                title: "Error",
                description: `Failed to delete all files: ${err instanceof Error ? err.message : String(err)}`,
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    const getIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'file':
                return <FileText className="w-4 h-4" />
            case 'url':
                return <Link className="w-4 h-4" />
            case 'podcast':
                return <Mic className="w-4 h-4" />
            default:
                return <FileText className="w-4 h-4" />
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Manage Training Data</CardTitle>
                <CardDescription>View, categorize, and delete your training data</CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    onClick={handleDeleteAll}
                    className="mb-4"
                    variant="destructive"
                    disabled={isDeleting || trainingData.length === 0}
                >
                    {isDeleting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                        </>
                    ) : (
                        'Delete All'
                    )}
                </Button>
            </CardContent>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trainingData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center">
                                        {getIcon(item.type)}
                                        <span className="ml-2">{item.name.source}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(item.id)}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {trainingData.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                        No training data found.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default ManageTrainingData