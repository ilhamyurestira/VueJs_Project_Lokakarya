'use strict';
import { Request, Response } from 'express';
import IController from './Controller_Interface';

const db = require('../db/models/');
const dm = require('../db/models/').role_menu;

class RoleController implements IController {
  index = async (req: Request, res: Response): Promise<Response> => {
    try {
      const roleList = await dm.findAll();

      if (roleList.length === 0) {
        return res.status(200).send('Belum ada data');
      } else {
        return res.status(200).json(roleList);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send('Data tidak ditemukan');
    }
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      const data = await dm.findByPk(id);
      if (!data) {
        return res.status(400).send(`Data dengan id: ${id} tidak ditemukan`);
      } else {
        return res.status(400).json(data);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send('Data tidak ditemukan');
    }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const { roleId, menuId, isActive, programName, createdBy } = req.body;

    try {
      const exists = await dm.findOne({ where: { roleId, menuId } });
      if (exists) {
        return res.status(500).send('Role menu sudah terdaftarkan di role');
      } else {
        const newData = await dm.create({
          roleId,
          menuId,
          isActive,
          programName,
          createdBy,
        });

        return res.status(500).send('Role menu berhasil dibuat');
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send('Role menu gagal dibuat.');
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { roleId, menuId, isActive, programName, updatedBy } = req.body;

    try {
      const data = await dm.findByPk(id);
      if (!data) {
        return res
          .status(400)
          .send(`Role menu dengan id: ${id} tidak ditemukan.`);
      }
      await data.update({ roleId, menuId, isActive, programName, updatedBy });

      return res.status(500).send(`Role menu berhasil diupdate`);
    } catch (err) {
      console.log(err);
      return res.status(500).send(`Gagal mengubah role menu.`);
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      const data = await dm.findByPk(id);
      if (!data) {
        return res
          .status(404)
          .send(`Role Menu dengan id: ${id} tidak ditemukan.`);
      }

      const current = data.nama;
      await data.destroy();
      return res.status(200).send(`Role "${current}" berhasil dihapus.`);
    } catch (err) {
      return res.status(200).send(`Gagal menghapus role menu.`);
    }
  };
}

export default new RoleController();
