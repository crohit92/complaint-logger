import { Schema, model } from 'mongoose';
import { ComplaintStatus, UserTypes } from '@complaint-logger/models'
const ComplaintSchema = new Schema({
    createdBy: {
        loginId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        mobile: {
            type: String
        }
    },
    department: {
        name: String,
        code: String
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    building: {
        label: String
    },
    room: String,
    resolution: {
        description: {
            type: String,
        },
    },
    comments: [{
        by: String,
        userType: {
            type: Number,
            enum: [UserTypes.Hostler, UserTypes.Resident, UserTypes.Staff, UserTypes.Student, UserTypes.Admin, UserTypes.Technician],
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        description: String
    }],
    status: {
        type: Number,
        enum: [ComplaintStatus.Pending, ComplaintStatus.Resolved, ComplaintStatus.Done],
        default: ComplaintStatus.Pending
    },
    assignedTo: {
        loginId: String,
        name: String,
        mobile: String
    }
}, {
        timestamps: true
    });

export const Complaints = model('complaints', ComplaintSchema);
