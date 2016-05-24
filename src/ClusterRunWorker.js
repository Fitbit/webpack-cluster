import ClusterWorker from './ClusterWorker';
import ClusterForkRunStrategy from './ClusterForkRunStrategy';

ClusterWorker.use(ClusterForkRunStrategy);
