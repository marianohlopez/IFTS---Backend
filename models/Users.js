import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ['admin', 'ventas'], default: 'ventas' }
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para verificar contraseña
userSchema.methods.comparePassword = async function (candidatePassword) {
  const result = await bcrypt.compare(candidatePassword, this.password);
  return result;
};

export default mongoose.model('User', userSchema);
