
const Home = () => {
  return (
    <main className="main-home">
      <section>
        <h1>Você viaja o mundo. <br />E o ViajouAnotou mantém suas aventuras anotadas.</h1>
        <h2>Um mapa mundial que rastreia por onde você passou. Nunca esqueça suas experiências e mostre aos seus amigos o quê você fez pelo mundo.</h2>
        <a className="cta" href="">Começar agora</a>
      </section>
    </main>
  )
}

const Sobre = () => {
  return (
    <main className="main-about">
    <section>
      <div>
        <h1>Sobre o ViajouAnotou.</h1>
        <p>O ViajouAnotou nasceu do desejo dos amigos Paulo e Roberto de compartilharem de forma rápida suas aventuras pelo mundo.</p>
        <p>Aos poucos, esse desejo virou realidade em forma de software entre amigos e familiares. Hoje, você também pode ser parte dessa comunidade.</p>
      </div>
      <img src="sobre-viajou-anotou.jpg" alt="Quatro pessoas sentadas admirando uma paisagem" />
    </section>
  </main>
  )
}

const App = () => {
  return (
    <div className="app">
      <header>
        <nav className="nav">
          <img src="/logo-viajou-anotou-light.png" alt="Logo Viajou Anotou" className="logo" />
          <ul>
            <li><a href="">INÍCIO</a></li>
            <li><a href="">PREÇO</a></li>
            <li><a href="">SOBRE</a></li>
          </ul>
        </nav>
      </header>
    </div>
  )
}

export { App }
