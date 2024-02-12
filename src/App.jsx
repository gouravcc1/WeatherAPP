import './App.css';
import NavBar from './components/NavBar';
import WeatherBox from './components/WeatherBox';

function App() {
  return (
    <>
      <NavBar />
      <div className="App">
        <WeatherBox />
      </div>
    </>
  );
}

export default App;