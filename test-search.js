fetch('http://localhost:5000/api/smart-search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: '2 bachon ka bed' })
})
.then(res => res.json())
.then(data => console.log('Found:', data.products.length))
.catch(err => console.error(err));
