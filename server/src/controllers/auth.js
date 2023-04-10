import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import User from '../models/user.js';

import sequelize from '../database.js';

import Denunciado from '../models/Denunciados.js';
import Denunciante from '../models/Denunciantes.js';
import Denuncia from '../models/DenunciasRegister.js';

const signup = (req, res, next) => {
    // checks if email already exists
    User.findOne({
        where: {
            email: req.body.email,
        }
    })
        .then(dbUser => {
            if (dbUser) {
                return res.status(409).json({ message: "email already exists" });
            } else if (req.body.email && req.body.password) {
                // password hash
                bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
                    if (err) {
                        return res.status(500).json({ message: "couldn't hash the password" });
                    } else if (passwordHash) {
                        User.create({
                            email: req.body.email,
                            nombre: req.body.name,
                            contrasena: passwordHash,
                        })
                            .then((user) => {
                                res.status(201).json({
                                    message: 'User created successfully',
                                    user: {
                                        id: user.id,
                                        email: user.email,
                                        nombre: user.nombre,
                                    },
                                });
                            })
                            .catch((error) => {
                                console.error(error);
                                res.status(500).json({ message: 'Error while creating the user' });
                            });
                    }
                });
            } else if (!req.body.contrasena) {
                return res.status(400).json({ message: "password not provided" });
            } else if (!req.body.email) {
                return res.status(400).json({ message: "email not provided" });
            };
        })
        .catch(err => {
            console.log('error', err);
        });
};

const login = (req, res, next) => {
    // checks if email exists
    User.findOne({
        where: {
            email: req.body.email,
        }
    })
        .then(dbUser => {

            if (!dbUser) {
                return res.status(500).json({
                    message: "user not found",
                    success: false,
                    result: dbUser,

                });
            } else {
                // password hash
                bcrypt.compare(req.body.password, dbUser.contrasena.replace('$2y$', '$2a$'), (err, compareRes) => {
                    if (err) { // error while comparing
                        res.status(502).json({
                            message: "error while checking user password",
                            error: err.message,
                        });
                    } else if (compareRes) { // password match
                        const token = jwt.sign({ userId: dbUser.id, email: req.body.email }, 'secret', { expiresIn: '1h' });
                        res.status(200).json({ message: "user logged in", token, userId: dbUser.id });
                    } else { // password doesnt match
                        res.status(401).json({ message: "invalid credentials" });
                    };
                });
            };
        })
        .catch(err => {
            console.log('error', err);
        });
};



const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        return res.status(500).json({ message: err.message || 'could not decode the token' });
    };
    if (!decodedToken) {
        res.status(401).json({ message: 'unauthorized' });
    } else {
        res.status(200).json({ message: 'here is your resource' });
    };
};

const logout = (req, res, next) => {
    // clear authentication token from client-side
    res.clearCookie('token');

    // invalidate token on server-side (if needed)
    // ...

    res.status(200).json({ message: 'user logged out' });
};


const { Op } = require('sequelize');

const getDenuncias = (req, res, next) => {
    const userId = req.params.userId;

    Promise.all([
        sequelize.query(
            `SELECT 
              dn.*, 
              dd.nombre AS denunciado_nombre,
              dd.apellido AS denunciado_apellido,
              dd.cedula AS denunciado_cedula,
              dc.tipo_abuso,
              dc.descripcion,
              dc.fecha_abuso,
              dc.hora_acontecimiento,
              dc.lugar_del_acontecimiento
            FROM 
              denunciantes AS dn
              INNER JOIN denunciados AS dd ON dn.id = dd.id_denuncia 
              INNER JOIN denuncias AS dc ON dc.id = dd.id
            WHERE 
              dn.usuario_id = :userId`,
            {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT,
            }
        ),
        sequelize.query(
            `SELECT 
              d.*, 
              dn.nombre AS denunciante_nombre,
              dn.apellido AS denunciante_apellido,
              dn.cedula AS denunciante_cedula,
              dc.tipo_abuso,
              dc.descripcion,
              dc.fecha_abuso,
              dc.hora_acontecimiento,
              dc.lugar_del_acontecimiento
            FROM 
              denunciados AS d
              INNER JOIN denunciantes AS dn ON dn.id = d.id_denuncia 
              INNER JOIN denuncias AS dc ON dc.id= d.id
            WHERE 
              dn.usuario_id = :userId`,
            {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT,
            }
        )
    ])
        .then(([denuncias1, denuncias2]) => {
            res.json({
                denuncias1,
                denuncias2
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Error while getting the denuncias" });
        });
}


const updatePassword = (req, res, next) => {
    const userId = req.params.userId;
    const { currentPassword, newPassword } = req.body;

    User.findByPk(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            // compare the provided current password with the hashed password in the database
            bcrypt.compare(currentPassword, user.contrasena, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Could not compare passwords" });
                }
                if (!result) {
                    return res.status(401).json({ message: "Incorrect current password" });
                }

                // hash the new password and update the user's password in the database
                bcrypt.hash(newPassword, 12, (err, hashedPassword) => {
                    if (err) {
                        return res.status(500).json({ message: "Could not hash password" });
                    }

                    User.update({ contrasena: hashedPassword }, { where: { id: userId } })
                        .then(() => {
                            res.status(200).json({ message: "Password updated successfully" });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ message: "Error while updating password" });
                        });
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Error while finding user" });
        });
};

const sendDenuncia = async (req, res, next) => {
    try {
        const usuario_id = req.params.userId;

        // Insert denunciante into the database
        const [denunciante, createdDenunciante] = await sequelize.query(`
            INSERT INTO denunciantes(nombre, apellido, cedula, telefono, usuario_id) 
            VALUES ('${req.body.denunciante.nombre}', '${req.body.denunciante.apellido}', '${req.body.denunciante.cedula}', '${req.body.denunciante.telefono}', ${Number(usuario_id)})
        `);

        const id_denunciante = denunciante;

        // Insert denuncia into the database
        const [denuncia, createdDenuncia] = await sequelize.query(`
            INSERT INTO denuncias( tipo_abuso, descripcion, lugar_del_acontecimiento, fecha_abuso, hora_acontecimiento, id_denunciante) 
            VALUES ('${req.body.denuncias.reportType}', '${req.body.denuncias.report}','${req.body.denuncias.place}','${req.body.denuncias.date}','${req.body.denuncias.time}','${id_denunciante}')
        `);

        for (let i = 0; i < req.body.denunciados.length; i++) {
            const { denouncedName, denouncedLastname, denouncedCode } = req.body.denunciados[i];

            // Insert or find denunciado
            const [denunciado, createdDenunciado] = await sequelize.query(`
            INSERT INTO denunciados(nombre, apellido, cedula, id_denuncia) 
            VALUES ('${denouncedName}', '${denouncedLastname}', '${denouncedCode}', '${denuncia}')
          `);

        }

        res.status(201).json({
            message: 'Denuncia created successfully',
            denuncia,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error while creating the denuncia' });
    }
};






export { signup, login, isAuth, logout, getDenuncias, updatePassword, sendDenuncia };