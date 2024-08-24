import logo from './logo.svg';
import './App.css';
import FileForm from "./forms/FileForm";
import {useState} from "react";

function App() {
    const [predictions, setPredictions] = useState([]);

  return (
    <div className="App">
      <div className="container">
        <h2>Определение мошеннических транзакций</h2>
          <FileForm setData={setPredictions} />
          {predictions.length > 0 &&
              <div>
                  <h3>Результат</h3>
                  {predictions.map((prediction, index) => {
                      if (prediction === 1) {
                          return (
                              <div className='alert_transact'>
                                  Транзакция №{index + 1}: Подозрительная транзакция. Требуется дополнительная проверка
                              </div>
                          )
                      } else return
                  })}
              </div>
          }
      </div>
    </div>
  );
}

export default App;
