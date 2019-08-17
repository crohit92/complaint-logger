import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { Complaint, ComplaintStatus } from '@complaint-logger/models'
import { Complaints } from "./complaints.model";
@Controller('complaints')
export class ComplaintsController {
    @Get('pending')
    async pendingComplaints(@Query('pageNumber') pageNumber: string, @Query('pageSize') pageSize: string) {
        return await Complaints.find({
            'resolution.status': ComplaintStatus.Pending
        }).sort({ createdAt: -1 }).skip(((+pageNumber) - 1) * (+pageSize)).limit(+pageSize);
    }

    @Get('count/pending')
    async pendingComplaintCount() {
        return await Complaints.count({
            'resolution.status': ComplaintStatus.Pending
        })
    }
    @Get('resolved')
    async resolvedComplaints(@Query('pageNumber') pageNumber: string, @Query('pageSize') pageSize: string) {
        return await Complaints.find({
            'resolution.status': ComplaintStatus.Resolved
        }).sort({ createdAt: -1 }).skip(((+pageNumber) - 1) * (+pageSize)).limit(+pageSize);
    }

    @Get('count/resolved')
    async resolvedComplaintCount() {
        return await Complaints.count({
            'resolution.status': ComplaintStatus.Resolved
        })
    }


    @Post()
    async createComplaint(@Body() complaint: Complaint) {
        const result = await Complaints.create(complaint);
        return result;

    }
}