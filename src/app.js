const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4")

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ message: "Invalid id!" });
  }

  const repository = repositories.find(x => x.id === id);

  if(!repository) {
    return response.status(400).json({ message: "Repository not found!" });
  }

  return next();
}

app.use("/repositories/:id", validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 
  };

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const repository = repositories.find(x => x.id === id);

  title && (repository.title = title);
  url && (repository.url = url);
  techs && (repository.techs = techs);

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  repositories.filter(x => x.id !== id);
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repository = repositories.find(x => x.id === id);

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
