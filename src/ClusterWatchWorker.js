import ClusterWorker from './ClusterWorker';
import ClusterForkWatchStrategy from './ClusterForkWatchStrategy';

ClusterWorker.use(ClusterForkWatchStrategy);
