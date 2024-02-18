# express-e-commerce-api
back-end finpro YOG-3

API ini adalah sebuah layanan manajemen e-commerce yang menyediakan berbagai endpoint untuk melakukan berbagai operasi terkait produk, kategori, pengguna, keranjang belanja, dan pesanan. Berikut adalah rangkuman fitur dan endpoint yang disediakan:

### Fitur Utama:

1. **Manajemen Produk:** Endpoint untuk menambah, mengubah, dan menghapus produk.
2. **Manajemen Kategori:** Endpoint untuk menambah, mengubah, dan menghapus kategori produk.
3. **Pencarian Produk:** Endpoint untuk mencari produk berdasarkan query.
4. **Manajemen Pengguna:** Endpoint untuk mendaftarkan pengguna baru, mengelola profil, dan menghapus akun.
5. **Autentikasi Pengguna:** Endpoint untuk mengotentikasi pengguna dan menghasilkan token akses.
6. **Manajemen Keranjang Belanja:** Endpoint untuk menambah, menghapus, dan mengosongkan keranjang belanja.
7. **Manajemen Pesanan:** Endpoint untuk membuat, mengelola, dan melihat pesanan.

### Teknologi yang Digunakan:

- **Express.js:** Framework JavaScript untuk membangun aplikasi web.
- **Prisma:** ORM (Object-Relational Mapping) untuk berinteraksi dengan database.
- **JWT (JSON Web Tokens):** Standar terbuka untuk membuat token akses yang aman.
- **Dummy Payment Gateway:** Layanan simulasi pembayaran untuk pengembangan dan pengujian.

### Authorization:

Endpoint-endpoint tertentu memerlukan izin khusus untuk diakses. Izin-izin ini termasuk `ADD_PRODUCT`, `EDIT_PRODUCT`, `DELETE_PRODUCT`, `ADD_CATEGORY`, `EDIT_CATEGORY`, `DELETE_CATEGORY`, `BROWSE_CART`, `ADD_CART`, `DELETE_CART`, `BROWSE_ORDERS`, `READ_ORDER`, dan `ADD_ORDER`.

### Error Responses:

API ini menghasilkan respons error standar dengan kode status HTTP yang sesuai untuk setiap kondisi kesalahan. Pesan-pesan kesalahan yang mungkin termasuk "Invalid ID", "Missing required fields", "User already exists", "Invalid email or password", dan lainnya.

API ini menyediakan infrastruktur yang lengkap untuk mengelola operasi e-commerce secara efisien dan aman. Dengan endpoint-endpoint yang tersedia, pengembang dapat membangun dan mengintegrasikan berbagai fitur e-commerce ke dalam aplikasi mereka dengan mudah.

---

## Search API Endpoint

Digunakan untuk menyediakan berbagai endpoint yang berfungsi untuk melakukan pencarian produk dan kategori.

### Endpoint

- **GET /products**
  - **Deskripsi:** Mengambil daftar semua produk.
  - **Contoh Request:**
    ```http
    GET /products
    ```
  - **Contoh Response:**
    ```json
    [
      {
        "id": 1,
        "name": "Product 1",
        "price": 10.99,
        "category": {
          "name": "Category A"
        }
      },
      {
        "id": 2,
        "name": "Product 2",
        "price": 19.99,
        "category": {
          "name": "Category B"
        }
      }
    ]
    ```

- **GET /products/:id**
  - **Deskripsi:** Mengambil detail produk berdasarkan ID.
  - **Contoh Request:**
    ```http
    GET /products/1
    ```
  - **Contoh Response:**
    ```json
    {
      "id": 1,
      "name": "Product 1",
      "price": 10.99,
      "description": "Lorem ipsum dolor sit amet",
      "category": {
        "name": "Category A"
      }
    }
    ```

- **GET /categories**
  - **Deskripsi:** Mengambil daftar semua kategori.
  - **Contoh Request:**
    ```http
    GET /categories
    ```
  - **Contoh Response:**
    ```json
    [
      {
        "id": 1,
        "name": "Category A"
      },
      {
        "id": 2,
        "name": "Category B"
      }
    ]
    ```

- **GET /categories/:id**
  - **Deskripsi:** Mengambil detail kategori berdasarkan ID.
  - **Contoh Request:**
    ```http
    GET /categories/1
    ```
  - **Contoh Response:**
    ```json
    {
      "id": 1,
      "name": "Category A"
    }
    ```

- **GET /search**
  - **Deskripsi:** Mencari produk berdasarkan query.
  - **Contoh Request:**
    ```http
    GET /search?q=product&page=1
    ```
  - **Contoh Response:**
    ```json
    [
      {
        "id": 1,
        "name": "Product 1",
        "price": 10.99,
        "description": "Lorem ipsum dolor sit amet",
        "category": {
          "name": "Category A"
        }
      },
      {
        "id": 2,
        "name": "Product 2",
        "price": 19.99,
        "description": "Lorem ipsum dolor sit amet",
        "category": {
          "name": "Category B"
        }
      }
    ]
    ```

### Parameter Query (GET /search)

| Parameter | Tipe Data | Deskripsi                 |
| --------- | --------- | ------------------------- |
| q         | String    | Query pencarian produk.   |
| page      | Number    | Nomor halaman (opsional). |

### Error Responses

- **400 Bad Request**
  - **Message:** "Invalid ID"

- **500 Internal Server Error**
  - **Message:** "Internal server error"

### Otorisasi

Endpoint ini tidak memerlukan otorisasi. Semua endpoint dapat diakses secara publik.

---

## Register API Endpoint

Digunakan untuk mendaftarkan pengguna baru.

### Endpoint

- **POST /register**
  - **Deskripsi:** Mendaftarkan pengguna baru.
  - **Contoh Request:**
    ```http
    POST /register
    Content-Type: application/json

    {
      "email": "user@example.com",
      "name": "John Doe",
      "password": "password123"
    }
    ```
  - **Contoh Response:**
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "email": "user@example.com",
        "name": "John Doe"
      }
    }
    ```

### Request Body

| Parameter | Tipe Data | Deskripsi                              |
| --------- | --------- | -------------------------------------- |
| email     | String    | Email pengguna yang akan didaftarkan. |
| name      | String    | Nama lengkap pengguna.                 |
| password  | String    | Kata sandi pengguna.                   |

### Error Responses

- **400 Bad Request**
  - **Message:** "Missing required fields"
  - **Message:** "User already exists"

### Authorization

Tidak diperlukan otorisasi untuk mengakses endpoint ini.


---

Berikut adalah dokumentasi untuk API autentikasi pengguna:

---

## Autentikasi Pengguna API Endpoint

Digunakan untuk mengotentikasi pengguna dan menghasilkan token akses.

### Endpoint

- **POST /token**
  - **Deskripsi:** Mengotentikasi pengguna dan menghasilkan token akses.
  - **Contoh Request:**
    ```http
    POST /token
    Content-Type: application/json

    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Contoh Response:**
    ```json
    {
      "data": {
        "user_id": 123,
        "email": "user@example.com",
        "role_id": 1,
        "role": "buyer"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGVfaWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY0NTg2OTQxMiwiZXhwIjoxNjQ4MjcwMjEyfQ.A8JK52JK0YoZPrphJ7SRoh7oNANZlgt1fr8JYwP6tRs"
    }
    ```

### Request Body (POST /token)

| Parameter | Tipe Data | Deskripsi               |
| --------- | --------- | ----------------------- |
| email     | String    | Email pengguna.         |
| password  | String    | Kata sandi pengguna.   |

### Error Responses

- **401 Unauthorized**
  - **Message:** "Invalid email or password"
  - **Message:** "User is blocked"

### Authorization

Tidak diperlukan otorisasi untuk mengakses endpoint ini. Namun, pengguna harus mengirimkan kredensial (email dan kata sandi) dalam body request untuk mengotentikasi pengguna. Setelah berhasil diotentikasi, token akses akan diberikan dalam respons.

---

## Profil Pengguna API Endpoint

Digunakan untuk mengelola profil pengguna.

### Endpoint

- **GET /user**
  - **Deskripsi:** Mendapatkan informasi profil pengguna yang sedang masuk.
  - **Contoh Request:**
    ```http
    GET /user
    ```
  - **Contoh Response:**
    ```json
    {
      "user": {
        "email": "user@example.com",
        "name": "John Doe"
      }
    }
    ```

- **PUT /user**
  - **Deskripsi:** Memperbarui profil pengguna yang sedang masuk.
  - **Contoh Request:**
    ```http
    PUT /user
    Content-Type: application/json

    {
      "email": "newemail@example.com",
      "name": "John Doe",
      "password": "newpassword123"
    }
    ```
  - **Contoh Response:**
    ```json
    {
      "message": "Profil updated successfully",
      "user": {
        "email": "newemail@example.com",
        "name": "John Doe",
        "password": "newpassword123"
      }
    }
    ```

- **DELETE /user**
  - **Deskripsi:** Menghapus profil pengguna yang sedang masuk.
  - **Contoh Request:**
    ```http
    DELETE /user
    ```
  - **Contoh Response:**
    ```json
    {
      "message": "Profil deleted successfully",
      "user": {
        "email": "user@example.com",
        "name": "John Doe"
      }
    }
    ```

### Request Body (PUT /user)

| Parameter | Tipe Data | Deskripsi                                   |
| --------- | --------- | ------------------------------------------- |
| email     | String    | Email baru pengguna (opsional).             |
| name      | String    | Nama lengkap baru pengguna (opsional).      |
| password  | String    | Kata sandi baru pengguna (opsional).        |

### Error Responses

- **400 Bad Request**
  - **Message:** "Missing required fields name, email and password"

### Authorization

Otorisasi diperlukan untuk mengakses endpoint PUT dan DELETE, pengguna harus masuk terlebih dahulu dan mengirimkan token akses yang valid.

---

## Category API Endpoint

Digunakan untuk manajemen kategori produk.

### Endpoint

- **POST /categories**
  - **Deskripsi:** Membuat kategori baru.
  - **Permission:** `ADD_CATEGORY`
  - **Contoh Request:**
    ```http
    POST /categories
    Content-Type: application/json

    {
      "name": "Electronics"
    }
    ```
  - **Contoh Response:**
    ```json
    {
      "message": "Category created successfully",
      "category": {
        "id": 1,
        "name": "Electronics"
      }
    }
    ```

- **PUT /categories/:id**
  - **Deskripsi:** Mengedit kategori berdasarkan ID.
  - **Permission:** `EDIT_CATEGORY`
  - **Contoh Request:**
    ```http
    PUT /categories/1
    Content-Type: application/json

    {
      "name": "Appliances"
    }
    ```
  - **Contoh Response:**
    ```json
    {
      "message": "Category updated successfully",
      "category": {
        "id": 1,
        "name": "Appliances"
      }
    }
    ```

- **DELETE /categories/:id**
  - **Deskripsi:** Menghapus kategori berdasarkan ID.
  - **Permission:** `DELETE_CATEGORY`
  - **Contoh Request:**
    ```http
    DELETE /categories/1
    ```
  - **Contoh Response:**
    ```json
    {
      "message": "Category deleted successfully",
      "category": {
        "id": 1,
        "name": "Appliances"
      }
    }
    ```

### Authorization

- **Permission:** `ADD_CATEGORY`
  - Deskripsi: Izin untuk membuat kategori baru.
- **Permission:** `EDIT_CATEGORY`
  - Deskripsi: Izin untuk mengedit kategori.
- **Permission:** `DELETE_CATEGORY`
  - Deskripsi: Izin untuk menghapus kategori.

### Error Responses

- **400 Bad Request**
  - **Message:** "Missing required fields" atau "Invalid ID"
- **404 Not Found**
  - **Message:** "Not found"



---

## Produk API Endpoint

Digunakan untuk menambah, mengubah, dan menghapus produk.

### Endpoints

- **POST /products**
  - **Deskripsi:** Menambahkan produk baru.
  - **Permission:** `ADD_PRODUCT`
  - **Contoh Request:**
    ```http
    POST /products
    Content-Type: application/json

    {
      "name": "Nama Produk",
      "category_id": 1,
      "price": 100,
      "in_stock": true,
      "description": "Deskripsi Produk"
    }
    ```
  - **Contoh Response:**
    ```json
    {
      "message": "Product created successfully",
      "product": {
        "id": 1,
        "name": "Nama Produk",
        "category": {
          "name": "Nama Kategori"
        },
        "price": 100,
        "in_stock": true,
        "description": "Deskripsi Produk"
      }
    }
    ```

- **PUT /products/:id**
  - **Deskripsi:** Memperbarui produk berdasarkan ID.
  - **Permission:** `EDIT_PRODUCT`
  - **Contoh Request:**
    ```http
    PUT /products/1
    Content-Type: application/json

    {
      "name": "Nama Produk Baru",
      "category_id": 2,
      "price": 150,
      "in_stock": false,
      "description": "Deskripsi Produk Baru"
    }
    ```
  - **Contoh Response:**
    ```json
    {
      "message": "Product updated successfully",
      "product": {
        "id": 1,
        "name": "Nama Produk Baru",
        "category": {
          "name": "Nama Kategori Baru"
        },
        "price": 150,
        "in_stock": false,
        "description": "Deskripsi Produk Baru"
      }
    }
    ```

- **DELETE /products/:id**
  - **Deskripsi:** Menghapus produk berdasarkan ID.
  - **Permission:** `DELETE_PRODUCT`
  - **Contoh Request:**
    ```http
    DELETE /products/1
    ```
  - **Contoh Response:**
    ```json
    {
      "message": "Product deleted successfully",
      "product": {
        "id": 1,
        "name": "Nama Produk Baru",
        "category": {
          "name": "Nama Kategori Baru"
        },
        "price": 150,
        "in_stock": false,
        "description": "Deskripsi Produk Baru"
      }
    }
    ```

### Authorization

- **Permission:** `ADD_PRODUCT`
  - Deskripsi: Izin untuk menambahkan produk baru.
- **Permission:** `EDIT_PRODUCT`
  - Deskripsi: Izin untuk mengubah detail produk.
- **Permission:** `DELETE_PRODUCT`
  - Deskripsi: Izin untuk menghapus produk.

### Error Responses

- **400 Bad Request**
  - **Message:** "Missing required fields" atau "Invalid ID"
- **404 Not Found**
  - **Message:** "Not found"

---

## Cart API Endpoint

Digunakan untuk manajemen keranjang belanja pengguna.

### Endpoint

- **GET /cart**
  - **Deskripsi:** Mendapatkan detail keranjang belanja pengguna.
  - **Permission:** `BROWSE_CART`
  - **Contoh Request:**
    ```http
    GET /cart
    ```
  - **Contoh Response:**
    ```json
    {
      "cart": [
        {
          "id": 1,
          "product_id": 123,
          "quantity": 2,
          "total": 50
        },
        {
          "id": 2,
          "product_id": 456,
          "quantity": 1,
          "total": 30
        }
      ],
      "total": 80
    }
    ```

- **POST /cart**
  - **Deskripsi:** Menambahkan barang ke keranjang belanja pengguna.
  - **Permission:** `ADD_CART`
  - **Contoh Request:**
    ```http
    POST /cart
    Content-Type: application/json

    {
      "product_id": 789,
      "quantity": 3
    }
    ```
  - **Contoh Response:**
    ```json
    {
      "message": "Cart created successfully",
      "cart": {
        "id": 3,
        "product_id": 789,
        "quantity": 3,
        "total": 90
      }
    }
    ```

- **DELETE /cart/:id**
  - **Deskripsi:** Menghapus barang dari keranjang belanja pengguna berdasarkan ID.
  - **Permission:** `DELETE_CART`
  - **Contoh Request:**
    ```http
    DELETE /cart/2
    ```
  - **Contoh Response:**
    ```json
    {
      "message": "Cart deleted successfully"
    }
    ```

- **DELETE /cart**
  - **Deskripsi:** Mengosongkan keranjang belanja pengguna.
  - **Permission:** `DELETE_CART`
  - **Contoh Request:**
    ```http
    DELETE /cart
    ```
  - **Contoh Response:**
    ```json
    {
      "message": "Cart emptied successfully"
    }
    ```

### Authorization

- **Permission:** `BROWSE_CART`
  - Deskripsi: Izin untuk melihat isi keranjang belanja.
- **Permission:** `ADD_CART`
  - Deskripsi: Izin untuk menambahkan barang ke keranjang belanja.
- **Permission:** `DELETE_CART`
  - Deskripsi: Izin untuk menghapus barang dari keranjang belanja.

### Error Responses

- **404 Not Found**
  - **Message:** "Product not found" atau "Cart item not found"


---

## Orders API Endpoint

Digunakan untuk membuat, mengelola, dan melihat pesanan.

### Endpoint

- **GET /orders**
  - **Deskripsi:** Mendapatkan daftar pesanan.
  - **Permission:** `BROWSE_ORDERS`
  - **Contoh Request:**
    ```http
    GET /orders
    ```
  - **Contoh Response:**
    ```json
    [
      {
        "id": 1,
        "date": "2024-02-18T12:00:00.000Z",
        "number": "ORD/123",
        "user_id": 1,
        "total": 100
      },
      {
        "id": 2,
        "date": "2024-02-17T12:00:00.000Z",
        "number": "ORD/124",
        "user_id": 2,
        "total": 200
      }
    ]
    ```

- **GET /orders/:id**
  - **Deskripsi:** Mendapatkan detail pesanan berdasarkan ID.
  - **Permission:** `READ_ORDER`
  - **Contoh Request:**
    ```http
    GET /orders/1
    ```
  - **Contoh Response:**
    ```json
    {
      "id": 1,
      "date": "2024-02-18T12:00:00.000Z",
      "number": "ORD/123",
      "user_id": 1,
      "total": 100,
      "order_items": [
        {
          "id": 1,
          "product_id": 1,
          "quantity": 2,
          "total": 50,
          "price": 25,
          "product": {
            "id": 1,
            "name": "Product 1",
            "price": 25
          }
        },
        {
          "id": 2,
          "product_id": 2,
          "quantity": 1,
          "total": 50,
          "price": 50,
          "product": {
            "id": 2,
            "name": "Product 2",
            "price": 50
          }
        }
      ]
    }
    ```

- **POST /orders**
  - **Deskripsi:** Membuat pesanan baru dari keranjang.
  - **Permission:** `ADD_ORDER`
  - **Contoh Request:**
    ```http
    POST /orders
    ```
  - **Contoh Response:**
    ```json
    {
      "message": "Order created successfully",
      "order": {
        "id": 3,
        "date": "2024-02-18T12:00:00.000Z",
        "number": "ORD/125",
        "user_id": 1,
        "total": 100
      }
    }
    ```

- **POST /orders/pay**
  - **Deskripsi:** Melakukan pembayaran untuk pesanan tertentu.
  - **Permission:** `ADD_ORDER`
  - **Contoh Request:**
    ```http
    POST /orders/pay
    Content-Type: application/json

    {
      "orderNumber": "ORD/125",
      "cardNumber": "4111111111111111",
      "cvv": "123",
      "expiryMonth": "12",
      "expiryYear": "25"
    }
    ```
  - **Contoh Response:**
    ```json
    {
      "message": "success",
      "payment": {"message": "Payment successful",
        "data": {
            "transcationId": "4990936139832615",
            "amount": 1875,
            "date": "2024-02-18T11:28:29.909Z"
        }}
    }
    ```

### Kartu Kredit Valid

Berikut adalah nomor kartu kredit yang valid yang dapat digunakan untuk pembayaran:

- 4111111111111111
- 4012888888881881
- 4917610000000000
- 5105105105105100
- 6011111111111117
- 3530111333300000
- 3566002020360505
- 2223000048400011
- 2223520043560014
- 5555555555554444
- 5105105105105100
- 3782822463100052
- 3714496353984314

Pastikan untuk menggunakan salah satu nomor kartu kredit yang valid saat melakukan pembayaran.

### Authorization

- **Permission:** `BROWSE_ORDERS`
  - Deskripsi: Izin untuk melihat daftar pesanan.
- **Permission:** `READ_ORDER`
  - Deskripsi: Izin untuk melihat detail pesanan.
- **Permission:** `ADD_ORDER`
  - Deskripsi: Izin untuk membuat pesanan baru.

### Error Responses

- **400 Bad Request**
  - **Message:** "Cart is empty. Cannot create order" atau "Missing order or payment data"
- **401 Unauthorized**
  - **Message:** "Order already paid" atau "Order payment failed"
- **404 Not Found**
  - **Message:** "Order not found"


---



