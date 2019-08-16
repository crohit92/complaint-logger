import { Controller, Get, Post, Body } from '@nestjs/common';
import { Complaint } from '@complaint-logger/models'
import { Complaints } from "./complaints.model";
@Controller('complaints')
export class ComplaintsController {
    @Get()
    getAllComplaints() {

    }

    @Post()
    async createComplaint(@Body() complaint: Complaint) {
        try {
            const result = await Complaints.create(complaint);
            return result;

        } catch (error) {
            return error;
        }
    }
}