import { Router } from "express";
import { showEditorForm, listLostPets, addLostPet, updateLostPet, deleteLostPet, getLostPetById } from "../controllers/lostPetController.js";

const router = Router();

router.get('/:id/edit', showEditorForm);

router.get('/', listLostPets);

router.get('/:id', getLostPetById);

router.post('/add', addLostPet);

router.put('/:id', updateLostPet);

router.delete('/:id', deleteLostPet);

export const lostPetRouter = router;