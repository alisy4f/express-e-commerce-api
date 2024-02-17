import { authorizePermission } from "../middlewares/validators.js";
import prisma from "../prisma.js";
import { Permission } from "../authorization.js";
import { Router } from "express";

const router = Router();

router.get('/search', authorizePermission(Permission.BROWSE_PRODUCTS), async (req, res) => {
  try {
    const query = req.query.q; // Ambil query parameter q
    const page = req.query.page ? parseInt(req.query.page) : 1; // Ambil nomor halaman (jika tersedia)

    const itemsPerPage = 5; // Jumlah item per halaman
    const skip = (page - 1) * itemsPerPage; // Hitung berapa item yang harus dilewati

    // Lakukan pencarian produk berdasarkan nama, deskripsi, dan kategori,
    // dengan urutan berdasarkan nama produk secara default
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } }, // Pencocokan nama produk
          { description: { contains: query } }, // Pencocokan deskripsi produk
          { category: { name: { contains: query } } }, // Pencocokan nama kategori
        ]
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: { name: 'asc' }, // Urutan berdasarkan nama produk secara default
      skip, // Lewati item yang sudah ditampilkan di halaman sebelumnya
      take: itemsPerPage // Ambil sejumlah item yang diperlukan untuk halaman ini
    });

    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router