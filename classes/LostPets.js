import { readFile, writeFile } from "fs/promises";
import { stringify } from "querystring";

const filePath = './data/lostpet.json'

class lostPet {
    constructor(id, name, species, description, status, lastSeenDate, lastSeenZone, contactName, contactPhone) {
        this.id = id;
        this.name = name;
        this.species = species;
        this.description = description;
        this.status = status;
        this.lastSeenDate = lastSeenDate;
        this.lastSeenZone = lastSeenZone;
        this.contactName = contactName;
        this.contactPhone = contactPhone;
    }

    async getAll() {
        try {
            const data = await readFile(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.warn('Error reading lostpets');
                return [];
            }
            console.error('Error reading lostpets:', err);
            return []; // Retorna un array vacío en caso de otros errores de lectura
        }
    }

    async save(lostPet) {
        try {
            await writeFile(filePath, JSON,stringify(lostPet, null, 2));
        } catch (err) {
            console.error('Error saving lostpets:', err);
            throw new Error('Error saving lostpets'); // Relanza el error para que el controlador lo maneje
        }
    }
}

export default lostPet;