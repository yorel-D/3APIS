//RailRoad/middlewares/validation.js
const Joi = require('joi');

// Schéma de validation pour l'enregistrement des utilisateurs
// User registration validation schema
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    pseudo: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'employee', 'admin').optional(), // Ajoutez cette ligne
  });
  

// Schéma de validation pour les trains
const trainSchema = Joi.object({
  name: Joi.string().required(),
  start_station: Joi.string().required(),
  end_station: Joi.string().required(),
  time_of_departure: Joi.date().required(),
});

// Schéma de validation pour les gares
const stationSchema = Joi.object({
  name: Joi.string().required(),
  open_hour: Joi.string().required(),
  close_hour: Joi.string().required(),
  image: Joi.string().required(),
});

// Schéma de validation pour les tickets
const ticketSchema = Joi.object({
  trainId: Joi.string().required(),
  userId: Joi.string().required(),
});

// Middleware pour valider le corps de la requête
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            console.error("Validation error:", error.details[0].message); // Log d'erreur de validation
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    };
};

module.exports = {
  validate,
  userSchema,
  trainSchema,
  stationSchema,
  ticketSchema,
};
