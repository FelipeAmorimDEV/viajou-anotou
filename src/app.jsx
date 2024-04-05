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


      <main className="main-home">
        <section>
          <h1>Você viaja o mundo. <br />E o ViajouAnotou mantém suas aventuras anotadas.</h1>
          <h2>Um mapa mundial que rastreia por onde você passou. Nunca esqueça suas experiências e mostre aos seus amigos o quê você fez pelo mundo.</h2>
          <a className="cta" href="">Começar agora</a>
        </section>
      </main>

    </div>
  )
}

export { App }
