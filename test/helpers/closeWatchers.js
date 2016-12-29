/**
 * @param {FSWatcher[]} watchers
 * @returns {void}
 */
export default watchers => {
    if (Array.isArray(watchers)) {
        watchers.filter(watcher => typeof watcher.close === 'function')
            .forEach(watcher => watcher.close());
    }
};
