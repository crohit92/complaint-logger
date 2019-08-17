import { Schema, model } from 'mongoose';
const ComplaintSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    departmentId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    room: String,
    resolution: {
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ['Pending', 'Issue Resolved', 'No Issue found'],
            default: 'Pending'
        }
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        required: false
    }
}, {
        timestamps: true
    });

export const Complaints = model('complaints', ComplaintSchema);
