import { Router } from 'express';
import {listAppointments, addAppointment, showAddAppointmentForm, searchPets, getAvailableTimeSlots, getAppointmentById, 
    updateAppointment,  deleteAppointment} from '../controllers/AppointmentController.js';

const router = Router();


router.get('/add', showAddAppointmentForm);

router.get('/search-pets', searchPets);

router.get('/available-slots', getAvailableTimeSlots);

router.get('/', listAppointments);

router.post('/', addAppointment);

router.get('/:id', getAppointmentById); 

router.put('/:id', updateAppointment);

router.delete('/:id', deleteAppointment);

export const appointmentRouter = router;