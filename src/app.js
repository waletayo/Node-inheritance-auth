import config from 'config';
import databaseInitialization from "./setup/database";
import loadExpress from './setup/express';
import loadRoute from './api/index';
import serverSetup from './setup/server';
import Q from 'q';

export default databaseInitialization(config)
    .then(()=>{
        return loadExpress;
    })
    .then((app)=>{
        return loadRoute(app);
    })
    .then(async (app) =>{
        const server =await serverSetup(app);
        console.log(`Application listening on ${config.get('app.baseUrl')},
        
       Environment=>${config.util.getEnv('NODE_ENV')} ${server}`);

        return Q.resolve(app);
    },err=>{
        console.log("There was an un catch error : ");
        console.error(err);
    })

