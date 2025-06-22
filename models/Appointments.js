import mongoose from "mongoose"; 
const appointmentSchema = new mongoose.Schema({
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet', 
        required: [true, 'El ID de la mascota es obligatorio.']
    },
    dateTime: {
        type: Date, 
        required: [true, 'La fecha y hora del turno son obligatorias.'],
        validate: {
            validator: function(v) {
                return v >= new Date();
            },
            message: props => `${props.value} no es una fecha válida para un turno (debe ser en el futuro)!`
        }
    },
    serviceType: {
        type: String,
        required: [true, 'El tipo de servicio es obligatorio.'],
        trim: true,
        enum: ['Veterinaria', 'Peluqueria']  },
    details: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Pendiente', 'Confirmado', 'Completado', 'Cancelado'], 
        default: 'Pendiente' 
    }
}, {
    timestamps: true
});

export default mongoose.model('Appointment', appointmentSchema);