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

        res.status(200).json({ status: 'success', payload: lostPets }); // Temporal hasta que esté el .pug
        //res.render('lostPetList', { listPets }); // Revisar vista Pug
    } catch (err) {
        console.error('Error al listar mascotas perdidas:', err);
        res.status(500).json({ status: 'error', message: 'Error interno al obtener la lista de mascotas' }); // Temporal hasta que esté el .pug
        //res.status(500).send('Error al obtener la lista de mascotas');  Revisar vista Pug
    }
};

export const addLostPet = async (req, res) => {

    //console.log("1. Entrando a la función addLostPet");

    try {
        const petDataFromForm = req.body;
        //console.log("2. Datos recibidos del body (formulario/ThunderClient):", petDataFromForm);

        if (!req.user || !req.user._id) {
            console.error("ERROR CRÍTICO: req.user no está definido o no tiene _id. No se puede continuar.");
            return res.status(401).send('Error de autenticación: no se pudo identificar al usuario.');
        }

        const userId = req.user._id;
        //console.log("3. ID del usuario logueado:", userId);

        const newPetData = {
            ...petDataFromForm,
            reportedBy: userId
        };
        //console.log("4. Objeto final a guardar en la base de datos:", newPetData);

        //console.log("5. Intentando crear el documento con Mongoose...");
        const newLostPet = await LostPet.create(newPetData);
        //console.log("6. ¡ÉXITO! Documento creado en MongoDB:", newLostPet);

        res.status(201).json({ status: 'success', message: 'Reporte creado exitosamente', payload: newLostPet }); // Temporal hasta que esté el .pug
        //res.redirect('/lostpets'); // Revisar vista Pug
    } catch (err) {
        //console.error("¡ERROR! Algo falló dentro del try-catch de addLostPet.");
        console.error('Error al agregar mascota perdida:', err);
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({ status: 'error', message: 'Datos inválidos: ' + err.message });
            //return res.status(400).send('Error de validación: ' + err.message);
        }
        res.status(500).json({ status: 'error', message: 'Error interno al agregar la mascota' });
        //res.status(500).send('Error interno al agregar la mascota');
    }
};

export const getLostPetById = async (req, res) => {
    try {
        const { id } = req.params;
        const lostPet = await LostPet.findById(id).populate('reportedBy', 'username');

        if (!lostPet) {
            return res.status(404).json({ status: 'error', message: 'Reporte de mascota no encontrado' });
            //return res.status(404).send('Reporte de mascota no encontrado'); Revisar pug
        }

        res.status(200).json({ status: 'success', payload: lostPet }); //Temporal hasta que esté el .pug
        //res.render('lostPetDetail', { pet: lostPet }); Revisar pug
    } catch (err) {
        console.error('Error al obtener el reporte por ID', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ status: 'error', message: 'El formato del ID es inválido' }); //Temporal hasta que esté el .pug
            //return res.status(400).send('El formato del ID es inválido.'); Revisar pug
        }
        res.status(500).json({ status: 'error', message: 'Error interno al obtener el reporte' }); //Temporal hasta que esté el .pug
        //res.status(500).send('Error interno al obtener el reporte.'); Revisar pug
    }
};

export const updateLostPet = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const petToUpdate = await LostPet.findById(id);
        if (!petToUpdate) {
            return res.status(404).json({ status: 'error', message: 'Reporte no encontrado para actualizar' }); //Temporal hasta que esté el .pug
            //return res.status(404).send('Reporte no encontrado para actualizar.'); Revisar pug
        }

        const updatedPet = await LostPet.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ status: 'success', message: 'Reporte actualizado exitosamente', payload: updatedPet }); //Temporal hasta que esté el .pug
        //res.redirect(`/lostpets/${id}`); Revisar pug
    } catch (err) {
        console.error('Error al actualizar el reporte: ', err);
        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return res.status(400).json({ status: 'error', message: 'Datos inválidos o formato de ID incorrecto: ' + err.message }); //Temporal hasta que esté el .pug
            //return res.status(400).send('Error de validación o formato de ID inválido: ' + err.message); Revisar pug
        }
        res.status(500).json({ status: 'error', message: 'Error interno al actualizar el reporte' });//Temporal hasta que esté el .pug
        // res.status(500).send('Error interno al actualizar el reporte.'); Revisar pug
    }
};

export const deleteLostPet = async (req, res) => {
    try {
        const { id } = req.params;
        const petToDelete = await LostPet.findById(id);

        if (!petToDelete) {
            return res.status(404).json({ status: 'error', message: 'Reporte no encontrado para eliminar' }); //Temporal hasta que esté el .pug
            //return res.status(404).send('Reporte no encontrado para eliminar.'); Revisar pug
        }

        await LostPet.findByIdAndDelete(id);

        res.status(200).json({ status: 'success', message: 'Reporte eliminado exitosamente' }); //Temporal hasta que esté el .pug
        // res.redirect('/lostpets'); Revisar pug
    } catch (err) {
        console.error('Error al eliminar el reporte: ', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ status: 'error', message: 'El formato del ID es inválido' }); //Temporal hasta que esté el .pug
            // return res.status(400).send('El formato del ID es inválido.'); Revisar pug
        }
        res.status(500).json({ status: 'error', message: 'Error interno al eliminar el reporte' }); //Temporal hasta que esté el .pug
        // res.status(500).send('Error interno al eliminar el reporte.'); Revisar pug
    }
};