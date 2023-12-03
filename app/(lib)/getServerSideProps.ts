import { getServerSession } from "next-auth/next"
import { nextauthOptions } from './nextauthOptions'


export async function getServerSideProps(context: any) {
    const session = await getServerSession(context.req, context.res, nextauthOptions)

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return {
        props: {
            session,
        },
    }
}