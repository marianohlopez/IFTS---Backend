import Pet from '../classes/Pet.js';

const petModel = new Pet();

export const listPets = async (req, res) => {
    try {
        const pets = await petModel.getAll();
        res.render('petList', { pets });
    } catch (err) {
        console.error('Error fetching pets:', err);
        res.status(500).send('Error fetching pets');
    }
};


export const addPet = async (req, res) => {
    try {
        const pets = await petModel.getAll();
        const { name, ownerLastName, species, breed, weight, age, clinicalNotes } = req.body;

        if (!name || !ownerLastName || !species || !breed || !weight || !age) {
            return res.status(400).json({ message: 'Faltan datos generales obligatorios para la mascota.' });
        }

        const id = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;

        const newPet = new Pet(
            id,
            name,
            ownerLastName,
            species,
            breed,
            parseFloat(weight),
            parseInt(age),       
            clinicalNotes || '' 
        );

        pets.push(newPet);
        await petModel.save(pets);
        res.redirect('/pets'); 
    } catch (err) {
        console.error('Error adding pet:', err);
        res.status(500).send('Error adding pet');
    }
};

export const getPetById = async (req, res) => {
    try {
        const { id } = req.params;
        const pets = await petModel.getAll();
        const pet = pets.find(p => p.id === parseInt(id));

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(pet); 
    } catch (err) {
        console.error('Error finding pet ID:', err);
        res.status(500).send('Error finding pet');
    }
};

export const updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, ownerLastName, species, breed, weight, age, clinicalNotes } = req.body;
        const pets = await petModel.getAll();
        const petIndex = pets.findIndex(p => p.id === parseInt(id));

        if (petIndex === -1) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        pets[petIndex] = {
            ...pets[petIndex], 
            name: name || pets[petIndex].name,
            ownerLastName: ownerLastName || pets[petIndex].ownerLastName,
            species: species || pets[petIndex].species,
            breed: breed || pets[petIndex].breed,
            weight: weight ? parseFloat(weight) : pets[petIndex].weight,
            age: age ? parseInt(age) : pets[petIndex].age,
            clinicalNotes: clinicalNotes !== undefined ? clinicalNotes : pets[petIndex].clinicalNotes 
        };

        await petModel.save(pets);
        res.json({ message: 'Pet updated', pet: pets[petIndex] });
    } catch (err) {
        console.error('Error updating pet:', err);
        res.status(500).json({ message: 'Error updating pet' });
    }
};

export const deletePet = async (req, res) => {
    try {
        const { id } = req.params;
        const pets = await petModel.getAll();
        const filteredPets = pets.filter(p => p.id !== parseInt(id));

        if (filteredPets.length === pets.length) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        await petModel.save(filteredPets);
        res.json({ message: 'Pet deleted' });
    } catch (err) {
        console.error('Error deleting pet:', err);
        res.status(500).json({ message: 'Error deleting pet' });
    }
};