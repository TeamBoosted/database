FROM node:8.11.3

# install dependencies
WORKDIR /TeamBoosted/src/app
COPY package.json package-lock.json* ./
RUN npm install

# copy app source image ***AFTER*** npm install so that
# application code changes don't bust the docker cache of npm install step
COPY . .

# set application PORT and expose docker PORT, 80 is what ELASTIC BEANSTALK expects
ENV PORT 8081
EXPOSE 8081

CMD ["npm", "start"]