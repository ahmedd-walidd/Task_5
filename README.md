


# Campus Life & Perks Platform — MERN Starter



## Quick Start

* Fork this repository (top right corner).
* Clone the repository to your laptop.
- create `.env` file [inside server folder] and add `MONGO_URI` and `JWT_SECRET` variables.

```bash
# 1) Setup 
# (Backend)
cd server
# edit .env (MONGO_URI, JWT_SECRET)
npm install

# (Frontend)
cd ../client
npm install

# 2) Run
# Terminal A (Backend)
cd server && npm run dev
# Terminal B (Frontend)
cd client && npm run dev
```

- Backend runs at `http://localhost:4000`
- Frontend runs at `http://localhost:5175`
- API base path: `/api`

# DB LINKS

Hadwa's groups:
 ```
 mongodb://Hadwa:Hadwa@ac-tl77fwg-shard-00-00.hpstsct.mongodb.net:27017,ac-tl77fwg-shard-00-01.hpstsct.mongodb.net:27017,ac-tl77fwg-shard-00-02.hpstsct.mongodb.net:27017/?ssl=true&replicaSet=atlas-4jfj3v-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0
 ```

Noha's groups:
 ```
 mongodb://database:1234@ac-5otzmjg-shard-00-00.insh6i0.mongodb.net:27017,ac-5otzmjg-shard-00-01.insh6i0.mongodb.net:27017,ac-5otzmjg-shard-00-02.insh6i0.mongodb.net:27017/?ssl=true&replicaSet=atlas-b4fbz1-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0
 ```

Nada's groups:
 ```
 mongodb://atlasDB:atlasDB@cluster0-shard-00-00.vt5cm.mongodb.net:27017,cluster0-shard-00-01.vt5cm.mongodb.net:27017,cluster0-shard-00-02.vt5cm.mongodb.net:27017/?ssl=true&replicaSet=atlas-1qb2ed-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0
```
Ziad's groups:
```
mongodb://ZiadElsabbagh:Ziad1234@ac-c8umrgv-shard-00-00.ehcvpo6.mongodb.net:27017,ac-c8umrgv-shard-00-01.ehcvpo6.mongodb.net:27017,ac-c8umrgv-shard-00-02.ehcvpo6.mongodb.net:27017/?ssl=true&replicaSet=atlas-uux8uh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Ziad 
 ```
Mabrouk's groups:
 ```
 mongodb://gucACL:ACL123@ac-kvelmry-shard-00-00.klnokrh.mongodb.net:27017,ac-kvelmry-shard-00-01.klnokrh.mongodb.net:27017,ac-kvelmry-shard-00-02.klnokrh.mongodb.net:27017/?ssl=true&replicaSet=atlas-p1sm0e-shard-0&authSource=admin&retryWrites=true&w=majority&appName=mabrouk
 ```
Karim's groups:
``` 
mongodb://karimahmedx12345_db_user:3j4pXtepJOOqUwdH@ac-8s5sv3m-shard-00-00.sytujrt.mongodb.net:27017,ac-8s5sv3m-shard-00-01.sytujrt.mongodb.net:27017,ac-8s5sv3m-shard-00-02.sytujrt.mongodb.net:27017/?ssl=true&replicaSet=atlas-k9r7jp-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0
 ```    

 # TODO:
- Implement delete a perk by ID functionality in the `perkController.js` file in server folder (BACKEND)
- Implement delete functionality with a window confirm dialog before deletion in the `PerkDetails.jsx` file in client folder(FRONTEND)
- Initially, the user should be able to delete a perk with a window confirmation msg
- Test it on the frontend
- Push it on Github (check the manual if you struggle)
- Show your TA for grading