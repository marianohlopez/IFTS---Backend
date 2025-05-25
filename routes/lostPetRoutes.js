import { Router } from "express";
import { listLostPets, addLostPet, updateLostPet, deleteLostPet } from "../controllers/LostPetController.js";

const router = Router();

router.get('/', listLostPets);

router.post('/add', addLostPet);

router.put('/:id', updateLostPet);

router.delete('/:id', deleteLostPet);

export const lostPetRouter = router;