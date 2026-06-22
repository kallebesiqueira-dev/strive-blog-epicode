import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'

const Home = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/posts')
            .then((data) => setPosts(data.posts || []))
            .catch((err) => {
                if (err.message.toLowerCase().includes('not found')) {
                    setPosts([])
                } else {
                    setError(err.message)
                }
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        )
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Posts</h2>
                <Button as={Link} to="/posts/new">+ Novo Post</Button>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {!error && posts.length === 0 && <p>Nenhum post ainda. Seja o primeiro a publicar!</p>}
            <Row className="g-4">
                {posts.map((post) => (
                    <Col key={post._id} md={4}>
                        <Card
                            className="h-100 shadow-sm"
                            role="button"
                            onClick={() => navigate(`/posts/${post._id}`)}
                        >
                            <Card.Img variant="top" src={post.cover} style={{ height: 180, objectFit: 'cover' }} />
                            <Card.Body>
                                <Card.Subtitle className="text-muted mb-2">{post.category}</Card.Subtitle>
                                <Card.Title>{post.title}</Card.Title>
                                {post.author && (
                                    <Card.Text className="text-muted small">
                                        por {post.author.firstName} {post.author.lastName}
                                    </Card.Text>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default Home
