<h1><b>Nestjs-cloud-setup</b></h1>
This app is NestJs based exercise of simple cloud based app connected to different services like, influxdb, postgres, SQLite, logstash, Prometheus, minikube.It is next iteration of cloud-setup previous versions are express-cloud-setup and spring-cloud-setup.<br>
<b>default app port: 3010</b>

<br>
<h2><b>TL;DR</b></h2>
To run the app execute : "npm run start" or using Vs-code (launch.json is present to enable debugging).
To enable connection to additional services like influx,logstash etc. Uncomment their section in config.yaml and run those services locally or locally in the docker.

You can only run 1 database at a time (SQLite or Postgres).
<h3><b>How-To</b></h3>

<p><b>To run end-to-end tests</b><br>
Execute "npm run test:e2e
</p>
<p><b>To run unit tests</b><br>
Execute "npm run test
</p>
<p><b>To generate git.properties</b><br>
Execute "npm run saverepoinfo"
</p>

<p><b>To generate contract tests</b><br>
Execute "npm run test:contract"
</p>
<p><b>To verify contract tests</b><br>
Execute "npm run test:contract-verifier"
</p>
<p><b>Run the simplified app in docker</b>

To run the most basic configuration of the app + postgres db, You can use docker-compose.yml. For the app to work correctly when containers are up please create and run migrations from the localhost or add script to do so.

Command : "docker-compose up" or "docker-compose up --build" if You want to rebuild this app image (if it is present).

To run everything in docker You have to adjust docker-compose.yml 
</p>
<br>
<h4><b>Deploy app to kubernetes</b></h4>
<p>
To create deployment and service You can use nestjs-deployment/service.yaml with command "kubectl apply (-f FILENAME | -k DIRECTORY)"
If You want deployment/service to work remember to use proper name whe creating and pushing app docker build and to properly set Prometheus port
to properly scrap metrics (default prometheus port is 8080 when deployed through helm-chart).

<b>When app is deployed remember to create and run migrations.</b><br>
Easiest way to do so is to pipe k8s service (kubectl service "name") and create/run migration from localhost.
</p>