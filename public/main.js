let button = document.querySelectorAll('.button');
let item = document.querySelectorAll('.item');
console.log(button);

for (let i = 0; i < button.length; i++) {
  button[i].addEventListener('click', () => {
      fetch('delete', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'item': item[i].value
        })
      })
      .then(res => {
        if (res.ok) return res.json()
      }).
      then(data => {
        console.log(data)
        window.location.reload()
      })
  })
}
