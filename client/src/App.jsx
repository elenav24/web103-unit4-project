import { useRoutes } from 'react-router-dom'
import Navigation from './components/Navigation'
import ViewOutfits from './pages/ViewOutfits'
import EditOutfit from './pages/EditOutfit'
import CreateOutfit from './pages/CreateOutfit'
import OutfitDetails from './pages/OutfitDetails'
import './App.css'

const App = () => {
  let element = useRoutes([
    {
      path: '/',
      element: <CreateOutfit />
    },
    {
      path: '/outfits',
      element: <ViewOutfits />
    },
    {
      path: '/outfits/:id',
      element: <OutfitDetails />
    },
    {
      path: '/edit/:id',
      element: <EditOutfit />
    }
  ])

  return (
    <div className='app'>
      <Navigation />
      {element}
    </div>
  )
}

export default App
