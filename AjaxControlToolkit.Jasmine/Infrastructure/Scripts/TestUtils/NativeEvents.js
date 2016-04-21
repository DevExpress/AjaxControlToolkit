function createMouseEvent(type, target) 
{
    var event = document.createEvent("MouseEvent");
    event.initMouseEvent(type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    Object.defineProperty(event, "target", { value: target, enumerable: true });
    return event;
}