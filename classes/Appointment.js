import { readFile, writeFile } from 'fs/promises';

const filePath = './data/appointments.json';

class Appointment {
    constructor(id, petId, dateTime, serviceType, details) { 
        this.id = id;
        this.petId = petId;         
        this.dateTime = dateTime;   
        this.serviceType = serviceType; 
        this.details = details;  
        this.status = 'Pendiente';
    }

    async getAll() {
        try {
            const data = await readFile(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.warn('El archivo de turnos no existe o está vacío. Se inicializará con un array vacío.');
                return [];
            }
            console.error('Error al leer los turnos:', err);
            return [];
        }
    }

    async save(appointments) {
        try {
            await writeFile(filePath, JSON.stringify(appointments, null, 2));
        } catch (err) {
            console.error('Error al guardar los turnos:', err);
            throw new Error('No se pudieron guardar los turnos.');
        }
    }
}

export default Appointment;