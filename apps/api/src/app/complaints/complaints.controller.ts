import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Put,
  Param,
  Req
} from '@nestjs/common';
import {
  Complaint,
  ComplaintStatus,
  UserTypes,
  User
} from '@complaint-logger/models';
import { Complaints } from './complaints.model';
import { Comment } from '@complaint-logger/models';
import { users } from './users';
import { sms } from '../utils/sms';
import * as moment from 'moment';
import { UsersController } from '../users/users.controller';
@Controller('complaints')
export class ComplaintsController {
  @Get('pending')
  async pendingComplaints(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Req() req: any
  ) {
    return await this.getComplaints(
      ComplaintStatus.Pending,
      req,
      pageNumber,
      pageSize
    );
  }

  @Get('count/pending')
  async pendingComplaintCount(@Req() req) {
    return await this.getComplaintsCount(ComplaintStatus.Pending, req);
  }

  @Get('resolved')
  async resolvedComplaints(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Req() req: any
  ) {
    return await this.getComplaints(
      ComplaintStatus.Resolved,
      req,
      pageNumber,
      pageSize
    );
  }

  @Get('count/resolved')
  async resolvedComplaintCount(@Req() req) {
    return await this.getComplaintsCount(ComplaintStatus.Resolved, req);
  }
  @Get('done')
  async doneComplaints(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Req() req: any
  ) {
    return await this.getComplaints(
      ComplaintStatus.Done,
      req,
      pageNumber,
      pageSize
    );
  }

  @Get('count/done')
  async doneComplaintCount(@Req() req) {
    return await this.getComplaintsCount(ComplaintStatus.Done, req);
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
    sms(
      complaint.createdBy.mobile,
      `Dear ${
        complaint.createdBy.name
      }, your complaint has been  received and will be attended shortly, your Complaint id is :${
        complaint.id
      }, received on ${moment(complaint.createdAt).format(
        'DD-MM-YYYY hh:mm A'
      )}`
    );
    new UsersController().getUsersOfType(
      'A',
      complaint.department.name,
      /.*/,
      (err, admins) => {
        (admins || []).forEach(a =>
          sms(
            a.mobile,
            `Dear Admin, Complaint id: ${
              complaint.id
            } has been received on ${moment(complaint.createdAt).format(
              'DD-MM-YYYY hh:mm A'
            )} for ${complaint.complaintType} ,  from ${
              complaint.createdBy.name
            }, Mobno:${complaint.createdBy.mobile} , Department: ${
              complaint.building
            } Location: ${complaint.room}, Desc: ${complaint.description}`
          )
        );
      }
    );

    return result;
  }
  @Put(':id/assign')
  async assignComplaint(@Param('id') id: string, @Body() technician: User) {
    const existingComplaint = (await Complaints.findById(id)) as Complaint;
    existingComplaint.assignedAt = new Date();
    existingComplaint.assignedTo = technician;
    await existingComplaint.save();
    /**
     * SMS To creator of complaint
     */
    sms(
      existingComplaint.createdBy.mobile,
      `Dear ${existingComplaint.createdBy.name}, Your Complaint Id: ${
        existingComplaint.id
      }, with Desc: ${existingComplaint.description}  has been marked to ${
        technician.name
      }, ${technician.mobile}, Will be Attended Shortly`
    );
    /**
     * SMS to technician
     */
    sms(
      technician.mobile,
      `Dear ${technician.name} , Complaint id:${
        existingComplaint.id
      } has been marked to you on ${moment(existingComplaint.updatedAt).format(
        'DD-MM-YYYY hh:mm A'
      )}, Raised By: ${existingComplaint.createdBy.name}, Mobno: ${
        existingComplaint.createdBy.mobile
      }, Department:${existingComplaint.building}, Location: ${
        existingComplaint.room
      } , Desc: ${existingComplaint.description}`
    );
    return existingComplaint;
  }
  @Put(':id/status')
  async updateComplaintStatus(
    @Param('id') id: string,
    @Query('status') status: ComplaintStatus
  ) {
    const existingComplaint = (await Complaints.findById(id)) as Complaint;
    if (
      +status === ComplaintStatus.Resolved &&
      (existingComplaint as any).status === ComplaintStatus.Pending
    ) {
      existingComplaint.resolvedAt = new Date();
      /**
       * SMS to the Creator ofthe complaint that complaint has been resolved
       */
      sms(
        existingComplaint.createdBy.mobile,
        `Dear ${existingComplaint.createdBy.name} , Your Complaint ID:${
          existingComplaint.id
        } has been Attended by: ${existingComplaint.assignedTo.name} Mobile: ${
          existingComplaint.assignedTo.mobile
        }. If Satisfied, please CLOSE the Complaint from you login ,Thanks`
      );
      /**
       * SMS to all the admins of the department that complaint has been resolved
       */
      new UsersController().getUsersOfType(
        'A',
        existingComplaint.department.name,
        /.*/,
        (err, admins) => {
          (admins || []).forEach(a =>
            sms(
              a.mobile,
              `Dear Admin, Complaint ID: ${
                existingComplaint.id
              } has been Attended  by: ${
                existingComplaint.assignedTo.name
              } , Mobile: ${existingComplaint.assignedTo.mobile}`
            )
          );
        }
      );
    }
    if (
      +status === ComplaintStatus.Pending &&
      (existingComplaint as any).status === ComplaintStatus.Resolved
    ) {
      existingComplaint.reopendAt = new Date();
      /**
       * SMS to the Technician about complaint reopend
       */
      sms(
        existingComplaint.assignedTo.mobile,
        `Complaint ID: ${existingComplaint._id} ReOpened by ${
          existingComplaint.createdBy.name
        }(${existingComplaint.createdBy.mobile})\nDescription:${
          existingComplaint.description
        }`
      );
      /**
       * SMS to all the admins of the department that complaint has been resolved
       */
      new UsersController().getUsersOfType(
        'A',
        existingComplaint.department.name,
        /.*/,
        (err, admins) => {
          (admins || []).forEach(a =>
            sms(
              a.mobile,
              `Complaint ID: ${existingComplaint._id} ReOpened by ${
                existingComplaint.createdBy.name
              }(${existingComplaint.createdBy.mobile})\nDescription:${
                existingComplaint.description
              }`
            )
          );
        }
      );
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
    const existingComplaint = (await Complaints.findById(id)) as any;
    existingComplaint.comments = existingComplaint.comments || [];
    existingComplaint.comments.push(comment);
    return await existingComplaint.save();
  }

  private async getComplaints(
    status: ComplaintStatus,
    req,
    pageNumber: string,
    pageSize: string
  ) {
    const me = req.me as User;
    const query = this.buildQueryBasedOnRole(me);
    if (req.query) {
      const filter = req.query;
      if (filter.from && filter.to) {
        query.createdAt = {
          $gte: new Date(filter.from),
          $lte: new Date(filter.to)
        };
      }
    }
    return await Complaints.find({
      status: status,
      ...query
    })
      .sort({ createdAt: -1 })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize);
  }
  private async getComplaintsCount(status: ComplaintStatus, req: any) {
    const me = req.me as User;
    const searchQuery = this.buildQueryBasedOnRole(me);
    if (req.query) {
      const query = req.query;
      if (query.from && query.to) {
        searchQuery.createdAt = {
          $gte: new Date(query.from),
          $lte: new Date(query.to)
        };
      }
    }
    return await Complaints.count({
      status: status,
      ...searchQuery
    });
  }

  private buildQueryBasedOnRole(me: User) {
    let query: any = {};
    if (me.type === UserTypes.SuperAdmin) {
      return query;
    }
    if (me.type === UserTypes.Admin || me.type === UserTypes.Technician) {
      query = { 'department.name': me.department.name };
      if (me.type === UserTypes.Technician) {
        query['assignedTo.loginId'] = me.loginId;
      }
    } else {
      query['createdBy.loginId'] = me.loginId;
    }
    return query;
  }
}
