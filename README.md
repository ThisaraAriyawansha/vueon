# Vueon 🎥  

A full-stack **video upload and sharing platform** built with **React, TailwindCSS, Node.js, and MySQL**.  
Vueon lets users create channels, upload and manage videos, subscribe to channels, comment, like videos, and more.  
Admins have moderation controls, while an **AI-powered semantic search** engine makes it easier to discover relevant videos.  

Live Demo: [vueon.vercel.app](https://vueon.vercel.app)  

---

## 🚀 Features  

### 🎬 User Features  
- Create and manage your own channel  
- Upload, edit, and delete videos  
- Subscribe/unsubscribe to channels  
- Like, dislike, and comment on videos  
- View personalized video feeds  

### 🛠️ Admin Features  
- Manage user accounts  
- Control video visibility (approve, block, or remove)  
- Moderate comments and community activity  

### 🤖 AI Semantic Search  
- Generates embeddings for videos using Transformer models  
- Stores embeddings alongside metadata in database  
- Supports **semantic search** (find videos by meaning, not just keywords)  
- **Hybrid search**: combines semantic + keyword results  
- Batch processing for efficiency  
- Persistence and debugging endpoints for monitoring search pipeline  

---

## 🏗️ Tech Stack  

**Frontend**  
- React.js  
- TailwindCSS  
- Axios (API requests)  

**Backend**  
- Node.js  
- Express.js  
- JWT Authentication  
- Multer (for video uploads)  

**Database**  
- MySQL (structured relational data)  

**AI Layer**  
- Transformer model for embeddings  
- Vector storage in DB for semantic search  

**Deployment**  
- Vercel (frontend)  
- Backend + Database on your hosting/cloud choice  



