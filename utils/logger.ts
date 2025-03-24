export const info = (...params: any[]): void => {
  console.log(...params)
}

export const error = (...params: any[]): void => {
  console.error(...params)
}

export default {
  info, error
}