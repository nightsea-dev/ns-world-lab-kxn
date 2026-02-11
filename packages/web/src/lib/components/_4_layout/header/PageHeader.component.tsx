import { ReactNode, useState } from 'react'
import { HasAuthor, HasTitle, HasUser, User } from "@ns-world-lab-kxn/types"
import { _memo, PickHtmlAttributes } from '../../../utils'
import { Avatar } from '../../_1_primitive'

// ======================================== props
export type PageHeaderContentWithUserProps =
    & Partial<
        & HasUser
    >
export type PageHeaderProps =
    & Partial<
        & PageHeaderContentWithUserProps
        & HasTitle<ReactNode>
        & PickHtmlAttributes<"children">
        & {
            midContent: ReactNode
        }
    >

// ======================================== components

const PageHeaderContentWithUser = ({
    user
}: PageHeaderContentWithUserProps
) => {
    const { avatarSrc } = _memo([user?.uuid], () => ({
        avatarSrc: user?.uuid ? `https://i.pravatar.cc/150?u=${user.uuid}` : undefined
    }))
    return user && (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
                {user.name}
            </span>
            <Avatar
                src={avatarSrc}
            />
        </div >)
}
// ======================================== components
/**
 * * [domain] aware
 */
export const PageHeader = ({
    title
    , user
    , children
    , midContent
}: PageHeaderProps
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
                : <PageHeaderContentWithUser />
            }
        </header>
    )
}
