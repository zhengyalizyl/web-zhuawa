declare module '*.module.less';
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}