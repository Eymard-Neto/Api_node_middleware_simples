const { response } = require('express');

const express = require('express'),
app = express(),
cors = require('cors'),
{uuid, isUuid} = require('uuidv4'); // universal unique id

app.use(cors());
app.use(express.json()); // Precisa desse use para receber entradas json

/**
 * Métodos HTTP
 * 
 * GET: BUscar informações do back-end
 * POST: Criar uma informação no backend
 * PUT/PATCH: Alterar uma informação no back-end
 * DELETE: Deletar uma informação
 */

 /**
 *
 * Query Params: Filtros e paginação ('?filter=Nome...')
 * Route Params: Identificar recursos para atualizar ou deletar
 * Request Body: Conteúdo na hora de criar ou editar um recurso (JSON)
 */

 /**
  * Middleware:
  * 
  * Interceptador de requisições
  * Pode interromper totalmente ou alterar dados da requisição
  * 
  */

const projects = [];

const logRequest = (req, res, next) => {
    const { method, url} = req,
    logLabel = `[${method.toUpperCase()}] ${url}`
    console.log(logLabel);
    
    return next(); // Passar para o próximo middleware
};

const validateProjectId = (req, res, next) => {
    const { id } = req.params;

    if (!isUuid(id)) {
        return res.status(400).json({error:'Invalid project ID.'});
    }

    return next();
}

app.use(logRequest);
app.use('/projects/:id', validateProjectId);

app.get('/projects',(req,res)=>{
    const {title} = req.query;

    const results = title
    ? projects.filter(project => project.title.includes(title))  
    : projects;

    return res.json(results);

});

app.post('/projects',(req,res) =>{
    const {title, owner} = req.body;

    const project = {id: uuid(), title, owner};

    projects.push(project);
    return res.json(project);
});

app.put('/projects/:id',(req,res) =>{
    const {id} = req.params;
    const {title, owner} = req.body;

    const projectIndex = projects.findIndex(project => project.id === id); 
    
    if (projectIndex < 0) {
       return res.status(400).json({error: 'project not found.'}) 
    }

    const project = {
        id,
        title,
        owner
    }

    projects[projectIndex] = project;
    
    return res.json(project);
});
app.delete('/projects/:id',(req,res) =>{

    const {id} = req.params;

    const projectIndex = projects.find(project => project.id === id);

    if (projectIndex < 0) {
        return res.status(400).json({error: 'project not found.'}) 
     
    }
    projects.splice(projectIndex,1);

    return res.status(204).send(); 
});

app.listen(3333,() =>{
    console.log('8=D Backend Started!')
});