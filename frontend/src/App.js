import './App.css';
import FileForm from "./forms/FileForm";
import {useState} from "react";
import { saveAs } from 'file-saver';

const responseTypes = [
    {
        label: 'Список',
        value: 'list'
    },
    {
        label: 'Файл xlsx',
        value: 'file'
    }
]

function App() {
    const [predictions, setPredictions] = useState([]);
    const [responseType, setResponseType] = useState(responseTypes[0]);
    const [responseBlob, setResponseBlob] = useState(null);

    const handleSuccess = (response) => {
        if (responseType.value === 'list') {
            setPredictions(response.data.predictions);
            setResponseBlob(null)
        } else {
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            setPredictions([])
            setResponseBlob(blob)
        }
    }

    const downloadResult = () => {
        if (responseBlob) saveAs(responseBlob, 'predictions.xlsx');
    }

  return (
    <div className="App">
      <div className="container">
        <h2 style={{margin: 0, textAlign: 'center'}}>Определение мошеннических транзакций</h2>
          <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 10}}>
              <p style={{margin: 0}}>Формат ответа</p>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                  {
                      responseTypes.map((item, index) => (
                            <div key={index} onClick={() => setResponseType(item)} className={`type_btn ${item.value === responseType.value ? 'active' : ''}`}>{item.label}</div>
                      ))
                  }
              </div>
          </div>
          <FileForm onSuccess={handleSuccess} responseType={responseType} />
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
          {
              responseBlob && (
                  <div>
                      <h3>Результат</h3>
                      <button className='button' onClick={downloadResult}>Скачать файл</button>
                  </div>
              )
          }
      </div>
    </div>
  );
}

export default App;
