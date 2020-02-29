export function getPixelRatio(ctx: CanvasRenderingContext2D) {
    let devicePixelRatio = window.devicePixelRatio || 1
    let backingStorePixelRatio = ctx["webkitBackingStorePixelRatio"] ||
    ctx["mozBackingStorePixelRatio"] ||
    ctx["msBackingStorePixelRatio"] ||
    ctx["oBackingStorePixelRatio"] ||
    ctx["backingStorePixelRatio"] || 1

    return devicePixelRatio / backingStorePixelRatio
}

export function randomNumber(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min)
}