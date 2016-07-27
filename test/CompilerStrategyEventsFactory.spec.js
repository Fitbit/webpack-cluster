import CompilerStrategyEventsFactory from '../src/CompilerStrategyEventsFactory';

const SILENT_EVENTS = [],
    SIMPLE_EVENTS = [
        'run',
        'watch',
        'find',
        'compilationStart',
        'compilationStats',
        'done',
        'time'
    ],
    PRETTY_EVENTS = [
        'run',
        'watch',
        'find',
        'compilationStart',
        'compilationProgress',
        'compilationDone',
        'compilationStats',
        'done',
        'time'
    ],
    WATCH_EVENTS = [
        'run',
        'watch',
        'compilationStart',
        'compilationStats'
    ];

describe('CompilerStrategyEventsFactory', () => {
    describe('.createEvents()', () => {
        it('should return empty events when `silent` is `true`', () => {
            const events = CompilerStrategyEventsFactory.createEvents({
                silent: true
            });

            expect(Object.keys(events)).toEqual(SILENT_EVENTS);
        });

        it('should return pretty events when `progress` is `true`', () => {
            let isTTY = false;

            if (!process.stdout.isTTY) {
                process.stdout.isTTY = true;
                isTTY = true;
            }

            const events = CompilerStrategyEventsFactory.createEvents({
                progress: true
            });

            expect(Object.keys(events)).toEqual(PRETTY_EVENTS);

            if (isTTY) {
                delete process.stdout.isTTY;
            }
        });

        it('should return watch events when `watch` is `true`', () => {
            const events = CompilerStrategyEventsFactory.createEvents({
                watch: true
            });

            expect(Object.keys(events)).toEqual(WATCH_EVENTS);
        });

        it('should return simple events in other cases', () => {
            const events = CompilerStrategyEventsFactory.createEvents({});

            expect(Object.keys(events)).toEqual(SIMPLE_EVENTS);
        });
    });
});
