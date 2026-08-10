import fetch from 'node-fetch';
import FormData from 'form-data';

async function testPostProduct() {
  const submitData = new FormData();
  submitData.append('name', 'Test Product');
  submitData.append('slug', 'test-product-' + Date.now());
  submitData.append('category', 'Beds');
  submitData.append('description', 'Test description');
  submitData.append('price', 100);
  submitData.append('length', 94);
  submitData.append('width', 44);
  submitData.append('height', 78);
  submitData.append('material', 'Wood');
  submitData.append('finish', 'Paint');
  submitData.append('ageGroup', '4-12');

  try {
    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        // Need to simulate a logged in admin, but maybe protect middleware is failing?
        // Let's see if we get 401 Unauthorized first
      },
      body: submitData
    });

    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
  } catch (err) {
    console.error("Error:", err);
  }
}
testPostProduct();
