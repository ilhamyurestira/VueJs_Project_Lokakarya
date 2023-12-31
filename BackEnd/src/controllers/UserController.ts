import { Request, Response } from 'express';
import Authentication from '../utils/Authentication';
import IController from './Controller_Interface';
import { sequelize } from '../db/models';

const db = require('../db/models');
const dm = db.user;

class UserController implements IController {
  index = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userList = await dm.findAll({
        exclude: ['password'],
        order: ['id'],
      });

      if (userList.length === 0) {
        return res.status(400).send('Belum ada data.');
      } else {
        return res.status(200).json(userList);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send('Data tidak ditemukan.');
    }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const {
        username,
        password,
        nama,
        alamat,
        email,
        telp,
        programName,
        createdBy,
      } = req.body;
      if (!username) {
        return res.status(400).send('username belum diisi');
      } else if (!password) {
        return res.status(400).send('password belum diisi');
      } else if (!nama) {
        return res.status(400).send('nama belum diisi');
      } else if (!email) {
        return res.status(400).send('email belum diisi');
      } else if (!telp) {
        return res.status(400).send('nomor telepon belum diisi');
      } else {
        const hashedPassword: string = await Authentication.passwordHash(
          password
        );

        await dm.create({
          username,
          password: hashedPassword,
          nama,
          alamat,
          email,
          telp,
          programName,
          createdBy,
        });

        // console.log('arrId', arrId);
        // if (newData) {
        //   return res.status(201).send('registrasi user sukses!');
        // }
        return res.status(201).send(`registrasi user: ${username} sukses`);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send('registrasi user gagal.');
    }
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      const data = await dm.findByPk(id, {
        exclude: ['password'],
        order: ['id'],
      });

      if (!data) {
        return res.status(404).send('user tidak ditemukan.');
      }
      return res.status(200).json(data);
    } catch (err) {
      console.log(err);
      return res.status(500).send('pencarian user gagal.');
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { nama, alamat, email, telp, programName, updatedBy } = req.body;

    try {
      if (!nama) {
        return res.status(400).send('nama belum diisi');
      } else if (!email) {
        return res.status(400).send('email belum diisi');
      } else if (!telp) {
        return res.status(400).send('nomor telepon belum diisi');
      } else {
        const data = await dm.findByPk(id);
        if (!data) {
          return res.status(404).send('data user tidak ditemukan.');
        }

        const userName = data.username;
        await data.update({
          nama,
          alamat,
          email,
          telp,
          programName,
          updatedBy,
        });
        return res.status(200).send(`update data user "${userName}" sukses.`);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send('update data gagal.');
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      const data = await dm.findByPk(id);
      if (!data) {
        return res.status(404).send('data user tidak ditemukan.');
      }

      const userName = data.username;

      await db.hak_akses.destroy({ where: { userId: id } });
      await data.destroy();
      return res
        .status(200)
        .send(`data user "${userName}" telah berhasil dihapus.`);
    } catch (err) {
      console.log(err);
      return res.status(500).send('gagal menghapus user.');
    }
  };

  userAdmin = async (req: Request, res: Response): Promise<Response> => {
    const { password } = req.body;

    try {
      if (!password) {
        return res.status(400).send('password belum diisi');
      } else {
        const user = await dm.findOne({
          where: { username: 'useradmin' },
        });

        // check password
        let compare = await Authentication.passwordCompare(
          password,
          user.password
        );

        // generate token
        if (compare) {
          return res.status(200).send('Password Confirmed');
        }
        return res.status(401).send('Wrong Password');
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send('authentication error');
    }
  };

  getMaxId = async (req: Request, res: Response): Promise<Response> => {
    const { username } = req.params;

    console.log(username);

    try {
      const maxId = await dm.max('id');
      const data = { id: maxId };

      if (!data) {
        return res.status(404).send('user tidak ditemukan.');
      }
      return res.status(200).json(data);
    } catch (err) {
      console.log(err);
      return res.status(500).send('pencarian user gagal.');
    }
  };
}
export default new UserController();
