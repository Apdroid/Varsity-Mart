'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { usePendingKYC, useVerifyKYC, useRejectKYC } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export default function KYCPage() {
  const [page, setPage] = useState(1);
  const [selectedKYC, setSelectedKYC] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const { data: kyc, isLoading } = usePendingKYC(page, 10);
  const verifyKYC = useVerifyKYC();
  const rejectKYC = useRejectKYC();

  const handleVerify = async (id: number) => {
    await verifyKYC.mutateAsync(id);
  };

  const handleReject = async () => {
    if (selectedKYC && rejectReason.trim()) {
      await rejectKYC.mutateAsync({ id: selectedKYC.id, reason: rejectReason });
      setShowRejectDialog(false);
      setRejectReason('');
      setSelectedKYC(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">KYC Verification</h1>
          <p className="text-muted-foreground mt-1">Review and manage user KYC submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Pending Verifications</p>
            <p className="text-2xl font-bold mt-2">{kyc?.total || 0}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Verified Today</p>
            <p className="text-2xl font-bold mt-2">12</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="text-2xl font-bold mt-2">3</p>
          </Card>
        </div>

        {/* KYC Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>User Name</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(6)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : kyc?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No pending KYC verifications
                  </TableCell>
                </TableRow>
              ) : (
                kyc?.data.map((kycItem) => (
                  <TableRow key={kycItem.id}>
                    <TableCell className="font-medium">{kycItem.userName}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">
                        {kycItem.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {kycItem.documents.map((doc: string) => (
                          <Badge key={doc} variant="outline">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {kycItem.submitDate}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {kycItem.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 bg-transparent"
                          onClick={() => setSelectedKYC(kycItem)}
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          className="gap-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleVerify(kycItem.id)}
                          disabled={verifyKYC.isPending}
                        >
                          <CheckCircle className="h-3 w-3" />
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => {
                            setSelectedKYC(kycItem);
                            setShowRejectDialog(true);
                          }}
                          disabled={rejectKYC.isPending}
                        >
                          <XCircle className="h-3 w-3" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing page {page} of {kyc?.pages || 1}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(kyc?.pages || 1, page + 1))}
              disabled={page === kyc?.pages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reject KYC Verification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">User: {selectedKYC?.userName}</p>
              </div>
              <div>
                <label htmlFor="reason" className="text-sm font-medium">
                  Rejection Reason
                </label>
                <Textarea
                  id="reason"
                  placeholder="Enter the reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleReject}
                disabled={!rejectReason.trim() || rejectKYC.isPending}
              >
                Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View KYC Dialog */}
        <Dialog open={!!selectedKYC && !showRejectDialog} onOpenChange={() => setSelectedKYC(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>KYC Details</DialogTitle>
            </DialogHeader>
            {selectedKYC && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">User Name</p>
                  <p className="font-medium">{selectedKYC.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User Type</p>
                  <Badge className="bg-blue-100 text-blue-800">{selectedKYC.type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Documents Submitted</p>
                  <div className="flex gap-1 flex-wrap mt-2">
                    {selectedKYC.documents.map((doc: string) => (
                      <Badge key={doc} variant="outline">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted Date</p>
                  <p className="font-medium">{selectedKYC.submitDate}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedKYC(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
