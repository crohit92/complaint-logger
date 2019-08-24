import { Controller, Get, Post, Body, Query, Put, Param, Delete } from '@nestjs/common';
import { Complaint, ComplaintStatus } from '@complaint-logger/models'
import { Complaints } from "./complaints.model";
import { Comment } from "@complaint-logger/models";
@Controller('complaints')
export class ComplaintsController {
    @Get('pending')
    async pendingComplaints(@Query('pageNumber') pageNumber: string, @Query('pageSize') pageSize: string, @Query('raisedById') raisedById: string, @Query('departmentCode') departmentCode: string, @Query('assignedTo') assignedTo: string) {
        return await this.getComplaints(ComplaintStatus.Pending, raisedById, departmentCode, assignedTo, pageNumber, pageSize);
    }

    @Get('count/pending')
    async pendingComplaintCount(@Query('raisedById') raisedById: string, @Query('departmentCode') departmentCode: string, @Query('assignedTo') assignedTo: string, ) {
        return await this.getComplaintsCount(ComplaintStatus.Pending, raisedById, departmentCode, assignedTo);
    }

    @Get('resolved')
    async resolvedComplaints(@Query('pageNumber') pageNumber: string, @Query('pageSize') pageSize: string, @Query('raisedById') raisedById: string, @Query('departmentCode') departmentCode: string, @Query('assignedTo') assignedTo: string) {
        return await this.getComplaints(ComplaintStatus.Resolved, raisedById, departmentCode, assignedTo, pageNumber, pageSize);
    }

    @Get('count/resolved')
    async resolvedComplaintCount(@Query('raisedById') raisedById: string, @Query('departmentCode') departmentCode: string, @Query('assignedTo') assignedTo: string) {
        return await this.getComplaintsCount(ComplaintStatus.Resolved, raisedById, departmentCode, assignedTo);
    }
    @Get('done')
    async doneComplaints(@Query('pageNumber') pageNumber: string, @Query('pageSize') pageSize: string, @Query('raisedById') raisedById: string, @Query('departmentCode') departmentCode: string, @Query('assignedTo') assignedTo: string) {
        return await this.getComplaints(ComplaintStatus.Done, raisedById, departmentCode, assignedTo, pageNumber, pageSize);
    }

    @Get('count/done')
    async doneComplaintCount(@Query('raisedById') raisedById: string, @Query('departmentCode') departmentCode: string, @Query('assignedTo') assignedTo: string) {
        return await this.getComplaintsCount(ComplaintStatus.Done, raisedById, departmentCode, assignedTo);
    }

    @Get('delete')
    async deleteAllComplaints() {
        return await Complaints.remove({});
    }


    @Post()
    async createComplaint(@Body() complaint: Complaint) {
        const result = await Complaints.create(complaint);
        return result;

    }
    @Put(':id')
    async updateComplaint(@Param('id') id: string, @Body() complaint: Complaint) {
        const existingComplaint = await Complaints.findById(id);
        Object.assign(existingComplaint, complaint);
        return await existingComplaint.save();
    }
    @Put(':id/status')
    async updateComplaintStatus(@Param('id') id: string, @Query('status') status: ComplaintStatus) {
        const existingComplaint = await Complaints.findById(id);
        (existingComplaint as any).status = +status;
        return await existingComplaint.save();
    }


    @Post(':id/comments')
    async addComment(@Param('id') id: string, @Body() comment: Comment) {
        const existingComplaint = await Complaints.findById(id) as any;
        existingComplaint.comments = existingComplaint.comments || [];
        existingComplaint.comments.push(comment)
        return await existingComplaint.save();

    }

    private async getComplaints(
        status: ComplaintStatus,
        raisedById: string,
        departmentCode: string,
        assignedTo: string,
        pageNumber: string,
        pageSize: string
    ) {
        return await Complaints.find({
            'status': status,
            ...(raisedById ? { 'createdBy.loginId': raisedById } : {}),
            ...(departmentCode ? { 'department.code': departmentCode } : {}),
            ...(assignedTo ? { 'assignedTo.loginId': assignedTo } : {})
        }).sort({ createdAt: -1 }).skip(((+pageNumber) - 1) * (+pageSize)).limit(+pageSize);
    }
    private async getComplaintsCount(
        status: ComplaintStatus,
        raisedById: string,
        departmentCode: string,
        assignedTo: string
    ) {
        return await Complaints.count({
            'status': status,
            ...(raisedById ? { 'createdBy.loginId': raisedById } : {}),
            ...(departmentCode ? { 'department.code': departmentCode } : {}),
            ...(assignedTo ? { 'assignedTo.loginId': assignedTo } : {})
        })
    }
}