# ArboDat+
```
├── database
│   ├── data                 # postgresql database bind mount
│   └── ERD
│
├── frontend
│   ├── bootstrap-scss
│   ├── css
│   ├── img
│   ├── js
│   ├── sass
│   │   └── scss files       # are compiled to css files
│   ├── html files
│   └── Dockerfile
│
├── web-api
│   ├── build/libs
│   │   └── web-api.jar
│   ├── src/main
│   │   ├── java/arbodat/plus
│   │   │   ├── controller
│   │   │   ├── model
│   │   │   ├── repository
│   │   │   └── service
│   │   │       ├── migration_mapper
│   │   │       └── MigrationService
│   │   └── resources
│   │       └── application.properties
│   ├── build.gradle
│   └── Dockerfile
|
├── node-proxy
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
│
├── info
│   ├── DANTE-terminologies
│   ├── API-URLs
│   └── data-migration-table-mapping
:
├── .env
├── .gitignore
└── docker-compose.yml
```

### Start ArboDat+ Application:  
##### Requirements: *Docker*
`docker compose --profile prod up -d --build`

## Export ArboDat+
- Build Docker Images:  
  `docker compose --profile prod build --no-cache`
- Export and bundle Docker Images:  
  `docker save -o ArboDat+.tar postgres:16 arbodat_plus-frontend:latest arbodat_plus-web-api:latest arbodat_plus-node-proxy:latest`
- Load Docker Images:  
  `docker load -i ArboDat+.tar`
- Start ArboDat+ via Docker:  
  `docker compose up`


## Development
Start ArboDat+ via Docker in dev mode:  
`docker compose --profile dev build --no-cache`  
`docker compose --profile dev up --build`  
- bind mount of frontend folder into nginx container  
(auto update of frontend changes while Application is running)
- node-proxy is available at http://localhost:3000

### Database - PostgreSQL
Database is created using *postgres:16* Docker Image
  - Creation of test database:  
  `docker run --name test-database -p 5432:5432 --env POSTGRES_PASSWORD=password -d postgres:16`

### Web API - Spring Boot
Web API (backend) is built with *Spring Boot 3.3*, using *Gradle 8.8* as the build tool and *JDK 17* as the runtime environment.
- Run Web-API:  
  *Gradle -> Tasks -> application -> bootRun*

- Build `web-api.jar`:
  - Windows:  
    `cd web-api && gradlew build && cd ..`
    
  - Linux/macOS:  
  `cd web-api && chmod u+x gradlew && cd ..` (make ***gradlew*** file executable)  
  `cd web-api && sudo ./gradlew build && cd ..`

### Frontend
- Compile css files from scss files via *Sass*
  - Recommended settings for [*Live Sass Compiler*](https://marketplace.visualstudio.com/items?itemName=glenn2223.live-sass):  
  copy this to `.vscode/settings.json`: 
    ```
    "liveSassCompile.settings.formats": [
        {
            "format": "compressed",
            "extensionName": ".min.css",
            "savePath": "/frontend/css"
        }
    ],
    "liveSassCompile.settings.forceBaseDirectory": "/frontend/sass"
    ``` 
  - *Live Sass Compiler -> Watch Sass* (to generate css files)

## License
See [LICENSE.md](LICENSE.md) and [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) for details
