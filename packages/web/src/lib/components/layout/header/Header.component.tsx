import { ReactNode, useState } from 'react'
import { HasAuthor, HasTitle, HasUser, User } from "@ns-world-lab-knx/types"
import { PickHtmlAttributes } from '../../../utils'
import { Avatar } from '../../ui'

// ======================================== props
export type HeaderContentWithUserProps =
    & Partial<
        & HasUser
    >
export type HeaderProps =
    & Partial<
        & HeaderContentWithUserProps
        & HasTitle<ReactNode>
        & PickHtmlAttributes<"children">
        & {
            midContent: ReactNode
        }
    >

// ======================================== components

const HeaderContentWithUser = ({
    user
}: HeaderContentWithUserProps
) => {
    return user && (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
                {user.name}
            </span>
            <Avatar
                src={`https://i.pravatar.cc/150?u=${user.uuid}`}
            />
        </div>)
}
// ======================================== components
/**
 * * [domain] aware
 */
export const Header = ({
    title
    , user
    , children
    , midContent
}: HeaderProps
) => {

    return (
        <header
            className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200 shadow-sm"
        >
            <div
                className="text-2xl font-bold text-gray-800"
            >
                {title}
            </div>
            {midContent && <div
                className='inline'
            >{midContent}</div>}
            {user && (
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                        {user.name}
                    </span>
                    <Avatar
                        src={`https://i.pravatar.cc/150?u=${user.uuid}`}
                    />
                </div>)
            }
            {children
                ? (
                    <div>
                        {children}
                    </div>
                )
                : <HeaderContentWithUser />
            }
        </header>
    )
}
