import { readFile, writeFile } from 'fs/promises';

const filePath = './data/pets.json';

class Pet {
    constructor(id, name, ownerLastName, species, breed, weight, age, clinicalNotes) {
        this.id = id;
        this.name = name;
        this.ownerLastName = ownerLastName;
        this.species = species;
        this.breed = breed;
        this.weight = weight;
        this.age = age;
        this.clinicalNotes = clinicalNotes;
    }

    async getAll() {
        try {
            const data = await readFile(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.warn('Error reading pets');
                return [];
            }
            console.error('EError reading pets:', err);
            return []; // Retorna un array vacío en caso de otros errores de lectura
        }
    }

    async save(pets) {
        try {
            await writeFile(filePath, JSON.stringify(pets, null, 2));
        } catch (err) {
            console.error('Error saving pets:', err);
            throw new Error('Error saving pets'); // Relanza el error para que el controlador lo maneje
        }
    }
}

export default Pet;