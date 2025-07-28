const apiKey = "ee3888d88d8e3b8b118943fecc323111";

function buscarCEP() {
  const cep = document.getElementById('cep').value.replace(/\D/g, '');

  if (cep.length !== 8) {
    alert('CEP inválido! Digite um CEP com 8 dígitos.');
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (data.erro) {
        alert('CEP não encontrado!');
        return;
      }

      document.getElementById('logradouro').value = data.logradouro;
      document.getElementById('bairro').value = data.bairro;
      document.getElementById('cidade').value = data.localidade;
      document.getElementById('uf').value = data.uf;
      document.getElementById('complemento').value = data.complemento;

      document.getElementById('info').style.display = 'block';

      buscarClima(data.localidade);
    })
    .catch(error => {
      console.error('Erro na busca do CEP:', error);
      alert('Erro ao buscar o CEP.');
    });
}

async function buscarClima(cidade) {
  const resultado = document.getElementById("resultado");

  if (!cidade) {
    alert("Cidade inválida.");
    return;
  }

  try {
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cidade}&limit=1&appid=${apiKey}&lang=pt`
    );
    const geoData = await geoResponse.json();

    if (geoData.length === 0) {
      alert("Cidade não encontrada!");
      return;
    }

    const { lat, lon, name } = geoData[0];

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt`
    );
    const weatherData = await weatherResponse.json();

    document.getElementById("nome-cidade").textContent = `Tempo em ${name}`;
    document.getElementById("temperatura").textContent = `${weatherData.main.temp.toFixed(1)} °C`;
    document.getElementById("descricao").textContent = weatherData.weather[0].description;
    document.getElementById("umidade").textContent = `Umidade: ${weatherData.main.humidity}%`;

    const iconCode = weatherData.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    document.getElementById("icone-clima").innerHTML = `<img src="${iconUrl}" alt="Ícone do tempo" />`;

    resultado.style.display = "block";
  } catch (error) {
    alert("Erro ao buscar clima.");
    console.error(error);
  }
}
