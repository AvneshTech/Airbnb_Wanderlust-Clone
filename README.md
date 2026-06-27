<div align="center">

# 🏠 Airbnb Clone  
### 🌍 Full Web Application

<img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" />
<img src="https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge&logo=express" />
<img src="https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb" />
<img src="https://img.shields.io/badge/MVC-Architecture-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />

</div>

---

## ✨ About The Project

This is a **Full Airbnb Clone** built using  
**Node.js, Express.js, MongoDB, and EJS**.

The application allows users to browse property listings stored in a MongoDB database with a structured MVC architecture.

---

## 🚀 Key Features

✔ View all property listings  
✔ MongoDB database integration  
✔ RESTful routing  
✔ Server-side rendering with EJS  
✔ Clean MVC folder structure  
✔ Responsive UI with Bootstrap  

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|----------|
| Node.js | Backend Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| EJS | Templating Engine |
| Bootstrap | Styling |

---

## 📂 Project Structure

```
airbnb-clone/
│
├── models/          # Database Schemas
├── routes/          # Route Handlers
├── views/           # EJS Templates
├── public/          # Static Files
├── init.js          # Database Seeder
├── app.js           # Main Server
├── package.json
└── README.md
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/airbnb-clone.git
cd airbnb-clone
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Start MongoDB

Make sure MongoDB is running locally.

```bash
mongosh
```

Select the database:

```bash
use airbnb
```

(Optional check)

```bash
db.listings.find()
```

---

## 4️⃣ Initialize Database (Only Once)

```bash
nodemon init.js
```

⚠ This inserts sample data into MongoDB. Run this only once.

---

## 5️⃣ Start Server

```bash
nodemon app.js
```

OR

```bash
npx nodemon app.js
```

---

## 🌐 Run Application

Open in your browser:

```
http://localhost:8080/listings
```

---

## 📜 Available Commands

```bash
npm install
nodemon app.js
npx nodemon app.js
```

---

## 🔮 Future Enhancements

- 🔐 Authentication System
- 🏠 Add / Edit / Delete Listings
- ⭐ Reviews & Ratings
- ☁ Deployment (Render)
- 📱 Fully Responsive UI

---

<div align="center">

## 👨‍💻 Author

**Avnesh Kumar** 
GitHub: https://github.com/AvneshTech 

⭐ If you like this project, give it a star on GitHub!

</div>

---

## 📄 License

...........
