import mitt from 'mitt'

export default defineNuxtPlugin(() => {
  const emitter = mitt()

  return {
    provide: {
      emit: emitter.emit,
      emitOn: emitter.on,
      emitOff: emitter.off
    }
  }
})
