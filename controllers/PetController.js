import Pet from '../models/Pets.js';

export const listPets = async (req, res) => {
    try {
        const pets = await Pet.find({}); 
        res.render('petList', { pets });
    } catch (err) {
        console.error('Error al obtener mascotas:', err);
        res.status(500).send('Error al obtener mascotas');
    }
};


export const addPet = async (req, res) => {
    try {

        const { name, ownerLastName, species, breed, weight, age, clinicalNotes } = req.body;

        if (!name || !ownerLastName || !species || !breed || !weight || !age) {
            return res.status(400).json({ message: 'Faltan datos generales obligatorios para la mascota.' });
        }

        const newPet = new Pet({
            name,
            ownerLastName,
            species,
            breed,
            weight: parseFloat(weight),
            age: parseInt(age),
            clinicalNotes: clinicalNotes || ''
        });

        await newPet.save(); 

        res.redirect('/pets');
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        console.error('Error al agregar mascota:', err);
        res.status(500).send('Error al agregar mascota');
    }
};


export const getPetById = async (req, res) => {
    try {
        const { id } = req.params;

        const pet = await Pet.findById(id); 

        if (!pet) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
        }
        res.json(pet); 
    } catch (err) {
        console.error('Error al buscar mascota por ID:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de mascota inválido.' });
        }
        res.status(500).send('Error al buscar mascota');
    }
};

// ---
export const updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, ownerLastName, species, breed, weight, age, clinicalNotes } = req.body;

        const updatedFields = {
            name,
            ownerLastName,
            species,
            breed,
            weight: parseFloat(weight),
            age: parseInt(age),
            clinicalNotes: clinicalNotes 
        };

        Object.keys(updatedFields).forEach(key => {
            if (updatedFields[key] === undefined && key !== 'clinicalNotes') {
                delete updatedFields[key];
            }
        });

        const pet = await Pet.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });

        if (!pet) {
            return res.status(404).json({ message: 'Mascota no encontrada para actualizar' });
        }

        res.json({ message: 'Mascota actualizada', pet });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de mascota inválido.' });
        }
        console.error('Error al actualizar mascota:', err);
        res.status(500).json({ message: 'Error al actualizar mascota' });
    }
};

export const deletePet = async (req, res) => {
    try {
        const { id } = req.params;

        const pet = await Pet.findByIdAndDelete(id);

        if (!pet) {
            return res.status(404).json({ message: 'Mascota no encontrada para eliminar' });
        }

        res.json({ message: 'Mascota eliminada exitosamente' });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de mascota inválido.' });
        }
        console.error('Error al eliminar mascota:', err);
        res.status(500).json({ message: 'Error al eliminar mascota' });
    }
};