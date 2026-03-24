const express = require('express');
const router = express.Router();
const formController = require('../controllers/form.controller');

router.post('/', formController.handleGoogleFormsWebhook);

router.patch('/', formController.updateEvaluationStatus)

/* router.get('/', (req, res) => {
  console.log("--- 🔍 TEST GET RECIBIDO ---");
  console.log("Query params:", req.query); // Lo que va después del ? en la URL
  console.log("Headers:", req.headers['user-agent']); // Quién hace la petición

  res.json({ 
    message: "🚀 El endpoint está VIVO",
    recibido: {
      query: req.query,      // Veremos si mandas algo como ?test=123
      method: req.method,    // Debería ser GET
      url_original: req.originalUrl
    },
    ayuda: "Si ves esto, la URL correcta para el Apps Script es https://services-etrl.onrender.com"
  });
});
 */
module.exports = router; 