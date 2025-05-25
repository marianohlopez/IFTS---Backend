import { Router } from "express";
import { listLostPets, addLostPet, updateLostPet, deleteLostPet, getLostPetById } from "../controllers/lostPetController.js";

const router = Router();

router.get('/', listLostPets);

router.get('/:id', getLostPetById);

router.post('/add', addLostPet);

router.put('/:id', updateLostPet);

router.delete('/:id', deleteLostPet);

export const lostPetRouter = router;