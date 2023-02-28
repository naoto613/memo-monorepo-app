// eslint-disable-next-line @typescript-eslint/no-empty-function, prettier/prettier
const noop = () => { }
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true })
