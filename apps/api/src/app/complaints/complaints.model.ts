import { Schema, model } from 'mongoose';
import { ComplaintStatus } from '@complaint-logger/models'
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
        status: {
            type: String,
            enum: [ComplaintStatus.Pending, ComplaintStatus.Resolved],
            default: ComplaintStatus.Pending
        }
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
