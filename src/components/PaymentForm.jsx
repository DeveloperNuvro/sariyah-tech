// src/components/PaymentForm.jsx

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Loader2 } from "lucide-react";

const PAYMENT_METHODS = ['bkash', 'nagad', 'rocket'];

export const PaymentForm = ({
  handleSubmit,
  paymentDetails,
  setPaymentDetails,
  isLoading
}) => {
  const onChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const onSelectChange = (value) => {
    setPaymentDetails({ ...paymentDetails, paymentMethod: value });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Complete Your Purchase</h1>
      
      <Alert className="mb-8">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Instructions</AlertTitle>
        <AlertDescription>
          Please send payment to our merchant account **(01234567890)** and provide the **Transaction ID** and your phone number below for verification.
        </AlertDescription>
      </Alert>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select name="paymentMethod" value={paymentDetails.paymentMethod} onValueChange={onSelectChange} required>
            <SelectTrigger id="paymentMethod"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map(method => (
                <SelectItem key={method} value={method} className="capitalize">{method}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* --- NEW TRANSACTION ID FIELD --- */}
        <div className="space-y-2">
          <Label htmlFor="transactionId">Transaction ID (TrxID)</Label>
          <Input type="text" id="transactionId" name="transactionId" value={paymentDetails.transactionId} onChange={onChange} placeholder="e.g., 9J4K2L8M3N" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentNumber">Your Phone Number (from which you paid)</Label>
          <Input type="text" id="paymentNumber" name="paymentNumber" value={paymentDetails.paymentNumber} onChange={onChange} placeholder="e.g., 01712345678" required />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full py-6 text-lg">
          {isLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</>
          ) : (
            'Confirm Enrollment'
          )}
        </Button>
      </form>
    </div>
  );
};