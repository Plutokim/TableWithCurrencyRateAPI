let todaysDate = new Date().toLocaleDateString().split('.');
let dateMax= [...todaysDate].reverse().join('-');
document.getElementById('exchangedate').max = dateMax;

let backupCurrencies = localStorage.getItem('Currencies');
if(backupCurrencies){
    backupCurrencies = JSON.parse(backupCurrencies);
    renderCurrencies(backupCurrencies);
}
else{
    todaysDate = todaysDate.reduceRight((acc,datenum)=>acc+datenum,'');
    getData(todaysDate);
}



function getData(date){
fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${date}&json`)
.then(data => data.json())
.then(data => {
    let currencies = prepareTable(data);
    renderCurrencies(currencies);
});};

function prepareTable(data){
    let preparedCurrencies = data.map(currency => ({
        'txt': currency.txt,
        'cc': currency.cc,
        'rate': currency.rate,
        exchangedate: currency.exchangedate
    }));
    localStorage.setItem('Currencies', JSON.stringify(preparedCurrencies));
    return preparedCurrencies;
}

function renderCurrencies(currencies) {
    let htmlTable = currencies.reduce((acc, currency, index) => acc + `<tr>
            <td>${index + 1}</td>
            <td>${currency.txt}</td>
            <td>${currency.cc}</td>
            <td>${currency.rate.toFixed(3)}</td>
            <td>${currency.exchangedate}</td>
        </tr>`, '');
    document.querySelector('.currencies-table tbody').innerHTML = htmlTable;
};



document.getElementById('exchangedate').onchange = e =>{
    let dateValue = document.getElementById('exchangedate').value;
    dateValue = dateValue.split('-').join('');
    getData(dateValue);
};
