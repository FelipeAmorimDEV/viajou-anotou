import { useEffect, useState } from "react"
import { RouterProvider, useParams, createBrowserRouter, createRoutesFromElements, Route, NavLink, Link, useLocation, Outlet, Navigate, useNavigate, useLoaderData, useOutletContext } from "react-router-dom"


const Logo = ({ variant = 'dark' }) =>
  <header>
    <Link to="/">
      <img src={`/logo-viajou-anotou-${variant}.png`} alt="Logo Viajou Anotou" className="logo" />
    </Link>
  </header>

const Header = () => {
  const location = useLocation()

  const links = [
    { path: '/', text: 'Início' },
    { path: '/sobre', text: 'Sobre' },
    { path: '/preco', text: 'Preço' },
    { path: '/login', text: 'Login' }
  ]
  const isNotHomePage = location.pathname !== '/'

  return (
    <nav className="nav">
      <Logo variant={isNotHomePage ? 'dark' : 'light'} />
      <ul>
        {links.map(link => {
          const isLoginBtn = link.path === '/login'
          const shouldBeGray = isNotHomePage && location.pathname !== link.path && !isLoginBtn
          return (
            <li key={link.path}>
              <NavLink
                to={link.path}
                style={shouldBeGray ? { color: '#c2c2c2' } : isLoginBtn ? { color: '#fff' } : null}
                className={isLoginBtn ? 'cta' : ''}
              >
                {link.text}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
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
          <Link className="cta" to="app">Começar agora</Link>
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
          <img src="/sobre-viajou-anotou.jpg" alt="Quatro pessoas sentadas admirando uma paisagem" />
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
          <img src="/preco-viajou-anotou.jpg" alt="Pessoas transitando em uma faixa de pedestre" />
        </section>
      </main>
    </>
  )
}

const LogIn = () => {
  return (
    <>
      <Header />
      <main className="main-login">
        <form className="form-login" onSubmit={(e) => e.preventDefault()}>
          <label>
            Email
            <input type="text" defaultValue="oi@joaquim.com" />
          </label>
          <label>
            Senha
            <input type="password" defaultValue="mamao3214" />
          </label>
          <button>Login</button>
        </form>
      </main>
    </>
  )
}

const tripsLoader = async () => {
  const response = await fetch('https://raw.githubusercontent.com/FelipeAmorimDEV/fake-data/main/fake-cities.json')
  return response.json()
}

const AppLayout = () => {
const trips = useLoaderData()

  return (
    <main className="main-app-layout">
      <aside className="sidebar">
        <Link to="/"><img src={`/logo-viajou-anotou-dark.png`} alt="Logo Viajou Anotou" className="logo" /></Link>
        <nav className="nav-app-layout">
          <ul>
            <li><NavLink to="cidades">Cidades</NavLink></li>
            <li><NavLink to="paises">Paises</NavLink></li>
          </ul>
        </nav>
        <Outlet context={trips} />
      </aside>
      <div className="map">
        <h1>map</h1>
      </div>
    </main>
  )
}

const Cities = () => {
  const trips = useOutletContext()
  
  return (
    <div className="cities">
      {trips.map((trip) =>
        <Link key={trip.id} to={`${trip.id}`}>
          <h3>{trip.name}</h3>
          <button>x</button>
        </Link>
      )}
    </div>
  )
}

const CitiesDetails = ({ travels }) => {
  const trips = useOutletContext()
  const params = useParams()
  const navigate = useNavigate()
  const cityDetails = trips.find(city => String(city.id) === params.id)

  const handleBackBtn = () => navigate(-1)

  return cityDetails && (
    <div className="city-details">
      <div className="row">
        <h5>Nome da cidade</h5>
        <h3>{cityDetails.name}</h3>
        <h5>Suas anotações</h5>
        <p>{cityDetails.notes}</p>
        <button className="btn-back" onClick={handleBackBtn}>&larr; Voltar</button>
      </div>
    </div>
  )

}

const Countries = () => {
  const trips = useOutletContext()
  const uniqueVisitedCountries = trips.reduce((acc, item) => acc.includes(item.country) ? [...acc] : [...acc, item.country], [])

  return (
    <ul className="countries">
      {uniqueVisitedCountries.map((country) => <li key={country}>{country}</li>)}
    </ul>
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

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="sobre" element={<Sobre />} />
        <Route path="preco" element={<Preco />} />
        <Route path="login" element={<LogIn />} />
        <Route path="app" element={<AppLayout />} loader={tripsLoader}>
          <Route index element={<Navigate to="cidades" replace />} />
          <Route path="cidades" element={<Cities />} />
          <Route path="cidades/:id" element={<CitiesDetails />} />
          <Route path="paises" element={<Countries />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

export { App }
