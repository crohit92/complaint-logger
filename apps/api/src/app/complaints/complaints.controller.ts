import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { Complaint } from '@complaint-logger/models'
import { Complaints } from "./complaints.model";
@Controller('complaints')
export class ComplaintsController {
    @Get()
    async getAllComplaints(@Query('pageNumber') pageNumber: string, @Query('pageSize') pageSize: string) {
        return await Complaints.find().sort({ createdAt: -1 }).skip(((+pageNumber) - 1) * (+pageSize)).limit(+pageSize);
    }

    @Post()
    async createComplaint(@Body() complaint: Complaint) {
        const result = await Complaints.create(complaint);
        return result;

    }
}