/** @jsxImportSource @emotion/react */
import { css, Interpolation, SerializedStyles, Theme } from '@emotion/react'
import { ImgHTMLAttributes } from 'react'

const avatarStyles = css`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    border: 1px solid #e5e7eb;   
`

// ========================================
export type AvatarProps =
    & Partial<
        & Pick<
            ImgHTMLAttributes<HTMLImageElement>,
            | "src"
            | "alt"
        >
        & {
            css: Interpolation<Theme>
        }
    >



// ========================================
export const Avatar: React.FC<AvatarProps> = ({
    src
    , alt = "Profile"
    , css
    , ...rest
}) => {
    return (
        <img
            {...rest}
            css={{
                ...avatarStyles
                , css
            } as SerializedStyles}
            src={src}
            alt={alt}
        />
    )
}
