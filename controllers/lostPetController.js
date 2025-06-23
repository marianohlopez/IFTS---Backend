import LostPet from "../models/LostPet.js";

export const listLostPets = async (req, res) => {
    try {
        const { species, zone, status } = req.query;
        const queryFilter = {};

        if (species) {
            queryFilter.species = { $regex: species, $options: 'i' };
        }
        if (zone) {
            queryFilter.lastSeenZone = { $regex: zone, $options: 'i' };
        }
        if (status) {
            queryFilter.status = status;
        }

        const lostPets = await LostPet.find(queryFilter).populate('reportedBy', 'username').sort({ createdAt: -1 });

        res.render('lostPetList', { lostPets });
    } catch (err) {
        console.error('Error al listar mascotas perdidas:', err);
        res.status(500).send('Error al obtener la lista de mascotas');
    }
};

export const addLostPet = async (req, res) => {
    try {
        const petDataFromForm = req.body;

        if (!req.user || !req.user._id) {
            console.error("ERROR CRÍTICO: req.user no está definido o no tiene _id. No se puede continuar.");
            return res.status(401).send('Error de autenticación: no se pudo identificar al usuario.');
        }

        const userId = req.user._id;

        const newPetData = {
            ...petDataFromForm,
            reportedBy: userId
        };

        const newLostPet = await LostPet.create(newPetData);

        res.redirect('/lostpets');
    } catch (err) {
        console.error('Error al agregar mascota perdida:', err);
        
        if (err.name === 'ValidationError') {
            return res.status(400).send('Error de validación: ' + err.message);
        }
        res.status(500).send('Error interno al agregar la mascota');
    }
};

export const getLostPetById = async (req, res) => {
    try {
        const { id } = req.params;
        const lostPet = await LostPet.findById(id).populate('reportedBy', 'username');

        if (!lostPet) {
            return res.status(404).send('Reporte de mascota no encontrado');
        }

        res.render('lostPetDetail', { pet: lostPet });
    } catch (err) {
        console.error('Error al obtener el reporte por ID', err);
        if (err.name === 'CastError') {
            return res.status(400).send('El formato del ID es inválido.');
        }
        res.status(500).send('Error interno al obtener el reporte.');
    }
};

export const updateLostPet = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const petToUpdate = await LostPet.findById(id);
        if (!petToUpdate) {
            return res.status(404).send('Reporte no encontrado para actualizar.');
        }

        const updatedPet = await LostPet.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        res.redirect('/lostpets');
    } catch (err) {
        console.error('Error al actualizar el reporte: ', err);
        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return res.status(400).send('Error de validación o formato de ID inválido: ' + err.message);
        }
        res.status(500).send('Error interno al actualizar el reporte.');
    }
};

export const deleteLostPet = async (req, res) => {
    try {
        const { id } = req.params;
        const petToDelete = await LostPet.findById(id);

        if (!petToDelete) {
            return res.status(404).send('Reporte no encontrado para eliminar.');
        }

        await LostPet.findByIdAndDelete(id);

        
        res.redirect('/lostpets');
    } catch (err) {
        console.error('Error al eliminar el reporte: ', err);
        if (err.name === 'CastError') {
            
            return res.status(400).send('El formato del ID es inválido.');
        }
        res.status(500).send('Error interno al eliminar el reporte.');
    }
};

export const showEditorForm = async (req, res) => {
    try {
        const { id } = req.params;
        const pet = await LostPet.findById(id).lean();

        if (!pet) {
            return res.status(404).send('Reporte no encontrado');
        }

        // En caso de que se avance con la funcionalidad para que los dueños de mascotas puedan registrar mascotas perdidas, solo podrá editar el reporte el mismo usuario que la registró
        // if (pet.reportedBy.toString() !== req.user._id.toString()) {
        //    return res.status(403).send('No tienes permiso para editar este reporte.');
        //}

        pet.lastSeenDateFormatted = new Date(pet.lastSeenDate).toISOString().split('T')[0];

        res.render('editLostPetForm', { pet });
    } catch (error) {
        console.error("Error al mostrar el formulario de edición:", error);
        res.status(500).send("Error al cargar la página de edición");
    }
};