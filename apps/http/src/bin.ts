import cluster from 'cluster'
import os from 'os';
import { app } from './index';

if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < 2 /*numCPUs*/; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        console.log('Spawning a new worker...');
        cluster.fork();
    });
} else {
    app.listen(8081, () => {console.log(`Server is running ${process.pid} on http://localhost:8081`)})
    process.on('SIGINT', () => {
        console.log('Server shutting down...');
        process.exit();
    });
}