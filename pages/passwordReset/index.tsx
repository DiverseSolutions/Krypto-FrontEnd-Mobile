export default function PasswordReset() {
    return <></>
}

export async function getServerSideProps({ query, res }) {
    res.setHeader('set-cookie', [`email=${query.email}`])

    return {
        redirect: {
            destination: `/?reset=${query.resetCode}`,
            permanent: false
        }
    }
}