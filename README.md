## 🚀 **CI/CD Kit with Node/Express to Binary**

**Webhook Services CI/CD Kit** This service is used for handle CI/CD Binary about Restapps.

### **`Technology Stacks 🍔`**

```
  -- ExpressJs (Typescript)
  -- Webhook Handler
  -- Bot Telegram
```

### **`Project Structures 🏢`**

```
.
└── README.md
└── package.json
└── ormconfig.ts
└── .prettierrc
└── .prettierignore
└── .gitignore
└── .eslintrc.json
└── env-example       (this will be the environment file)
└── src/
    └── ...[.ts]
```

### Flow Development

During the development cycle, a variety of supporting branches are used :

- **\*feature/\*\*** -- feature branches are used to development new features for the upcoming releases. May branch off from development and must merge into development.
- **\*hotfix/\*\*** -- hotfix branches are necessary to act immediately upon an undesired status of master. May branch off from master and must merge into master, staging, and development.

Creating a new **_feature_**

1. create new branch from development. ex: `feature/name-of-feature`.
1. write your code.
1. commit & push your work to the same named branch on the server.
1. create PR into development branch for testing in dev server.

Creating a new **_hotfix_**

1. create new branch from master. ex: `hotfix/name-of-hotfix`.
1. write your code.
1. commit & push your work to the same named branch on the server.
1. create PR into master branch.

### How to install

1. clone this repo [webhook-serviceg](#) into `nodejs/path/`
1. go to webhook-on-premise `cd nodejs/path/api-on-premise`
1. copy env-example into .env `cp env-example .env`
1. ajust config in .env
1. build dependency `npm install`
1. run project `npm run start or nodemon`

### Deployment

This flow of deployment using Git Flow with 3 main branches

- master -- this branch contains production code. All development code is merged into master in sometime.
- staging -- this branch is a nearly exact replica of a production environment for software testing.
- development -- this branch contains pre-production code. When the features are finished then they are merged into develop.

### Command

- run program `npm run start` or `nodemon`
- build program `npm run prod`

### Build the binary
Just run `npm run prod` it build the binary named `webhook-service`
