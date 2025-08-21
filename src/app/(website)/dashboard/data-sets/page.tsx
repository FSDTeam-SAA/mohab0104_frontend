"use client"

import { useState, useEffect } from "react"
import { Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { createDataSet, deleteDataSet, fetchAllPayments, fetchDataSets, updateDataSet } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

interface DataSet {
    _id: string
    userId: {
        _id: string
        companyName?: string
        firstName?: string
        lastName?: string
        email?: string
        imageLink?: string
    }
    dataSets: string
    dataSetName: string
    createdAt: string
    updatedAt: string
}

interface Payment {
    _id: string
    userId: {
        _id: string
        firstName: string
        lastName: string
        email: string
        companyName: string
    }
    serviceId: {
        serviceTitle: string
    }
    amount: number
    status: string
}

interface PaginationResponse {
    success: boolean
    message: string
    data: DataSet[]
    total: number
    page: number
    totalPages: number
}

export default function AdminDashboard() {
    const [dataSets, setDataSets] = useState<DataSet[]>([])
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [itemsPerPage] = useState(7) // Fixed items per page
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedDataSet, setSelectedDataSet] = useState<DataSet | null>(null)
    const [selectedUserId, setSelectedUserId] = useState("")
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [datasetName, setDatasetName] = useState<string>("")
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [datasetToDelete, setDatasetToDelete] = useState<string | null>(null)
    const [loadingEdit, setLoadingEdit] = useState(false)

    const loadData = async () => {
        try {
            setLoading(true)
            const response: PaginationResponse = await fetchDataSets(currentPage, itemsPerPage)
            if (response.success) {
                setDataSets(response.data)
                setTotalPages(response.totalPages)
                setTotalItems(response.total)
            }
        } catch (error) {
            console.error("Error loading datasets:", error)
        } finally {
            setLoading(false)
        }
    }

    const loadPayments = async () => {
        try {
            const response = await fetchAllPayments(1, 50)
            if (response.success) {
                setPayments(response.data)
            }
        } catch (error) {
            console.error("Error loading payments:", error)
        }
    }

    useEffect(() => {
        loadData()
        loadPayments()
    }, [currentPage])

    const handleCreateDataSet = async () => {
        if (!selectedUserId || !uploadedFile || !datasetName) return
        try {
            const formData = new FormData()
            formData.append("file", uploadedFile)
            formData.append("dataSetName", datasetName)
            await createDataSet(formData, selectedUserId)
            setIsCreateModalOpen(false)
            setSelectedUserId("")
            setUploadedFile(null)
            setDatasetName("")
            // Reset to first page after creating new dataset
            setCurrentPage(1)
            loadData()
        } catch (error) {
            console.error("Error creating dataset:", error)
        }
    }

    const handleEditDataSet = async () => {
        if (!selectedDataSet || (!uploadedFile && !selectedDataSet.dataSetName)) return
        setLoadingEdit(true)
        try {
            const formData = new FormData()
            if (uploadedFile) {
                formData.append("file", uploadedFile)
            }
            formData.append("dataSetName", selectedDataSet.dataSetName)
            await updateDataSet(selectedDataSet._id, formData)
            setIsEditModalOpen(false)
            setSelectedDataSet(null)
            setUploadedFile(null)
            loadData()
            setIsEditModalOpen(false)
        } catch (error) {
            console.error("Error updating dataset:", error)
            if (error instanceof Error) {
                toast.error(`Error: ${error.message}`)
            }
        } finally {
            setLoadingEdit(false)
        }
    }


    const handleDeleteDataSet = (id: string) => {
        setDatasetToDelete(id)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!datasetToDelete) return

        try {
            await deleteDataSet(datasetToDelete)
            if (dataSets.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1)
            } else {
                loadData()
            }
        } catch (error) {
            console.error("Error deleting dataset:", error)
        } finally {
            setIsDeleteDialogOpen(false)
            setDatasetToDelete(null)
        }
    }


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getUniqueUsers = () => {
        const users = payments.map((payment) => payment.userId)
        const uniqueUsers = users.filter((user, index, self) => index === self.findIndex((u) => u._id === user._id))
        return uniqueUsers
    }

    // Calculate pagination display info
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is less than or equal to max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Show pages around current page
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

            // Adjust start page if we're near the end
            if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1)
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i)
            }
        }

        return pages
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Data Set</h1>
                        <p className="text-gray-600">Dashboard &gt; Data Set</p>
                    </div>
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-cyan-500 hover:bg-cyan-600">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Data Set
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create New Dataset</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Dataset Name</Label>
                                        <Input type="text" id="name" value={datasetName} onChange={(e) => setDatasetName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company Name</Label>
                                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select the company" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getUniqueUsers().map((user) => (
                                                    <SelectItem key={user._id} value={user._id}>
                                                        {user?.companyName} ({user.email})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Upload Data Set</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <Input
                                            type="file"
                                            accept=".json"
                                            onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <Label htmlFor="file-upload" className="cursor-pointer">
                                            <div className="space-y-2">
                                                <div className="text-gray-500">Upload your JSON file</div>
                                            </div>
                                        </Label>
                                        {uploadedFile && <p className="mt-2 text-sm text-green-600">Selected: {uploadedFile.name}</p>}
                                    </div>
                                </div>
                                <Button onClick={handleCreateDataSet} className="w-full" disabled={!selectedUserId || !uploadedFile || !datasetName}>
                                    Create Dataset
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Data Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold">Data Set Name</TableHead>
                                    <TableHead className="font-semibold text-center">Company Name</TableHead>
                                    <TableHead className="font-semibold">User Info</TableHead>
                                    <TableHead className="font-semibold text-center">Added</TableHead>
                                    <TableHead className="font-semibold text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : dataSets.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">
                                            No datasets found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    dataSets.map((dataSet) => (
                                        <TableRow key={dataSet._id}>
                                            <TableCell>
                                                <span className="font-medium text-gray-900">{dataSet?.dataSetName}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-center">{dataSet?.userId?.companyName}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={dataSet?.userId?.imageLink || "/placeholder.svg"}
                                                            alt={dataSet?.userId?.firstName}
                                                        />
                                                        <AvatarFallback>{dataSet?.userId?.firstName?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">
                                                            {`${dataSet?.userId?.firstName || ""} ${dataSet?.userId?.lastName || ""}`.trim() ||
                                                                "Dataset"}
                                                        </div>
                                                        <div className="text-sm text-gray-500">{dataSet?.userId?.email || "Email address"}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-center">{formatDate(dataSet.createdAt)}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2 justify-center">
                                                    <Button variant="ghost" size="sm" onClick={() => window.open(dataSet.dataSets, "_blank")}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedDataSet(dataSet)
                                                            setIsEditModalOpen(true)
                                                        }}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteDataSet(dataSet._id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {!loading && totalItems > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-gray-600">
                            Showing {startItem} to {endItem} of {totalItems} results
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            {getPageNumbers().map((pageNum) => (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Dataset</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Dataset Name</Label>
                                <Input
                                    value={selectedDataSet?.dataSetName || ""}
                                    onChange={(e) =>
                                        selectedDataSet &&
                                        setSelectedDataSet({
                                            ...selectedDataSet,
                                            dataSetName: e.target.value,
                                            _id: selectedDataSet._id,
                                            userId: selectedDataSet.userId,
                                            dataSets: selectedDataSet.dataSets,
                                            createdAt: selectedDataSet.createdAt,
                                            updatedAt: selectedDataSet.updatedAt,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Upload New Data Set</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Input
                                        type="file"
                                        accept=".json"
                                        onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="edit-file-upload"
                                    />
                                    <Label htmlFor="edit-file-upload" className="cursor-pointer">
                                        <div className="">
                                            <div className="text-gray-500 py-4">Click & Upload your JSON file</div>
                                        </div>
                                    </Label>
                                    {uploadedFile && <p className="mt-2 text-sm text-green-600">Selected: {uploadedFile.name}</p>}
                                </div>
                            </div>
                            <Button onClick={handleEditDataSet} className="w-full" disabled={!selectedDataSet?.dataSetName && !uploadedFile}>
                                {loadingEdit ? <div className="flex items-center gap-2"><Loader className="w-4 h-4 animate-spin" /> Updating</div> : "Update Dataset"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete Modal */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Dataset</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this dataset? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
