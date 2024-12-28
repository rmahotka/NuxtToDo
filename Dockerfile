FROM node:22-alpine

WORKDIR /NuxtToDo

COPY . .

RUN npm i
RUN npm cache clean --force
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]

