let database = [
    {id: 0, date: '01.01.2019', tool: 'Газпром', price: '2000'},
    {id: 1, date: '01.01.2019', tool: 'Автоваз', price: '2500'},
    {id: 2, date: '05.01.2019', tool: 'Сбербанк', price: '10000'},
    {id: 4, date: '07.10.2019', tool: 'Автоваз', price: '2100'},
    {id: 5, date: '07.10.2020', tool: 'Автоваз', price: '5000'},
    {id: 6, date: '07.10.2019', tool: 'Сбербанк', price: '4000'},
    {id: 7, date: '07.10.2020', tool: 'Сбербанк', price: '10000'},
];

const table = document.querySelector('.table');
const tbody = table.querySelector('.table__tbody');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const modalOpen = document.querySelector('.table__button');
const addButton = document.querySelector('.form__button');

const inputTool = document.querySelector('.input__tool');
const inputPrice = document.querySelector('.input__price');
const inputDate = document.querySelector('.input__date');

// Fill a table with data from a database

function fillTable(database) {
    tbody.innerHTML = '';
    for (let item of database) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <tr>
            <td>${item.date}</td>
            <td>${item.tool}</td>
            <td>${item.price}</td>
        </tr>
        `;
        tr.dataset.id = item.id;
        tbody.append(tr);
    }    
}

fillTable(database);

// Modal

function createModal() {
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    modalOpen.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
}

createModal();

// Add in database

addButton.addEventListener('click', (e) => {
    e.preventDefault();
    let date = inputDate.value.split('-').reverse().join('.');
    let tool = inputTool.value;
    let price = inputPrice.value;

    if (date && tool && price) {
        database.push({
            id: database.length, 
            date, 
            tool, 
            price,
        });
        fillTable(database);
        createChart();
    }
    
    tableEdit();
});


// Table edit

function tableEdit() {
    const tds = document.querySelectorAll('td');

    for (let td of tds) {
        td.addEventListener('click', function func(event) {
            const input = document.createElement('input');
            inputValue = event.target.innerHTML;
            input.value = inputValue;

            event.target.innerHTML = '';
            event.target.append(input);
            input.focus();

            td.removeEventListener('click', func);

            input.addEventListener('keydown', function inputKeydown(e) {
                if(e.keyCode === 13) {
                    for (let i = 0; i <= database.length - 1; i++) {
                        flag = Object.values(database[i]).indexOf(inputValue);
                        if ((flag != -1) && database[i].id == td.parentNode.dataset.id) {
                            if (input.value) {
                                database[i][Object.keys(database[i])[flag]] = input.value;
                                event.target.innerHTML = input.value;
                            } else {
                                database[i][Object.keys(database[i])[flag]] = inputValue;
                                event.target.innerHTML = inputValue;
                            }
                        }
                    }
                    createChart();
                }
                td.addEventListener('click', func);
            });

            input.addEventListener('blur', () => {
                for (let i = 0; i <= database.length - 1; i++) {
                    flag = Object.values(database[i]).indexOf(inputValue);
                    if ((flag != -1) && database[i].id == td.parentNode.dataset.id) {
                        if (input.value) {
                            database[i][Object.keys(database[i])[flag]] = input.value;
                            event.target.innerHTML = input.value;
                        } else {
                            database[i][Object.keys(database[i])[flag]] = inputValue;
                            event.target.innerHTML = inputValue;
                        }
                    }
                }
                createChart();
                td.addEventListener('click', func);
            });
        });
    }
}

tableEdit();

// Graph

function parseDatabase(database) {
    let xlabels = [];
    let xdata = {};
    let newData = [];

    // fill labels
    for(let key of database) {
        xlabels.push(key.date.split('.').reverse().join('-'));
    }

    // fill data
    for(let key of database) {
        if (Object.keys(xdata).indexOf(key.tool) == -1) {
            xdata[key.tool] = [];
            xdata[key.tool].push({x: key.date.split('.').reverse().join('-'), y: key.price}); 
        } else {
            xdata[key.tool].push({x: key.date.split('.').reverse().join('-'), y: key.price}); 
        }
    }

    for(let key of database) {
        newData.push(getData(key.tool, xdata));
    }

    // Delete dublicate objects in array
    function getUnique(arr, comp) {

        const unique =  arr.map(e => e[comp])
        .map((e, i, final) => final.indexOf(e) === i && i)
        .filter((e) => arr[e]).map(e => arr[e]);

        return unique;
    }


    function getData(label, data, backgroundColor='rgb(235,21,21)', borderColor='rgb(235,21,21)', fill=false) {
        return {
            label,
            backgroundColor,
            borderColor,
            data: data[label],
            fill,
        };
    }

    
    return [getUnique(newData, 'label'), [...new Set(xlabels.sort())]];
}

// Create Line chart
let chart;

function createChart() {
    if (chart) {
        chart.destroy();
    }
    let [xdata, xlabels] = parseDatabase(database);
    console.log(xdata, xlabels);
    var ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xlabels,
            datasets: xdata,
        },
        options: {
            responsive: true,
            aspectRatio:4,
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                    }
                }]
            },
        }
    });
    console.log(chart.data);
    
}


createChart();
