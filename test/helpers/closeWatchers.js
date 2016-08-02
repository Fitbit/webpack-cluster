/**
 * @param {FSWatcher[]} watchers
 * @returns {void}
 */
export default watchers => {
    if (Array.isArray(watchers)) {
        watchers.forEach(watcher => watcher.close());
    }
};
