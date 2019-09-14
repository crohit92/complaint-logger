import { Controller, Get, Post, Body, Query, Put, Param } from '@nestjs/common';
import { Complaint, ComplaintStatus, UserTypes, User } from '@complaint-logger/models'
import { Complaints } from "./complaints.model";
import { Comment } from "@complaint-logger/models";
import { users } from './users';
import { sms } from '../utils/sms';
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
        complaint.id = complaint.department.name.substr(0, 1) + Date.now();
        const result = await Complaints.create(complaint);
        /**
         * SMS to admin on creation of complaint
         */
        users.filter(u => u.department.code === complaint.department.code && u.type === UserTypes.Admin).forEach(u => {
            sms(u.mobile,
                `Complaint ID: ${result._id} Raised By: ${complaint.createdBy.name}\nComplaint Details: ${complaint.description}`);
        });
        return result;

    }
    @Put(':id/assign')
    async assignComplaint(@Param('id') id: string, @Body() technician: User) {
        const existingComplaint = await Complaints.findById(id) as Complaint;
        existingComplaint.assignedTo = technician;
        await existingComplaint.save();
        /**
         * SMS To creator of complaint 
         */
        sms(existingComplaint.createdBy.mobile,
            `Complaint ID: ${existingComplaint._id} Assigned To: ${technician.name}(${technician.mobile})`);
        /**
         * SMS to technician
         */
        sms(technician.mobile,
            `Complaint ID: ${existingComplaint._id} Raised by: ${existingComplaint.createdBy.name}(${existingComplaint.createdBy.mobile})\nhas been assigned to you\nDescription:${existingComplaint.description}`);
        return existingComplaint;
    }
    @Put(':id/status')
    async updateComplaintStatus(@Param('id') id: string, @Query('status') status: ComplaintStatus) {
        const existingComplaint = await Complaints.findById(id) as Complaint;
        if (+status === ComplaintStatus.Resolved && (existingComplaint as any).status === ComplaintStatus.Pending) {
            /**
             * SMS to the Creator ofthe complaint that complaint has been resolved
             */
            sms(existingComplaint.createdBy.mobile,
                `Complaint ID: ${existingComplaint._id} Resolved By: ${existingComplaint.assignedTo.name}`);
            /**
             * SMS to all the admins of the department that complaint has been resolved
             */
            users.filter((u) => u.type === UserTypes.Admin && u.department.code === existingComplaint.department.code).forEach(u => {
                sms(u.mobile,
                    `Complaint ID: ${existingComplaint._id} Rasised By:${existingComplaint.createdBy.name}, Resolved By: ${existingComplaint.assignedTo.name}`);
            })
        }
        if (+status === ComplaintStatus.Pending && (existingComplaint as any).status === ComplaintStatus.Resolved) {
            /**
             * SMS to the Technician about complaint reopend
             */
            sms(existingComplaint.assignedTo.mobile,
                `Complaint ID: ${existingComplaint._id} ReOpened by ${existingComplaint.createdBy.name}(${existingComplaint.createdBy.mobile})\nDescription:${existingComplaint.description}`);
            /**
             * SMS to all the admins of the department that complaint has been resolved
             */
            users.filter((u) => u.type === UserTypes.Admin && existingComplaint.department.code === u.department.code).forEach(u => {
                sms(u.mobile,
                    `Complaint ID: ${existingComplaint._id} ReOpened by ${existingComplaint.createdBy.name}(${existingComplaint.createdBy.mobile})\nDescription:${existingComplaint.description}`);
            })
        }
        (existingComplaint as any).status = +status;
        return await existingComplaint.save();
    }
    @Put(':id')
    async updateComplaint(@Param('id') id: string, @Body() complaint: Complaint) {
        const existingComplaint = await Complaints.findById(id);
        Object.assign(existingComplaint, complaint);
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
        department: string,
        assignedTo: string,
        pageNumber: string,
        pageSize: string
    ) {
        return await Complaints.find({
            'status': status,
            ...(raisedById ? { 'createdBy.loginId': raisedById } : {}),
            ...(department ? { 'department.name': department } : {}),
            ...(assignedTo ? { 'assignedTo.loginId': assignedTo } : {})
        }).sort({ createdAt: -1 }).skip(((+pageNumber) - 1) * (+pageSize)).limit(+pageSize);
    }
    private async getComplaintsCount(
        status: ComplaintStatus,
        raisedById: string,
        department: string,
        assignedTo: string
    ) {
        return await Complaints.count({
            'status': status,
            ...(raisedById ? { 'createdBy.loginId': raisedById } : {}),
            ...(department ? { 'department.name': department } : {}),
            ...(assignedTo ? { 'assignedTo.loginId': assignedTo } : {})
        })
    }
}