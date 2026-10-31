declare module "react-simple-maps" {
  import { ComponentProps, CSSProperties, ReactNode } from "react"

  export interface ProjectionConfig {
    rotate?: [number, number, number]
    scale?: number
    center?: [number, number]
    parallels?: [number, number]
  }

  export interface ComposableMapProps extends ComponentProps<"svg"> {
    projection?: string
    projectionConfig?: ProjectionConfig
    width?: number
    height?: number
  }

  export interface GeographiesProps {
    geography: string | object
    children: (props: { geographies: Geography[] }) => ReactNode
  }

  export interface Geography {
    rsmKey: string
    id: string | number
    properties: Record<string, unknown>
    geometry: object
  }

  export interface GeographyProps extends Omit<
    ComponentProps<"path">,
    "style"
  > {
    geography: Geography
    style?: {
      default?: CSSProperties
      hover?: CSSProperties
      pressed?: CSSProperties
    }
  }

  export interface MarkerProps extends ComponentProps<"g"> {
    coordinates: [number, number]
  }

  export interface LineProps extends ComponentProps<"path"> {
    from: [number, number]
    to: [number, number]
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element
  export function Geographies(props: GeographiesProps): JSX.Element
  export function Geography(props: GeographyProps): JSX.Element
  export function Marker(props: MarkerProps): JSX.Element
  export function Line(props: LineProps): JSX.Element
  export function Graticule(props: ComponentProps<"path">): JSX.Element
  export function Sphere(props: ComponentProps<"path">): JSX.Element
}
