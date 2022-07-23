const ctx = document.getElementById('myChart').getContext('2d')
const apiURL = 'https://mindicador.cl/api/'
const container = document.querySelector('.container')
const coin = document.getElementById('coin')
const boton = document.getElementById('boton')
const quantity = document.getElementById('quantity')
let gradiant = ctx.createLinearGradient(0, 0, 0, 400)
gradiant.addColorStop(0, 'rgba(58, 123, 213, .4)')
gradiant.addColorStop(1, 'rgba(0, 210, 255, .3)')
const loadingCSS = document.querySelector('.loading')
const volver = document.querySelector('.volver')
const error = document.querySelector('.error')
const section = document.querySelector('.section')
const canvas = document.querySelector('.canvas')
const back = document.getElementById('back')


window.addEventListener('load', () => {
    quantity.value = ''
})

quantity.addEventListener('input', () => {
    if (isNaN(quantity.value) || quantity.value < 0) {
        quantity.value = ''
    }
    Math.ceil(quantity.value)
})

boton.addEventListener('click', () => {
    if (quantity.value !== '' && coin.value !== 'monedas') {
        currentPriceAndDays(coin.value)
        rendering()
    } 
    else if(isNaN(quantity.value)) quantity.value = ''
})


volver.addEventListener('click', () => {
    location.reload()
    quantity.value = ''
})

back.addEventListener('click', ()=> {
    location.reload()
    quantity.value = ''
    
})


const currentPriceAndDays = async (currentCoin) => {
    loadingCSS.style.display = 'flex'
    try {
        const res = await fetch(apiURL + currentCoin)
        const datas = await res.json()
        const tenDays = await datas.serie
        tenDays.splice(10, (tenDays.length - 10))
        return tenDays
    }
    catch {
        setTimeout(() => {
            loadingCSS.style.display = 'none'
        }, 2000)
        error.style.display = 'flex'
    }
}


const rendering = async () => {

    canvas.style.transform = 'rotateY(360deg)'
    canvas.style.animation = 'apearing 2s linear forwards'
    setTimeout(() => {
        container.style.background = '#F4354A'
        loadingCSS.style.display = 'none'
        section.style.transform = ' perspective(500px) rotateY(90deg)'
        canvas.style.display = 'flex'
        setTimeout(() => {
            section.style.display = 'none'
            back.style.display= 'block'
        }, 2000)
    }, 1000)
    const labels = []
    const valores = []
    let delayed = false
    const objToRender = await currentPriceAndDays(coin.value)
    objToRender.sort((a, b) => {
        if (a.fecha > b.fecha) return 1
        else if (a.fecha < b.fecha) return -1
        else if (a.fecha == b.fecha) return 0
    })
    const fechas = objToRender.map(element => element.fecha)

    for (fech of fechas) {
        const newFech = fech.substr(0, 10)
        labels.push(newFech)
    }

    const values = objToRender.map(valores => valores.valor)
    for (val of values) {
        valores.push(val)
    }
    
    let calcular 
     
    coin.value == 'bitcoin' ?  calcular = valores[valores.length -1] * 1000:
     calcular = valores[valores.length -1]
    const data = {
        labels: labels,
        datasets: [{
            label: `Valor ${coin.value} al día de hoy es de $${
               (quantity.value / calcular).toLocaleString('en-US')}`,
            backgroundColor: gradiant,
            borderColor: '#002',
            pointBackgroundColor: '#ccc',
            fill: true,
            data: valores,
            tension: .1

        }]
    }

    const config = {
        type: 'line',
        data: data,
        options: {
            color: '#FFF',
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 15
                        }
                    },
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                onComplete: () => {
                    delayed = true
                },
                delay: (context) => {
                    let delay = 0
                    if (context.type == 'data' && context.mode == 'default' && !delayed) {
                        delay = context.dataIndex * 300 + context.dataIndex * 100
                    }
                    return delay
                }
            },
            radius: 5,
            hitRadius: 30,
            hoverRadius: 12,
            scales: {
                y: {
                    ticks: {
                        callback: function (value) {
                            if (coin.value == 'bitcoin') return '$' + (value * 1000).toLocaleString('en-US')
                            return '$' + value.toLocaleString('en-US')
                        },
                        color: '#fff'
                    }
                },
                x: {
                    ticks: {
                        color: '#fff'
                    }
                }
            }
        }
    }
    if (window.ctx) {
        window.ctx.clear()
        window.ctx.destroy()

    }

    setTimeout(() => {
        window.ctx = new Chart(ctx, config)
    }, 2000)

}




