import { RouterProvider, useParams, createBrowserRouter, createRoutesFromElements, Route, NavLink, Link, useLocation, Outlet, Navigate, Form, useNavigate, useLoaderData, useOutletContext, useSearchParams, redirect, useRouteError } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet'
import localforage from "localforage"

const HeaderLogo = ({ variant = 'dark' }) =>
  <header>
    <Link to="/">
      <img src={`/logo-viajou-anotou-${variant}.png`} alt="Logo Viajou Anotou" className="logo" />
    </Link>
  </header>

const Navigation = () => {
  const location = useLocation()

  const navigationLinks = [
    { path: '/', text: 'Início' },
    { path: '/sobre', text: 'Sobre' },
    { path: '/preco', text: 'Preço' },
    { path: '/login', text: 'Login' }
  ]
  const isNotMainPage = location.pathname !== '/'

  return (
    <nav className="nav">
      <HeaderLogo variant={isNotMainPage ? 'dark' : 'light'} />
      <ul>
        {navigationLinks.map(link => {
          const isLoginBtn = link.path === '/login'
          const shouldBeGray = isNotMainPage && location.pathname !== link.path && !isLoginBtn
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

const HomePage = () => {
  return (
    <>
      <Navigation />
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

const AboutPage = () => {
  return (
    <>
      <Navigation />
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

const PricePage = () => {
  return (
    <>
      <Navigation />
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

const fakeAuthProvider = {
  isAuthenticated: false,
  email: null,
  signIn: async function (email) {
    await new Promise(resolve => setTimeout(resolve, 500))
    this.isAuthenticated = true
    this.email = email
  },
  signOut: async function () {
    await new Promise(resolve => setTimeout(resolve, 500))
    this.isAuthenticated = false
    this.email = null
  }
}

const LoginPage = () => {
  return (
    <>
      <Navigation />
      <main className="main-login">
        <form className="form-login" onSubmit={(e) => e.preventDefault()}>
          <label>
            Email
            <input type="text" defaultValue="oi@joaquim.com" />
          </label>
          <button>Login</button>
        </form>
      </main>
    </>
  )
}

const NotFoundPage = () => {
  return (
    <>
      <Navigation />
      <main className="main-notfound">
        <section>
          <h1>Página não encontrada</h1>
          <p>Volte para a <Link to="/">página inicial</Link></p>
        </section>
      </main>
    </>
  )
}

const ChangeCenter = ({ position }) => {
  const map = useMap()
  map.setView(position)

  return null
}

const ClickToCity = () => {
  const navigate = useNavigate()
  useMapEvent({
    click: (e) => navigate(`/app/form/?latitude=${e.latlng.lat}&longitude=${e.latlng.lng}`)
  })
}

const curitibaCoordinates = { latitude: '-25.438611111089152', longitude: '-49.260972203972706' }

const loadDashboard = async () => {
  if (fakeAuthProvider.isAuthenticated) {
    const cities = await localforage.getItem('cities')
    return cities ?? []
  }

  return redirect('/login')
}

const DashboardLayout = () => {
  const trips = useLoaderData()
  const [searchParams] = useSearchParams()

  const latitude = searchParams.get('latitude')
  const longitude = searchParams.get('longitude')


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
        <MapContainer className="map-container" center={[curitibaCoordinates.latitude, curitibaCoordinates.longitude]} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {trips.map(citie => (
            <Marker key={citie.id} position={[citie.position.latitude, citie.position.longitude]}>
              <Popup>
                {citie.notes}
              </Popup>
            </Marker>
          ))}

          {latitude && longitude && <ChangeCenter position={[latitude, longitude]} />}
          <ClickToCity />

        </MapContainer>
      </div>
    </main>
  )
}

const CitiesList = () => {
  const trips = useOutletContext()

  return trips.length === 0
    ? <p className="initial-message ">Clique no mapa para adicionar uma cidade</p>
    : (
      <div className="cities">
        {trips.map((trip) =>
          <Link key={trip.id} to={`${trip.id}?latitude=${trip.position.latitude}&longitude=${trip.position.longitude}`}>
            <img
              src={`https://flagcdn.com/20x15/${trip.countryCode}.png`}
              srcSet={`https://flagcdn.com/40x30/${trip.countryCode}.png 2x, https://flagcdn.com/60x45/${trip.countryCode}.png 3x`}
              width="20"
              height="15"
              alt={trip.country} />
            <h3>{trip.name}</h3>
          </Link>
        )}
      </div>
    )
}

const removeTripAction = async ({ params }) => {
  const trips = await localforage.getItem('cities')

  if (window.confirm('Por favor, confirme que você quer deletar essa viagem.')) {
    await localforage.setItem('cities', trips.filter(trip => trip.id !== params.id))
    return redirect('/app/cidades')
  }
  return redirect(`/app/cidades/${params.id}`)
}

const updateTripAction = async ({ params, request }) => {
  const cities = await localforage.getItem('cities')
  const formResponse = await request.formData()
  const { name, notes, date } = Object.fromEntries(formResponse)
  await localforage.setItem('cities', cities.map(city => city.id === params.id ? { ...city, name, notes, date } : city))

  return redirect(`/app/cidades/${params.id}`)
}

const loadTripDetails = async ({ params }) => {
  const cities = await localforage.getItem('cities')

  return cities.find(city => city.id === params.id)
}

const CityDetails = () => {
  const trips = useOutletContext()
  const params = useParams()
  const navigate = useNavigate()
  const cityDetails = trips.find(city => String(city.id) === params.id)

  const handleBackBtn = () => navigate('/app/cidades')
  const handleEditBtn = () => navigate(`/app/cidades/${params.id}/edit`)

  return cityDetails && (
    <div className="city-details">
      <div className="row">
        <div>
          <h5>Nome da cidade</h5>
          <div className="flag-content">
            <img
              src={`https://flagcdn.com/20x15/${cityDetails.countryCode}.png`}
              srcSet={`https://flagcdn.com/40x30/${cityDetails.countryCode}.png 2x, https://flagcdn.com/60x45/${cityDetails.countryCode}.png 3x`}
              width="20"
              height="15"
              alt={cityDetails.country} />
            <h3>{cityDetails.name}</h3>
          </div>
        </div>
        <div>
          <h5>Quando você foi para {cityDetails.name}</h5>
          <p>{cityDetails.date}</p>
        </div>
        <div>
          <h5>Suas anotações</h5>
          <p>{cityDetails.notes}</p>
        </div>
        <div className="citydetails-btns">
          <button className="btn-back" onClick={handleBackBtn}>&larr; Voltar</button>

          <button className="btn-edit" onClick={handleEditBtn}>∴ Editar</button>

          <Form action="delete" method="post">
            <button className="btn-delete">× Deletar</button>
          </Form>
        </div>
      </div>
    </div>
  )

}

const submitTripFormAction = async ({ request }) => {
  const url = new URL(request.url)
  const latitude = url.searchParams.get('latitude')
  const longitude = url.searchParams.get('longitude')
  const geoResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client/?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt-BR`)
  const { countryName, countryCode } = await geoResponse.json()
  const formResponse = await request.formData()
  const { name, notes, date } = Object.fromEntries(formResponse)

  const city = { name, notes, date, id: crypto.randomUUID(), position: { latitude, longitude }, country: countryName, countryCode: countryCode.toLowerCase() }

  const prevCities = await localforage.getItem('cities')
  localforage.setItem('cities', prevCities ? [...prevCities, city] : [city])

  return redirect(`/app/cidades/${city.id}`)
}

const loadFormInitialData = async ({ request }) => {
  const url = new URL(request.url)
  const latitude = url.searchParams.get('latitude')
  const longitude = url.searchParams.get('longitude')
  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client/?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt-BR`)
  const data = await response.json()
  console.log(data)

  return { name: data.city, country: data.countryName, countryCode: data.countryCode.toLowerCase() }
}

const TripForm = () => {
  const navigate = useNavigate()
  const city = useLoaderData()
  const handleBackBtn = () => navigate('/app/cidades')
  return (
    <Form className="form-edit-city" method="post">
      <label >
        <span>Nome da cidade</span>
        <div className="city-content">
          <input key={city.name} type="text" defaultValue={city.name} name="name" required />
          <img
            className="country-flag"
            src={`https://flagcdn.com/20x15/${city.countryCode}.png`}
            srcSet={`https://flagcdn.com/40x30/${city.countryCode}.png 2x, https://flagcdn.com/60x45/${city.countryCode}.png 3x`}
            width="20"
            height="15"
            alt={city.country} />
        </div>
      </label>
      <label>
        <span>Quando você foi para {city.name}</span>
        <input type="date" name="date" defaultValue={city.date ?? ''} required />
      </label>
      <label>
        <span>Suas anotações sobre a cidade</span>
        <textarea name="notes" defaultValue={city.notes ?? ''} required />
      </label>
      <div className="form-buttons">
        <button className="btn-back" type="button" onClick={handleBackBtn}>&larr; Voltar</button>
        <button className="btn-save">Salvar</button>
      </div>
    </Form>
  )
}

const VisitedCountries = () => {
  const trips = useOutletContext()
  const uniqueVisitedCountries = trips.reduce((acc, item) => acc.includes(item.country) ? [...acc] : [...acc, {countryName: item.country, countryCode: item.countryCode}], [])

  return (
    <ul className="countries">
      {uniqueVisitedCountries.map(({ countryName, countryCode }) =>
        <li key={countryName}>
          <img
            src={`https://flagcdn.com/32x24/${countryCode}.png`}
            srcSet={`https://flagcdn.com/64x48/${countryCode}.png 2x, https://flagcdn.com/96x72/${countryCode}.png 3x`}
            width="28"
            height="21"
            alt={countryName} />
          {countryName}
        </li>
      )}
    </ul>
  )
}

const ErroPage = () => {
  const error = useRouteError()
  return (
    <>
      <Navigation />
      <main className="main-not-found">
        <section>
          <h1>Opa!</h1>
          <p>Desculpe, um erro inesperado aconteceu:</p>
          <p><i>{error.message}</i></p>
        </section>
      </main>
    </>
  )
}

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" errorElement={<ErroPage />}>
        <Route index element={<HomePage />} />
        <Route path="sobre" element={<AboutPage />} />
        <Route path="preco" element={<PricePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="app" element={<DashboardLayout />} loader={loadDashboard}>
          <Route index element={<Navigate to="cidades" replace />} />
          <Route path="cidades" element={<CitiesList />} />
          <Route path="cidades/:id" element={<CityDetails />} />
          <Route path="cidades/:id/delete" action={removeTripAction} />
          <Route path="cidades/:id/edit" element={<TripForm />} loader={loadTripDetails} action={updateTripAction} />
          <Route path="form" element={<TripForm />} loader={loadFormInitialData} action={submitTripFormAction} />
          <Route path="paises" element={<VisitedCountries />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

export { App }
