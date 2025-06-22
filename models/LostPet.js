import mongoose from "mongoose";

const lostPetSchema = new mongoose.Schema({
    //name, species, description, status, lastSeenDate, lastSeenZone, contactName, contactPhone
    name: { type: String},
    species: {type: String, required: [true, 'La especie es obligatoria']},
    description: {type: String, required: [true, 'La descripción es obligatoria']},
    status: {
        type: String,
        required: true,
        enum: ['perdida', 'encontrada']
    },
    lastSeenDate: {type: Date, required: [true, 'La fecha es obligatoria']},
    lastSeenZone: {type: String, required: [true, 'La zona es obligatoria']},
    contactName: {type: String, required: [true, 'El nombre de la persona a contactar es obligatorio']},
    contactPhone: {type: String, required: [true, 'El teléfono de contacto es obligatorio']}
}, {
    timestamps: true
});

const LostPet = mongoose.model('LostPet', lostPetSchema);

export default LostPet;