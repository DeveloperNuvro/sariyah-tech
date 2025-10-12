// src/pages/admin/CategoryManagementPage.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories, createCategory, deleteCategory } from '../../features/categories/categorySlice';
import toast from 'react-hot-toast';

// Shadcn UI Components & Icons
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Trash2, Tag, PlusCircle } from 'lucide-react';

const CategoryManagementPage = () => {
    const dispatch = useDispatch();
    const { categories, status } = useSelector((state) => state.categories);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    useEffect(() => {
        dispatch(fetchAllCategories());
    }, [dispatch]);

    const handleCreate = (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            toast.error("Category name cannot be empty.");
            return;
        }
        dispatch(createCategory({ name: newCategoryName }))
            .unwrap()
            .then(() => {
                toast.success("Category created successfully!");
                setNewCategoryName('');
            })
            .catch(err => toast.error(`Failed to create category: ${err.message || 'Server error'}`));
    };

    const openDeleteDialog = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedCategoryId) return;
        dispatch(deleteCategory(selectedCategoryId))
            .unwrap()
            .then(() => toast.success("Category deleted."))
            .catch(err => toast.error(`Failed to delete category: ${err.message || 'Server error'}`));
        setIsDeleteDialogOpen(false);
    };

    const renderTableContent = () => {
        if (status === 'loading') {
            return Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-9 w-9" /></TableCell>
                </TableRow>
            ));
        }
        if (categories.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        No categories found. Use the form above to create one.
                    </TableCell>
                </TableRow>
            );
        }
        return categories.map(category => (
            <TableRow key={category._id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{category.slug}</TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(category._id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Manage Course Categories</h1>
                <p className="text-muted-foreground">Add, view, and remove course categories.</p>
            </div>

            {/* Create Category Form */}
            <Card className="mb-8 bg-muted border">
                <CardHeader>
                    <CardTitle>Create New Category</CardTitle>
                    <CardDescription>Enter a name to create a new category for your courses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="flex flex-col sm:flex-row items-start gap-4">
                        <Input
                            type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="e.g., Web Development, Data Science"
                            className="flex-grow" aria-label="New category name"
                        />
                        <Button type="submit" disabled={status === 'loading' && newCategoryName}>
                            {status === 'loading' && newCategoryName ?
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> :
                                <><PlusCircle className="mr-2 h-4 w-4" /> Create Category</>
                            }
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Existing Categories List */}
            <Card>
                <CardHeader><CardTitle>Existing Categories</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {renderTableContent()}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Deleting this category might affect courses that are currently using it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
};

export default CategoryManagementPage;