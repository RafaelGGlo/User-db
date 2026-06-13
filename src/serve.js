import 'dotenv/config';
import express from "express";
import mysql from "mysql2/promise";


const port = 3000;
const app = express();
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    wintForConnections: true,
    connectionLimit: 10,
    queueLimit:0
})

app.delete('/user/:id', async(req, res) => {
    try{
        const id = req.params.id;
        const rows = await pool.query("DELETE FROM user WHERE id = ?;",
        [id]
);
    res.status(200).json({msg: "Usuario apagando com sucesso!"});
    }
    catch(error){
        console.error("erro ao listar Usuários");
        res.status(500).json({msg: "Erro ao listar Usuário"})
    }
});


// C  
app.post('/user', async (req, res) => {
    try{
        const nome = req.body.nome;
        const email = req.body.email;
        const cpf = req.body.cpf;
        const apelido = req.body.apelido ?? null;
        
        const result = await pool.query(
            "INSERT INTO user (nome, email, cpf, apelido) VALUES(?,?,?,?);",
            [nome, email, cpf, apelido]
        );
    }
    catch(error){
        console.error("Erro ao criar usuário");
        res.status(201).json({msg:"Usuario Criador com sucesso"});
    }
})

// R
app.get("/user", async(req, res) => {
    try{
        const rows = await pool.query("SELECT * FROM user;");
        res.status(200).json(rows[0]);
    }
    catch(erro){
        console.error("Erro ao listar usuários:");
        res.status(500).json({msg: "Erro ao listar Usuário"})
    }
});


app.put("/user/:id", async(req, res) => {
    try{
        const id = req.params.id;
        const nome = req.body.nome;
        const email = req.body.email;
        const cpf = req.body.cpf;
        const apelido = req.body.apelido ?? null;

        const rows = await pool.query(
            "UPDATE user SET nome = ?, email = ?, cpf = ?, apelido = ? WHERE id = ?; ",
            [nome, email, cpf, apelido, id]
        );
        res.status(201).json({msg:"Usuario Criador com sucesso"});
    }catch (error){
        console.error(error);
        res.status(500).json({msg:"Erro ao listar user"})
    }
});
    
app.listen(port, () =>{
        console.log("Servidor rodando na porta" + port);
    });
