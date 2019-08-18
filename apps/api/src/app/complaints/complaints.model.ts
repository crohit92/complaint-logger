import { Schema, model } from 'mongoose';
const ComplaintSchema = new Schema({
    createdById: {
        type: Schema.Types.ObjectId
    },
    createdBy: {
        name: {
            type: String,
            required: true
        },
        mobile: {
            type: String
        }
    },
    mobile: {
        type: String,
        required: true
    },
    // departmentId: {
    //     type: Schema.Types.ObjectId,
    //     required: true
    // },
    department: {
        name: String
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
            enum: ['Pending', 'Issue Resolved', 'No Issue found'],
            default: 'Pending'
        }
    },
    assignedTo: {
        name: String,
        mobile: String
    },
    assignedToId: {
        type: Schema.Types.ObjectId,
        required: false
    }
}, {
        timestamps: true
    });

export const Complaints = model('complaints', ComplaintSchema);
