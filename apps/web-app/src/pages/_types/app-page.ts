

export type FeatureProps = {
    isVisible?: boolean
}


type AppPage_FC<P> = React.FC<P>
export namespace AppPage {
    export type FC<P> = AppPage_FC<P>
}