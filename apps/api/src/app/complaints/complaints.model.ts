import { Schema, model, Document } from 'mongoose';
import { ComplaintStatus, UserTypes, Complaint } from '@complaint-logger/models'
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
        },
        type: {
            type: Number
        }
    },
    id: { type: String, required: true },
    department: {
        name: String,
        code: Number
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    building: {
        type: String,
        required: true
    },
    complaintType: {
        type: String
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
            enum: [UserTypes.Department, UserTypes.Employee, UserTypes.Student, UserTypes.Admin, UserTypes.Technician],
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
        mobile: String,
        admin: Boolean,
        department: {
            _id: String,
            code: String,
            name: String
        },
        image: {
            src: String
        }
    },
    assignedAt: Date,
    resolvedAt: Date,
    reopendAt: Date,
}, {
    timestamps: true
});

export const Complaints = model<Document, Complaint>('complaints', ComplaintSchema);
