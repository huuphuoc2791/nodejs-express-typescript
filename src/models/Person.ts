import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IPersonModel extends mongoose.Document {
    email: string;
    name: string;
    age: number;
}

const PersonSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    }
});
const PersonModel = mongoose.model<IPersonModel>('Person', PersonSchema);

export default PersonModel;
