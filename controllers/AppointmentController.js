import Appointment from '../classes/Appointment.js';
import Pet from '../classes/Pet.js';

const appointmentModel = new Appointment();
const petModel = new Pet();

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
        const appointments = await appointmentModel.getAll();
        const pets = await petModel.getAll();

        const appointmentsWithPetInfo = appointments.map(appointment => {
            const pet = pets.find(p => p.id === appointment.petId);
            return {
                ...appointment,
                petName: pet ? pet.name : 'Mascota Desconocida',
                ownerLastName: pet ? pet.ownerLastName : 'Dueño Desconocido'
            };
        });

        res.render('appointmentList', { appointments: appointmentsWithPetInfo });
    } catch (err) {
        console.error('Error al obtener la lista de turnos:', err);
        res.status(500).send('Error al obtener la lista de turnos');
    }
};

export const showAddAppointmentForm = async (req, res) => {
    try {
        const today = new Date();
        const todaySlots = generateTimeSlots(today);

        res.render('addAppointmentForm', {
            pets: [],
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
        const pets = await petModel.getAll();
        let filteredPets = pets;

        if (name) {
            filteredPets = filteredPets.filter(p =>
                p.name.toLowerCase().includes(name.toLowerCase())
            );
        }
        if (ownerLastName) {
            filteredPets = filteredPets.filter(p =>
                p.ownerLastName.toLowerCase().includes(ownerLastName.toLowerCase())
            );
        }

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
        const existingAppointments = await appointmentModel.getAll();

        const bookedSlots = existingAppointments
            .filter(appt => {
                const apptDate = new Date(appt.dateTime);
                return apptDate.toISOString().split('T')[0] === date;
            })
            .map(appt => new Date(appt.dateTime).toISOString());
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
        const appointments = await appointmentModel.getAll();
        const { petId, dateTime, serviceType, details } = req.body;

        if (!petId || !dateTime || !serviceType) {
            return res.status(400).send('Faltan datos obligatorios para el turno (Mascota, Fecha/Hora, Tipo de Servicio).');
        }

        const parsedPetId = parseInt(petId);
        const pets = await petModel.getAll();
        const existingPet = pets.find(p => p.id === parsedPetId);
        if (!existingPet) {
            return res.status(404).send('La mascota con el ID proporcionado no existe.');
        }

        const requestedDateTime = new Date(dateTime);
        const dayOfWeek = requestedDateTime.getDay();
        const hour = requestedDateTime.getHours();

        if (dayOfWeek === 0 || dayOfWeek === 6 || hour < 10 || hour >= 18 || requestedDateTime.getMinutes() !== 0) {
            return res.status(400).send('Horario no válido. Los turnos son de Lunes a Viernes, de 10:00 a 18:00 (turnos de hora en punto).');
        }

        const existingAppointments = await appointmentModel.getAll();
        const isSlotBooked = existingAppointments.some(appt => appt.dateTime === dateTime);
        if (isSlotBooked) {
            return res.status(409).send('Este turno ya está ocupado. Por favor, seleccione otro horario.');
        }

        const id = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;

        const newAppointment = new Appointment(
            id,
            parsedPetId,
            dateTime,
            serviceType,
            details ? details.substring(0, 300) : ''
        );

        appointments.push(newAppointment);
        await appointmentModel.save(appointments);
        res.redirect('/appointments');
    } catch (err) {
        console.error('Error al agendar el turno:', err);
        res.status(500).send('Error al agendar el turno');
    }
};


export const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointments = await appointmentModel.getAll();
        const appointment = appointments.find(a => a.id === parseInt(id));

        if (!appointment) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }
        res.json(appointment);
    } catch (err) {
        console.error('Error al buscar turno por ID:', err);
        res.status(500).send('Error al buscar turno');
    }
};

export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { petId, dateTime, serviceType, details, status } = req.body;
        const appointments = await appointmentModel.getAll();
        const appointmentIndex = appointments.findIndex(a => a.id === parseInt(id));

        if (appointmentIndex === -1) {
            return res.status(404).json({ message: 'Turno no encontrado para actualizar' });
        }

        if (petId) {
            const pets = await petModel.getAll();
            const existingPet = pets.find(p => p.id === parseInt(petId));
            if (!existingPet) {
                return res.status(404).send('La nueva mascota con el ID proporcionado no existe.');
            }
        }
        
        if (dateTime) {
            const requestedDateTime = new Date(dateTime);
            const dayOfWeek = requestedDateTime.getDay();
            const hour = requestedDateTime.getHours();

            if (dayOfWeek === 0 || dayOfWeek === 6 || hour < 10 || hour >= 18 || requestedDateTime.getMinutes() !== 0) {
                return res.status(400).send('Horario de actualización no válido. Los turnos son de Lunes a Viernes, de 10:00 a 18:00 (turnos de hora en punto).');
            }
            
            const existingAppointments = await appointmentModel.getAll();
            const isSlotBookedByOther = existingAppointments.some(appt => 
                appt.dateTime === dateTime && appt.id !== parseInt(id)
            );
            if (isSlotBookedByOther) {
                return res.status(409).send('Este horario ya está ocupado por otro turno.');
            }
        }

        appointments[appointmentIndex] = {
            ...appointments[appointmentIndex],
            petId: petId ? parseInt(petId) : appointments[appointmentIndex].petId,
            dateTime: dateTime || appointments[appointmentIndex].dateTime,
            serviceType: serviceType || appointments[appointmentIndex].serviceType,
            details: details !== undefined ? details.substring(0, 300) : appointments[appointmentIndex].details,
            status: status || appointments[appointmentIndex].status
        };

        await appointmentModel.save(appointments);
        res.json({ message: 'Turno actualizado exitosamente', appointment: appointments[appointmentIndex] });
    } catch (err) {
        console.error('Error al actualizar el turno:', err);
        res.status(500).json({ message: 'Error al actualizar el turno' });
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointments = await appointmentModel.getAll();
        const filteredAppointments = appointments.filter(a => a.id !== parseInt(id));

        if (filteredAppointments.length === appointments.length) {
            return res.status(404).json({ message: 'Turno no encontrado para eliminar' });
        }

        await appointmentModel.save(filteredAppointments);
        res.json({ message: 'Turno eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar el turno:', err);
        res.status(500).json({ message: 'Error al eliminar el turno' });
    }
};