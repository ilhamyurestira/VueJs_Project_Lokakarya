'use strict';
import { Request, Response } from 'express';
import IController from './Controller_Interface';

const db = require('../db/models/');
const { master_bank } = require('../db/models/master_bank');

class BayarTelponController implements IController {
  bayarTelpon = async (req: Request, res: Response): Promise<Response> => {
    const { nomorRekening, nomorTelpon, jumlahPembayaran } = req.body;

    try {
      // Validasi input
      if (!nomorRekening || !nomorTelpon || !jumlahPembayaran) {
        return res.status(400).send('Data yang diperlukan tidak lengkap.');
      }

      // Dapatkan data pemilik rekening
      const pemilikRekening = await db.master_bank.findOne({
        where: { norek: nomorRekening },
      });

      if (!pemilikRekening) {
        return res.status(404).send('Nomor rekening tidak ditemukan.');
      }

      // Periksa apakah saldo pemilik rekening cukup
      if (pemilikRekening.saldo < jumlahPembayaran) {
        return res.status(400).send('Saldo tidak cukup.');
      }

      // Lakukan pembayaran
      pemilikRekening.saldo -= jumlahPembayaran;

      // Simpan perubahan saldo
      await pemilikRekening.save();

      // Simpan transaksi dan history (Anda perlu menyesuaikan ini dengan struktur tabel Anda)
      // ...

      // Kirim respons JSON ke frontend
      return res.status(200).json({
        nomorRekening: nomorRekening,
        namaPemilikRekening: pemilikRekening.nama,
        nomorTelpon: nomorTelpon,
        jumlahPembayaran: jumlahPembayaran,
        saldoPemilikRekening: pemilikRekening.saldo,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Terjadi kesalahan saat melakukan pembayaran.');
    }
  };

  // Metode-metode berikut ini dapat dibiarkan kosong atau dihapus jika tidak relevan
  index = async (req: Request, res: Response): Promise<Response> => {
    return res.status(404).send('Not Found');
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    return res.status(404).send('Not Found');
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    return res.status(404).send('Not Found');
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    return res.status(404).send('Not Found');
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    return res.status(404).send('Not Found');
  };
}

export default new BayarTelponController();