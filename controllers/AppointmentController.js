import Appointment from '../models/Appointments.js'; 
import Pet from '../models/Pets.js';

const generateTimeSlots = (date) => {
    const slots = [];
    for (let hour = 10; hour < 18; hour++) {
        const slotTime = new Date(date);
        slotTime.setHours(hour, 0, 0, 0);
        slots.push(slotTime.toISOString());
    }
    return slots;
};

export const listAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({}).populate('petId').sort({ dateTime: 1 });

        const appointmentsForRender = appointments.map(appointment => ({
            ...appointment.toObject(),
            petName: appointment.petId ? appointment.petId.name : 'Mascota Desconocida',
            ownerLastName: appointment.petId ? appointment.petId.ownerLastName : 'Dueño Desconocido'
        }));

        res.render('appointmentList', { appointments: appointmentsForRender });
    } catch (err) {
        console.error('Error al obtener la lista de turnos:', err);
        res.status(500).send('Error al obtener la lista de turnos');
    }
};

export const showAddAppointmentForm = async (req, res) => {
    try {
        const pets = await Pet.find({});
        const today = new Date();
        const todaySlots = generateTimeSlots(today);

        res.render('addAppointmentForm', {
            pets: pets,
            initialDate: today.toISOString().split('T')[0],
            timeSlots: todaySlots
        });
    } catch (err) {
        console.error('Error al cargar el formulario de turnos:', err);
        res.status(500).send('Error al cargar el formulario de turnos');
    }
};

export const searchPets = async (req, res) => {
    const { name, ownerLastName } = req.query;
    try {
        const query = {};
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (ownerLastName) {
            query.ownerLastName = { $regex: ownerLastName, $options: 'i' };
        }

        const filteredPets = await Pet.find(query);
        res.json(filteredPets);
    } catch (err) {
        console.error('Error al buscar mascotas:', err);
        res.status(500).json({ message: 'Error al buscar mascotas' });
    }
};

export const getAvailableTimeSlots = async (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ message: 'Fecha no proporcionada.' });
    }

    try {
        const selectedDate = new Date(date);
        if (isNaN(selectedDate.getTime())) {
            return res.status(400).json({ message: 'Formato de fecha inválido.' });
        }

        const dayOfWeek = selectedDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return res.json({ availableSlots: [], message: 'No hay turnos disponibles los fines de semana.' });
        }

        const allSlotsForDay = generateTimeSlots(selectedDate);

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existingAppointments = await Appointment.find({
            dateTime: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        const bookedSlots = existingAppointments
            .map(appt => appt.dateTime.toISOString());
        const availableSlots = allSlotsForDay.filter(slot =>
            !bookedSlots.includes(slot)
        );

        res.json({ availableSlots });
    } catch (err) {
        console.error('Error al obtener slots de tiempo:', err);
        res.status(500).json({ message: 'Error al obtener slots de tiempo.' });
    }
};

export const addAppointment = async (req, res) => {
    try {
        const { petId, dateTime, serviceType, details } = req.body;

        if (!petId || !dateTime || !serviceType) {
            return res.status(400).send('Faltan datos obligatorios para el turno (Mascota, Fecha/Hora, Tipo de Servicio).');
        }

        const existingPet = await Pet.findById(petId);
        if (!existingPet) {
            return res.status(404).send('La mascota con el ID proporcionado no existe.');
        }

        const requestedDateTime = new Date(dateTime);
        const dayOfWeek = requestedDateTime.getDay();
        const hour = requestedDateTime.getHours();

        if (dayOfWeek === 0 || dayOfWeek === 6 || hour < 10 || hour >= 18 || requestedDateTime.getMinutes() !== 0) {
            return res.status(400).send('Horario no válido. Los turnos son de Lunes a Viernes, de 10:00 a 18:00 (turnos de hora en punto).');
        }

        const isSlotBooked = await Appointment.findOne({ dateTime: requestedDateTime });
        if (isSlotBooked) {
            return res.status(409).send('Este turno ya está ocupado. Por favor, seleccione otro horario.');
        }

        const newAppointment = new Appointment({
            petId: existingPet._id,
            dateTime: requestedDateTime,
            serviceType,
            details: details ? details.substring(0, 300) : ''
        });

        await newAppointment.save();
        res.redirect('/appointments');
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        console.error('Error al agendar el turno:', err);
        res.status(500).send('Error al agendar el turno');
    }
};

export const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findById(id).populate('petId');

        if (!appointment) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }
        res.json(appointment);
    } catch (err) {
        console.error('Error al buscar turno por ID:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de turno inválido.' });
        }
        res.status(500).send('Error al buscar turno');
    }
};

export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { petId, dateTime, serviceType, details, status } = req.body;

        const updatedFields = {
            serviceType,
            details: details !== undefined ? details.substring(0, 300) : undefined,
            status
        };

        if (petId) {
            const existingPet = await Pet.findById(petId);
            if (!existingPet) {
                return res.status(404).send('La nueva mascota con el ID proporcionado no existe.');
            }
            updatedFields.petId = existingPet._id;
        }

        if (dateTime) {
            const requestedDateTime = new Date(dateTime);
            const dayOfWeek = requestedDateTime.getDay();
            const hour = requestedDateTime.getHours();

            if (dayOfWeek === 0 || dayOfWeek === 6 || hour < 10 || hour >= 18 || requestedDateTime.getMinutes() !== 0) {
                return res.status(400).send('Horario de actualización no válido. Los turnos son de Lunes a Viernes, de 10:00 a 18:00 (turnos de hora en punto).');
            }
            
            const isSlotBookedByOther = await Appointment.findOne({
                dateTime: requestedDateTime,
                _id: { $ne: id }
            });
            if (isSlotBookedByOther) {
                return res.status(409).send('Este horario ya está ocupado por otro turno.');
            }
            updatedFields.dateTime = requestedDateTime;
        }

        Object.keys(updatedFields).forEach(key => {
            if (updatedFields[key] === undefined) {
                delete updatedFields[key];
            }
        });

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            updatedFields,
            { new: true, runValidators: true }
        ).populate('petId');

        if (!appointment) {
            return res.status(404).json({ message: 'Turno no encontrado para actualizar' });
        }

        res.json({ message: 'Turno actualizado exitosamente', appointment });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de turno inválido.' });
        }
        console.error('Error al actualizar el turno:', err);
        res.status(500).json({ message: 'Error al actualizar el turno' });
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findByIdAndDelete(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Turno no encontrado para eliminar' });
        }

        res.json({ message: 'Turno eliminado exitosamente' });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de turno inválido.' });
        }
        console.error('Error al eliminar el turno:', err);
        res.status(500).json({ message: 'Error al eliminar el turno' });
    }
};