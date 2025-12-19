import { Container, Row, Col, Button } from "react-bootstrap"
import "../styles/global.css";  
export default function Hero() {
  return (
    <section
      style={{
        backgroundColor: "#1d3355ff",
        color: "white",
        padding: "80px 0",
        textAlign: "center",
      }}
    >
      <Container>
        <Row className="align-items-center">
          <Col lg={12}>
            <h1 className="mb-3" style={{ fontSize: "3rem", fontWeight: "bold" }}>
              Découvrez les meilleures annonces
            </h1>
            <p className="mb-4" style={{ fontSize: "1.3rem" }}>
              Publiez, explorez et connectez-vous avec des vendeurs et acheteurs fiables
            </p>
            <div className="d-flex gap-3 justify-content-center align-items-center flex-wrap">
              <a href="/Boutique">
                <Button
                  size="lg"
                  style={{
                    backgroundColor: "white",
                    color: "#1d3355ff",
                    border: "2px solid white",
                    fontWeight: "600",
                    padding: "12px 30px",
                  }}
                >
                  Voir les annonces
                </Button>
              </a>
              <a href="/Annonces">
                <Button
                  size="lg"
                  style={{
                    backgroundColor: "transparent",
                    color: "white",
                    border: "2px solid white",
                    fontWeight: "600",
                    padding: "12px 30px",
                  }}
                >
                  Publier Annonce
                </Button>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
