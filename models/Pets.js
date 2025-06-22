import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la mascota es obligatorio.'],
        trim: true 
    },
    ownerLastName: {
        type: String,
        required: [true, 'El apellido del dueño es obligatorio.'],
        trim: true
    },
    species: {
        type: String,
        required: [true, 'La especie es obligatoria.'],
        trim: true
    },
    breed: {
        type: String,
        required: [true, 'La raza es obligatoria.'],
        trim: true
    },
    weight: {
        type: Number,
        required: [true, 'El peso es obligatorio.'],
        min: [0, 'El peso no puede ser negativo.'] 
    },
    age: {
        type: Number,
        required: [true, 'La edad es obligatoria.'],
        min: [0, 'La edad no puede ser negativa.'],
        max: [30, 'La edad máxima para una mascota es de 30 años.'] 
    },
    clinicalNotes: {
        type: String,
        default: '' 
    }
}, {
    timestamps: true
});
export default mongoose.model('Pet', petSchema);




