import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = './users.json';

function readUser() {
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function writeUser(data) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = readUser();
  if (username === user.username && password === user.password) {
    res.json({ message: 'Login exitoso' });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});

app.post('/recuperar-password', (req, res) => {
  const { username, securityAnswer, newPassword } = req.body;
  const user = readUser();
  if (username === user.username && securityAnswer === user.securityAnswer) {
    user.password = newPassword;
    writeUser(user);
    res.json({ message: 'Contraseña actualizada correctamente' });
  } else {
    res.status(401).json({ message: 'Respuesta de seguridad incorrecta' });
  }
});

app.post('/cambiar-password', (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  const user = readUser();
  if (username === user.username && currentPassword === user.password) {
    user.password = newPassword;
    writeUser(user);
    res.json({ message: 'Contraseña cambiada exitosamente' });
  } else {
    res.status(401).json({ message: 'Contraseña actual incorrecta' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));