// src/pages/admin/PaymentManagementPage.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../features/orders/orderSlice';
import toast from 'react-hot-toast';

// Shadcn/UI Components & Icons
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, CheckCircle2, XCircle } from 'lucide-react';

const PaymentManagementPage = () => {
    const dispatch = useDispatch();
    const { allOrders, status } = useSelector((state) => state.orders);
    
    const [filter, setFilter] = useState('pending');
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    const handleApproveClick = (order) => {
        setSelectedOrder(order);
        setIsApproveDialogOpen(true);
    };

    const handleRejectClick = (order) => {
        setSelectedOrder(order);
        setIsRejectDialogOpen(true);
    };

    const confirmApprove = () => {
        if (!selectedOrder) return;
        // The approval logic is now simpler as we don't need to pass a transactionId
        dispatch(updateOrderStatus({ orderId: selectedOrder._id, paymentStatus: 'paid' }))
            .unwrap()
            .then(() => {
                toast.success('Payment approved! The student now has access.');
                setIsApproveDialogOpen(false);
            })
            .catch((err) => toast.error(`Failed to approve payment: ${err.message || 'Server error'}`));
    };
    
    const confirmReject = () => {
        if (!selectedOrder) return;
        dispatch(updateOrderStatus({ orderId: selectedOrder._id, paymentStatus: 'failed' }))
            .unwrap()
            .then(() => {
                toast.success('Payment marked as failed.');
                setIsRejectDialogOpen(false);
            })
            .catch((err) => toast.error(`Operation failed: ${err.message || 'Server error'}`));
    };

    const filteredOrders = allOrders.filter(order => filter === 'all' || order.paymentStatus === filter);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid': return <Badge variant="success">Paid</Badge>;
            case 'pending': return <Badge variant="warning">Pending</Badge>;
            case 'failed': return <Badge variant="destructive">Failed</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const renderTableContent = () => {
        if (status === 'loading') {
            return Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
            ));
        }

        if (filteredOrders.length === 0) {
            return (
                <TableRow><TableCell colSpan={6} className="h-24 text-center">No orders found.</TableCell></TableRow>
            );
        }

        return filteredOrders.map((order) => (
            <TableRow key={order._id}>
                <TableCell>
                    <div className="font-medium">{order.user.name}</div>
                    <div className="text-sm text-muted-foreground hidden sm:block">{order.user.email}</div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{order.course.title}</TableCell>
                <TableCell className="hidden md:table-cell font-mono">{order.paymentNumber}</TableCell>
                <TableCell className="hidden md:table-cell font-mono">{order.transactionId}</TableCell>
                <TableCell>{getStatusBadge(order.paymentStatus)}</TableCell>
                <TableCell className="text-right">
                    {order.paymentStatus === 'pending' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleApproveClick(order)}><CheckCircle2 className="mr-2 h-4 w-4" /> Approve</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRejectClick(order)} className="text-red-600"><XCircle className="mr-2 h-4 w-4" /> Reject</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight mb-4">Payment Management</h1>
            <Tabs value={filter} onValueChange={setFilter}>
                <TabsList>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="paid">Paid</TabsTrigger>
                    <TabsTrigger value="failed">Failed</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
                <TabsContent value={filter} className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Orders</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead className="hidden lg:table-cell">Course</TableHead>
                                        <TableHead className="hidden md:table-cell">Phone No.</TableHead>
                                        <TableHead className="hidden md:table-cell">TrxID</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>{renderTableContent()}</TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Approve Dialog (now a confirmation screen) */}
            <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Payment Approval</DialogTitle>
                        <DialogDescription>
                            Please verify the payment details below before approving. This will grant the student access to the course.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 text-sm">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Student:</span>
                            <span className="font-semibold">{selectedOrder?.user.name}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Course:</span>
                            <span className="font-semibold">{selectedOrder?.course.title}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Phone Number:</span>
                            <span className="font-mono">{selectedOrder?.paymentNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Transaction ID:</span>
                            <span className="font-mono">{selectedOrder?.transactionId}</span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>Cancel</Button>
                        <Button onClick={confirmApprove}>Confirm Approval</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Alert Dialog (unchanged) */}
            <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will mark the payment as failed. The user will not get access to the course.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmReject}>Yes, mark as failed</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
};

export default PaymentManagementPage;