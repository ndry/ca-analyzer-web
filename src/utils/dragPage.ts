let curPos: { x: number, y: number } | undefined = undefined;
window.addEventListener('mousedown', ev => curPos = { x: ev.pageX, y: ev.pageY });
window.addEventListener('mouseup', () => curPos = undefined); 
window.addEventListener('mousemove', ev => { 
    if (!curPos) { return; }
    window.scrollBy(curPos.x - ev.pageX, curPos.y - ev.pageY);
});
