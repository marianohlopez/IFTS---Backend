import lostPet from "../classes/lostPets.js";

const lostpetModel = new lostPet();

export const listLostPets = async (req, res) => {
    try {
        const lostpets = lostpetModel.getAll();
        res.render('lostPetList', { lostpets });
    } catch (err) {
        console.error('Error fetching lostPets: ', err);
        res.status(500).send('Error fetching lostPets');
    }
};

export const addLostPet = async (req, res) => {
    try {
    const lostpets = await lostpetModel.getAll();
    const { name, species, description, status, lastSeenDate, lastSeenZone, contactName, contactPhone } = req.body;

    if (!name || !species || !description || !status || !lastSeenDate || !lastSeenZone || !contactName || !contactPhone) {
        return res.status(400).json({ message: 'Faltan datos generales obligatorios para la mascota perdida.'});
    }

    const id = lostpets.length > 0 ? Math.max(...lostpets.map(p => p.id)) +1 : 1;

    const newLostPet = new lostPet(
        id,
        name,
        species,
        description || '',
        status,
        lastSeenDate,
        lastSeenZone,
        contactName,
        parseInt(contactPhone)
    );

    lostpets.push(newLostPet);
    await lostpetModel.save(lostpets);
    res.redirect('/lostpets');
    } catch (err) {
        console.error('Error adding lostpet: ', err);
        res.status(500).send('Error addting lostpet');
    }
};

export const getLostPetById = async (req, res) => {
    try{
        const { id } = req.params;
        const lostpets = await lostpetModel.getAll();
        const lostpet = lostpets.find(p => p.id === parseInt(id));

        if (!lostpet) {
            return res.status(404).json({ message: 'Lost pet not found'});
        }
        res.json(lostpet);
    } catch (err) {
        console.error('Error finding lost pet ID', err);
        res.status(500).send('Error finding lost pet');
    }
};

export const updateLostPet = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, species, description, status, lastSeenDate, lastSeenZone, contactName, contactPhone } = req.body;
        const lostpets = await lostpetModel.getAll();
        const lostPetIndex = lostpets.findIndex(p => p.id === parseInt(id));

        if (petIndex === -1) {
            return res.status(404).json({ message: 'Lost pet not found'});
        }

        lostpets[lostPetIndex] = {
            ...lostpets[lostPetIndex],
            name: name || lostpets[lostPetIndex].name, 
            species: species || lostpets[lostPetIndex].species, 
            description: description !== undefined ? description : lostpets[lostPetIndex].description, 
            status: status || lostpets[lostPetIndex].status, 
            lastSeenDate: lastSeenDate || lostpets[lostPetIndex].lastSeenDate,
            lastSeenZone: lastSeenZone || lostpets[lostPetIndex].lastSeenZone, 
            contactName: contactName || lostpets[lostPetIndex].contactName, 
            contactPhone: contactPhone ? parseInt(contactPhone) : lostpets[lostPetIndex].contactPhone
        };

        await lostpetModel.save(lostpets);
        res.json({ message: 'Lost pet update', lostpet : lostpets[lostPetIndex] });
    } catch (err) {
        console.error('Error updating lost pet: ', err);
        res.status(500).json({ message: 'Error update lost pet' });
    }
};

export const deleteLostPet = async (req, res) => {
    try {
        const { id } = req.params;
        const lostpets = await lostpetModel.getAll();
        const filteredLostPets = lostpets.filter(p => p.id !== parseInt(id));

        if (filteredLostPets.length === lostpets.length) {
            return res.status(404).json({ message: 'Lost pet not found'});
        }

        await lostpetModel.save(filteredLostPets);
        res.json({ message: 'Lost pet deleted'});
    } catch (err) {
        console.error('Error deleting lost pet: ', err);
        res.status(500).json({ message: 'Error deleting lost pet'});
    }
};