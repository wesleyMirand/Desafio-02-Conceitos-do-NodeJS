const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  
  const newProject = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newProject);

  return response.json(newProject);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if(projectIndex === -1 ){
    return response
            .status(400)
            .json({ err: 'Repository not found'});
  }

  const oldProject = repositories(projectIndex);
  
  const updatedProject = {
    ... oldProject,
    title,
    url,
    techs,
  }

  repositories[projectIndex] = updatedProject;

  return response.json(updatedProject);  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if(projectIndex === -1 ){
    return response
            .status(400)
            .json({ err: 'Repository not found'});
  }

  repositories.splice(projectIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if(projectIndex === -1 ){
    return response
            .status(400)
            .json({ err: 'Repository not found'});
  }

  const oldProject = repositories[projectIndex];

  const updatedProject = {
    ...oldProject,
    likes: oldProject.likes + 1,
  }

  repositories[projectIndex] = updatedProject;

  return response.json(updatedProject);
});

module.exports = app;
