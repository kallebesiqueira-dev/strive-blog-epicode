import { Container, Card, Image } from 'react-bootstrap'
import { useAuth } from '../auth'

const Profile = () => {
    const { user } = useAuth()

    if (!user) {
        return null
    }

    return (
        <Container style={{ maxWidth: 480 }} className="mt-5">
            <Card className="p-4 text-center shadow-sm">
                <div>
                    <Image src={user.avatar} roundedCircle width={120} height={120} style={{ objectFit: 'cover' }} />
                </div>
                <h4 className="mt-3">{user.firstName} {user.lastName}</h4>
                <p className="text-muted">{user.email}</p>
                <p className="mb-0">Posts publicados: {user.posts ? user.posts.length : 0}</p>
            </Card>
        </Container>
    )
}

export default Profile
