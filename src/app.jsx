import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, NavLink, Link, useLocation } from "react-router-dom"

const Header = () => {
  const location = useLocation()

  const links = [
    { path: '/', text: 'Início' },
    { path: '/sobre', text: 'Sobre' },
    { path: '/preco', text: 'Preço' }
  ]
  const isDarkTheme = location.pathname === '/sobre' || location.pathname === '/preco'

  return (
    <header>
      <nav className="nav">
        <Link to="/"><img src={`/logo-viajou-anotou-${isDarkTheme ? 'dark' : 'light'}.png`} alt="Logo Viajou Anotou" className="logo" /></Link>
        <ul>
          {links.map(link => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                style={{ color: isDarkTheme ? '#c2c2c2' : null }}>
                {link.text}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
const Home = () => {
  return (
    <>
      <Header />
      <main className="main-home">
        <section>
          <h1>Você viaja o mundo. <br />E o ViajouAnotou mantém suas aventuras anotadas.</h1>
          <h2>Um mapa mundial que rastreia por onde você passou. Nunca esqueça suas experiências e mostre aos seus amigos o quê você fez pelo mundo.</h2>
          <a className="cta" href="">Começar agora</a>
        </section>
      </main>
    </>
  )
}

const Sobre = () => {
  return (
    <>
      <Header />
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
    </>
  )
}

const Preco = () => {
  return (
    <>
      <Header />
      <main className="main-pricing">
        <section>
          <div>
            <h1>Preço simples.<br />Só R$ 47/mês.</h1>
            <p>Comece hoje mesmo a anotar suas aventuras e mostre aos seus amigos o quê você fez pelo mundo.</p>
          </div>
          <img src="preco-viajou-anotou.jpg" alt="Pessoas transitando em uma faixa de pedestre" />
        </section>
      </main>
    </>
  )
}

const NotFound = () => {
  return (
    <>
      <Header />
      <main className="main-notfound">
        <section>
          <h1>Página não encontrada</h1>
          <p>Volte para a <Link to="/">página inicial</Link></p>
        </section>
      </main>
    </>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Home />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/preco" element={<Preco />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)


const App = () => <RouterProvider router={router} />

export { App }
