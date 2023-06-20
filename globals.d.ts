declare module '*.svg' {
    export const ReactComponent:React.FC<React.SVGProps<SVGElement>>;
    const src: string;
    export default src;
}