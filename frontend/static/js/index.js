window.onload = function() {
    set_auto_click()
}

function set_auto_click() {
    setInterval(function() {
        const coins_node = document.getElementById('counter')
        const auto_click_node = document.getElementById('auto_click_power')
        coins_node.innerText = parseInt(coins_node.innerText) + parseInt(auto_click_node.innerText) + " $"
        update_coins(parseInt(coins_node.innerText))
        
    }, 1000)
}

function update_coins(coins) {
    const csrftoken = getCookie('csrftoken')

    fetch('api/update_coins/', {
        method: 'POST',
        headers: {
            "X-CSRFToken": csrftoken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            coins: coins
        })
    }).then(response => {
        if (response.ok) return response.json()
        else return Promise.reject(response)
    }).then(data => {
        // console.log(data)
    }).catch(err => console.log(err))
}


function call_click() {
    const click_node = document.getElementById('click-image')
    click_animation(click_node, 50) 
    var audio = new Audio('/static/sounds/Untitled.mp3').play()
    fetch('api/call_click', {
        method: 'GET'
    }).then(response => {
        if (response.ok) return response.json()
        else return Promise.reject(response)
    }).then(data => {
        document.getElementById('counter').innerText = data.main_cycle.coins_count + " $"

        if (data.boost) {
            add_boost(data.boost)
        }
    }).catch(err => console.log(err))
}

function update_boost(boost_id) {
    const csrftoken = getCookie('csrftoken')  
    const button = document.getElementById(`boost_${boost_id}`)
    var oldLvl = button.querySelector('#boost_level').innerText

    fetch('api/update_boost/', {
        method: 'POST',
        headers: {
            "X-CSRFToken": csrftoken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            boost_id: boost_id
        })
    }).then(response => {
        if (response.ok) return response.json()
        else return Promise.reject(response)
    }).then(data => {
        document.getElementById('counter').innerText = data.main_cycle.coins_count + " $"
        document.getElementById('click_power').innerText ="Зарабатываю " + data.main_cycle.click_power + " $ за клик"
        document.getElementById('auto_click_power').innerText =data.main_cycle.auto_click_power 
        
        render_boost(data.boost)
        if (oldLvl != data.boost.level && data.boost.boost_type == 0) var audio = new Audio('/static/sounds/Dayabogatii.mp3').play()
        else if (oldLvl != data.boost.level && data.boost.boost_type == 1) var audio = new Audio('/static/sounds/denegmnoga.mp3').play()
        else  var audio = new Audio('/static/sounds/pososi.mp3').play()
    }).catch(err => console.log(err))
}

function render_boost(boost) {
    const button = document.getElementById(`boost_${boost.id}`)
    button.querySelector('#boost_level').innerText = boost.level
    button.querySelector('#boost_power').innerText = boost.power
    button.querySelector('#boost_price').innerText = boost.price
}

function add_boost(boost) {
    let boost_holder = document.getElementById('boost-holder')
    const button = document.createElement('button')
    var type = `<p>Нанять</p><p>школяра lvl: <span id="boost_level">${boost.level}</span></p><p>+<span id="boost_power">${boost.power}</span> за клик</p><p>Цена: <span id="boost_price">${boost.price}</span></p>`
    button.setAttribute('class', 'boost')
    if (boost.boost_type == 1) 
    {
        button.setAttribute('class', 'boost auto')
        type = `<p>Сняться в рекламе</p><p><span id="boost_level">${boost.level}</span></p><p>+<span id="boost_power">${boost.power}</span> $/sec</p><p>Цена: <span id="boost_price">${boost.price}</span></p>`
    }
    button.setAttribute('id', `boost_${boost.id}`)
    button.setAttribute('onclick', `update_boost(${boost.id})`)
    
    button.innerHTML = type
    
    boost_holder.appendChild(button)
}

function click_animation(node, time_ms) {
    const css_time = `.0${time_ms}s`
    node.style.cssText = `transition: all ${css_time} linear; transform: scale(0.95);`
    setTimeout(function() {
        node.style.cssText = `transition: all ${css_time} linear; transform: scale(1);`
    }, time_ms)
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}