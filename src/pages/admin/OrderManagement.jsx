import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getAllOrdersAdmin,
  deleteOrderAdmin,
  getOrderByIdAdmin,
  updateOrderAdmin
} from '../../features/admin/adminSlice';
import { 
  ShoppingCart, 
  Search, 
  MoreHorizontal, 
  Eye, 
  User,
  BookOpen,
  Calendar,
  Sparkles,
  DollarSign,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Trash2,
  Save,
  X,
  Hash,
  Receipt,
  Smartphone
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Animation variants
const animationVariants = {
  container: { 
    hidden: { opacity: 0 }, 
    show: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.2 
      } 
    } 
  },
  fadeInUp: { 
    hidden: { y: 30, opacity: 0 }, 
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    } 
  }
};

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, ordersTotal, ordersPage, ordersPages, status, selectedOrder: selectedOrderData } = useSelector((state) => state.admin);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    paymentMethod: '',
    paymentNumber: '',
    transactionId: '',
    amount: '',
    paymentStatus: ''
  });

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      ...(searchTerm && { search: searchTerm }),
      ...(statusFilter && { status: statusFilter })
    };
    dispatch(getAllOrdersAdmin(params));
  }, [dispatch, currentPage, searchTerm, statusFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value === 'all' ? '' : value);
    setCurrentPage(1);
  };

  const handleViewOrderDetails = async (orderId) => {
    try {
      await dispatch(getOrderByIdAdmin(orderId)).unwrap();
      setSelectedOrder(orderId);
      setIsOrderDetailsOpen(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  const handleEditOrder = (order) => {
    setEditFormData({
      paymentMethod: order.paymentMethod || '',
      paymentNumber: order.paymentNumber || '',
      transactionId: order.transactionId || '',
      amount: order.amount || '',
      paymentStatus: order.paymentStatus || ''
    });
    setSelectedOrder(order._id);
    setIsEditDialogOpen(true);
  };

  const handleUpdateOrder = async () => {
    try {
      await dispatch(updateOrderAdmin({ 
        orderId: selectedOrder, 
        orderData: editFormData 
      })).unwrap();
      setIsEditDialogOpen(false);
      // Refresh orders list
      dispatch(getAllOrdersAdmin({ 
        page: currentPage, 
        limit: 10, 
        status: statusFilter 
      }));
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await dispatch(deleteOrderAdmin(orderId)).unwrap();
      // Refresh orders list
      dispatch(getAllOrdersAdmin({ 
        page: currentPage, 
        limit: 10, 
        status: statusFilter 
      }));
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  const getStatusBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" />Paid</Badge>;
      case 'pending':
        return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white flex items-center gap-1 w-fit"><Clock className="w-3 h-3" />Pending</Badge>;
      case 'failed':
        return <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" />Failed</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{paymentStatus}</Badge>;
    }
  };

  const getStatusIcon = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-500" />;
    }
  };

  if (status === 'loading' && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          variants={animationVariants.fadeInUp}
          initial="hidden"
          animate="show"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Order Management
            </h1>
            <p className="text-gray-600 text-lg">
              Manage all course orders and transactions
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={animationVariants.container}
          initial="hidden"
          animate="show"
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{ordersTotal}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter(order => order.paymentStatus === 'paid').length}
                  </p>
                  <p className="text-sm text-gray-600">Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter(order => order.paymentStatus === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter(order => order.paymentStatus === 'failed').length}
                  </p>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="mb-8"
          variants={animationVariants.fadeInUp}
          initial="hidden"
          animate="show"
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search orders by student name or course..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <Select value={statusFilter || 'all'} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Status</SelectItem>
                    <SelectItem value="paid" className="text-gray-900 hover:bg-gray-100">Paid</SelectItem>
                    <SelectItem value="pending" className="text-gray-900 hover:bg-gray-100">Pending</SelectItem>
                    <SelectItem value="failed" className="text-gray-900 hover:bg-gray-100">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders Table */}
        <motion.div variants={animationVariants.fadeInUp}>
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-gray-200/50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Sparkles className="w-5 h-5 text-green-600" />
                Orders ({ordersTotal})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <AnimatePresence>
                      {orders.map((order, index) => (
                        <motion.tr
                          key={order._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {order.user?.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{order.user?.name}</p>
                                <p className="text-sm text-gray-600">{order.user?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-purple-500" />
                              <span className="text-gray-900">{order.course?.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-green-500" />
                              <span className="font-medium text-gray-900">৳{order.amount}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(order.paymentStatus)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <CreditCard className="w-4 h-4 text-blue-500" />
                              <span className="text-gray-900">{order.paymentMethod || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewOrderDetails(order._id)}
                                className="border-blue-200 hover:bg-blue-50 text-blue-600"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditOrder(order)}
                                className="border-green-200 hover:bg-green-50 text-green-600"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-200 hover:bg-red-50 text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Order</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this order? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteOrder(order._id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pagination */}
        {ordersPages > 1 && (
          <motion.div 
            className="flex justify-center mt-8"
            variants={animationVariants.fadeInUp}
            initial="hidden"
            animate="show"
          >
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-2 border-green-400/20 hover:bg-green-400/10"
              >
                Previous
              </Button>
              <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                Page {currentPage} of {ordersPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, ordersPages))}
                disabled={currentPage === ordersPages}
                className="border-2 border-green-400/20 hover:bg-green-400/10"
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}

        {/* Order Details Dialog */}
        <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl">
            <DialogHeader className="pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">Order Details</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Complete information about this order
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            {selectedOrderData && (
              <div className="py-6 space-y-6">
                {/* Order Information */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-gray-200">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Hash className="w-5 h-5 text-cyan-600" />
                      Order Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Order ID</label>
                        <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg border">
                          {selectedOrderData._id}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Transaction ID</label>
                        <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg border">
                          {selectedOrderData.transactionId || 'N/A'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Order Date</label>
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                          {selectedOrderData.createdAt ? 
                            new Date(selectedOrderData.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-gray-200">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Payment Method</label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                            {selectedOrderData.paymentMethod?.toUpperCase() || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Payment Number</label>
                        <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg border">
                          {selectedOrderData.paymentNumber || 'N/A'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Amount</label>
                        <p className="text-lg font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                          ৳{selectedOrderData.amount || '0'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <div className="mt-1">
                          {getStatusBadge(selectedOrderData.paymentStatus)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Course Information */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-200">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      Course Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img 
                        src={selectedOrderData.course?.thumbnail} 
                        alt={selectedOrderData.course?.title}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border"
                      />
                      <div className="flex-1 space-y-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {selectedOrderData.course?.title || 'N/A'}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <img 
                              src={selectedOrderData.course?.instructor?.avatar} 
                              alt={selectedOrderData.course?.instructor?.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Instructor:</span> {selectedOrderData.course?.instructor?.name || 'N/A'}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Category:</span> {selectedOrderData.course?.category?.name || 'N/A'}
                        </p>
                        <div className="flex items-center gap-2">
                          {selectedOrderData.course?.discountPrice && 
                           selectedOrderData.course?.discountPrice < selectedOrderData.course?.price ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-green-600">৳{selectedOrderData.course?.discountPrice}</span>
                              <span className="text-sm text-gray-500 line-through">৳{selectedOrderData.course?.price}</span>
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                Save ৳{selectedOrderData.course?.price - selectedOrderData.course?.discountPrice}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">৳{selectedOrderData.course?.price || '0'}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Slip */}
                {selectedOrderData.paymentSlip && (
                  <Card className="bg-white border border-gray-200">
                    <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-gray-200">
                      <CardTitle className="flex items-center gap-2 text-gray-900">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        Payment Slip
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="relative group">
                          <img 
                            src={selectedOrderData.paymentSlip} 
                            alt="Payment Slip"
                            className="w-full max-w-md mx-auto rounded-lg border shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-300"
                            onClick={() => window.open(selectedOrderData.paymentSlip, '_blank')}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
                              Click to view full size
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                          Payment confirmation screenshot uploaded by student
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Student Information */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-gray-200">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <User className="w-5 h-5 text-orange-600" />
                      Student Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-200">
                        {selectedOrderData.user?.avatar ? (
                          <img 
                            src={selectedOrderData.user?.avatar} 
                            alt={selectedOrderData.user?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold text-lg">
                            {selectedOrderData.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {selectedOrderData.user?.name || 'N/A'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span> {selectedOrderData.user?.email || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Role:</span> 
                          <span className="ml-1 bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                            {selectedOrderData.user?.role?.charAt(0).toUpperCase() + selectedOrderData.user?.role?.slice(1) || 'N/A'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Order Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl bg-white border-0 shadow-2xl">
            <DialogHeader className="pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Edit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">Edit Order Details</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Update payment information and order status
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className="py-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-gray-200">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <CreditCard className="w-5 h-5 text-cyan-600" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={(e) => { e.preventDefault(); handleUpdateOrder(); }} className="space-y-6">
                    {/* Payment Method & Status Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700">
                          Payment Method *
                        </Label>
                        <Select 
                          value={editFormData.paymentMethod} 
                          onValueChange={(value) => setEditFormData({...editFormData, paymentMethod: value})}
                        >
                          <SelectTrigger className="border border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg h-10">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                            <SelectItem value="bkash" className="hover:bg-gray-50">Bkash</SelectItem>
                            <SelectItem value="nagad" className="hover:bg-gray-50">Nagad</SelectItem>
                            <SelectItem value="rocket" className="hover:bg-gray-50">Rocket</SelectItem>
                            <SelectItem value="cellfin" className="hover:bg-gray-50">Cellfin</SelectItem>
                            <SelectItem value="free" className="hover:bg-gray-50">Free</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="paymentStatus" className="text-sm font-medium text-gray-700">
                          Payment Status *
                        </Label>
                        <Select 
                          value={editFormData.paymentStatus} 
                          onValueChange={(value) => setEditFormData({...editFormData, paymentStatus: value})}
                        >
                          <SelectTrigger className="border border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg h-10">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                            <SelectItem value="pending" className="hover:bg-gray-50">Pending</SelectItem>
                            <SelectItem value="paid" className="hover:bg-gray-50">Paid</SelectItem>
                            <SelectItem value="failed" className="hover:bg-gray-50">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Payment Number & Amount Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="paymentNumber" className="text-sm font-medium text-gray-700">
                          Payment Number
                        </Label>
                        <Input
                          id="paymentNumber"
                          type="tel"
                          value={editFormData.paymentNumber}
                          onChange={(e) => setEditFormData({...editFormData, paymentNumber: e.target.value})}
                          placeholder="Enter payment number"
                          className="border border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg h-10"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                          Amount (৳)
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          value={editFormData.amount}
                          onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})}
                          placeholder="Enter amount"
                          className="border border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg h-10"
                        />
                      </div>
                    </div>

                    {/* Transaction ID */}
                    <div className="space-y-2">
                      <Label htmlFor="transactionId" className="text-sm font-medium text-gray-700">
                        Transaction ID
                      </Label>
                      <Input
                        id="transactionId"
                        value={editFormData.transactionId}
                        onChange={(e) => setEditFormData({...editFormData, transactionId: e.target.value})}
                        placeholder="Enter transaction ID"
                        className="border border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg h-10"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => setIsEditDialogOpen(false)}
                        className="border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg h-10 px-6"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg h-10 px-6"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default OrderManagement;
