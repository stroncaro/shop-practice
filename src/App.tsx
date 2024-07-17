import { PropsWithChildren } from "react";


interface IClickable {
  onClick?: () => void;
}

const IconButton: React.FC<PropsWithChildren<IClickable>> = ({ children, onClick }) => {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  )
}

const Sidebar: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      {/* TODO: Add close button */}
      {children}
    </div>
  )
}

const SidebarSelect: React.FC<PropsWithChildren> = ({ children }) => {
  // TODO: Option elements passed as children? Or pass it a list of options and render in element?
  // TODO: Set up functionality for user selecting a value
  // TODO: Set up state to be expanded if value is selected
  return (
    <select>
      {children}
    </select>
  )
}

const SearchBox: React.FC = () => {
  // TODO: set state for search query
  // TODO: validate input while user types
  // TODO: filter cards
  return (
    <input type="search" />
  )
}

const SortSelect: React.FC = () => {
  // TODO: Set state and default behaviour
  // TODO: Set options
  // TODO: Sort cards according to option selected
  return (
    <select></select>
  )
}

const CardGallery: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  )
}

const Card: React.FC = () => {
  return (
    // TODO: add props with img, title, description, price and fav
    <div>
      <p>I'm a product</p>
    </div>
  )
}

const TextButton: React.FC<PropsWithChildren<IClickable>> = ({ children, onClick }) => {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  )
}


function App() {
  return (
    <>
      <header>
        <IconButton>Togle Menu Visibility Button</IconButton>
        <h1>Find what you need</h1>
        <IconButton>Sort Options</IconButton>
        <SearchBox />
        {/* TODO: Desktop */}
        {/* <SortSelect /> */}
      </header>
      <Sidebar>
        {/* SidebarSelect elements with product category options go here */}
      </Sidebar>
      <main>
        <CardGallery>
          {/* Fill with cards */}
          <Card />
        </CardGallery>
        <TextButton>LoadMore</TextButton>
      </main>
    </>
  )
}

export default App
