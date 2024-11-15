// All events inside the BLACK-LIST Array will not trigger updates anymore from angular
// requestAnimationFrame wont trigger change detection
(window as any).__Zone_disable_requestAnimationFrame = true;
// Same for scroll and mousemove or any other event youll add
(window as any).__zone_symbol__BLACK_LISTED_EVENTS = [
    'scroll',
    'mousemove',
    'pointermove',
    'touchmove',
    'setInterval',
    'setTimeout',
    // 'requestAnimationFrame',
];

console.log('blacklisting')
