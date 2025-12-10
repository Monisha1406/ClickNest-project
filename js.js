
    /* ---------- Demo product data ---------- */
    const products = [
      {id:1,title:'Everyday Backpack',category:'bags',price:1299,desc:'Durable everyday backpack with padded laptop sleeve.',img:'https://images.unsplash.com/photo-1509762774605-f07235a08f1f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmFja3BhY2t8ZW58MHx8MHx8fDA%3D'},
      {id:2,title:'Classic Sunglasses',category:'accessories',price:499,desc:'UV-protective stylish sunglasses.',img:'https://images.unsplash.com/photo-1589642380614-4a8c2147b857?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3VuZ2xhc3N8ZW58MHx8MHx8fDA%3D'},
      {id:3,title:'Wireless Headphones',category:'electronics',price:3499,desc:'Noise-cancelling over-ear headphones.',img:'https://images.unsplash.com/photo-1619296794093-3df1ae6819a8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHdpcmVsZXNzJTIwaGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D'},
      {id:4,title:'Coffee Mug',category:'home',price:299,desc:'Ceramic mug with heat-resistant handle.',img:'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1234567890abcdef1234567890abcdef'},
      {id:5,title:'Running Shoes',category:'footwear',price:2599,desc:'Lightweight running shoes for everyday runs.',img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcdef1234567890abcdef1234567890'},
      {id:6,title:'Leather Wallet',category:'accessories',price:799,desc:'Slim leather wallet with RFID protection.',img:'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcdefabcdefabcdefabcdefabcdefab'},
      {id:7,title:'Desk Lamp',category:'home',price:1199,desc:'Adjustable LED desk lamp with dimmer.',img:'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=a1b2c3d4e5f60718293a4b5c6d7e8f90'},
      {id:8,title:'Bluetooth Speaker',category:'electronics',price:1599,desc:'Portable speaker with deep bass.',img:'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ymx1ZXRvb3RoJTIwc3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D'},
      {id:9,title:'Classic T-Shirt',category:'clothing',price:599,desc:'Soft cotton t-shirt with regular fit.',img:'https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=c0ffee1234567890c0ffee1234567890'}
    ];

    /* ---------- Utilities ---------- */
    const $ = (sel, ctx=document) => ctx.querySelector(sel);
    const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

    /* ---------- App State ---------- */
    let state = {
      products: products.slice(),
      cart: JSON.parse(localStorage.getItem('demo_cart')||'{}')
    };

    /* ---------- Init UI ---------- */
    function init(){
      populateCategories();
      renderProducts(state.products);
      updateCartUI();

      // events
      $('#searchInput').addEventListener('input', onSearch);
      $('#categoryFilter').addEventListener('change', applyFilters);
      $('#sortSelect').addEventListener('change', applyFilters);
      $('#shopNow').addEventListener('click', ()=>document.getElementById('products').scrollIntoView({behavior:'smooth'}));
      $('#clearCart').addEventListener('click', clearCart);
      $('#checkoutBtn').addEventListener('click', ()=>alert('This is a demo checkout flow.'));
      $('#openCart').addEventListener('click', ()=>{document.getElementById('cartSidebar').scrollIntoView({behavior:'smooth'});});

      // initial counts
      $('#visibleCount').textContent = state.products.length;
    }

    /* ---------- Category > options ---------- */
    function populateCategories(){
      const cats = [...new Set(state.products.map(p=>p.category))];
      const sel = $('#categoryFilter');
      cats.forEach(c=>{
        const opt = document.createElement('option');
        opt.value=c;opt.textContent=c[0].toUpperCase()+c.slice(1);
        sel.appendChild(opt);
      });
    }

    /* ---------- Filter / Search / Sort ---------- */
    function onSearch(e){
      applyFilters();
    }

    function applyFilters(){
      const q = $('#searchInput').value.trim().toLowerCase();
      const cat = $('#categoryFilter').value;
      const sort = $('#sortSelect').value;

      let list = products.filter(p=>{
        const matchQ = q==='' || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
        const matchCat = cat==='all' || p.category===cat;
        return matchQ && matchCat;
      });

      if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
      if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);
      if(sort==='name-asc') list.sort((a,b)=>a.title.localeCompare(b.title));

      renderProducts(list);
      $('#visibleCount').textContent = list.length;
    }

    /* ---------- Render Products ---------- */
    function renderProducts(list){
      const root = $('#products');
      root.innerHTML='';
      if(list.length===0){
        root.innerHTML='<div class="muted">No products found.</div>';
        return;
      }
      list.forEach(p=>{
        const el = document.createElement('article');
        el.className='product';
        el.innerHTML = `
          <img loading="lazy" src="${p.img}" alt="${p.title}">
          <h3>${p.title}</h3>
          <div class="muted text-sm">${p.category}</div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div class="price">₹${p.price.toFixed(2)}</div>
            <div class="muted">⭐ 4.6</div>
          </div>
          <p class="muted text-sm">${p.desc}</p>
          <div class="actions">
            <button class="outline" data-id="${p.id}" onclick="showDetails(${p.id})">Details</button>
            <button class="btn-primary" data-id="${p.id}" onclick="addToCart(${p.id})">Add to cart</button>
          </div>
        `;
        root.appendChild(el);
      });
    }

    /* ---------- Product details modal (simple) ---------- */
    function showDetails(id){
      const p = products.find(x=>x.id===id);
      if(!p) return;
      const html = `
        <div style="position:fixed;inset:0;background:rgba(2,6,23,0.45);display:flex;align-items:center;justify-content:center;z-index:9999">
          <div style="width:92%;max-width:760px;background:white;border-radius:12px;padding:18px;box-shadow:0 12px 40px rgba(2,6,23,0.4);">
            <div style="display:flex;gap:16px;align-items:flex-start">
              <img src="${p.img}" alt="" style="width:260px;height:180px;object-fit:cover;border-radius:10px">
              <div style="flex:1">
                <h2 style="margin:0">${p.title}</h2>
                <div class="muted text-sm">${p.category} • ₹${p.price.toFixed(2)}</div>
                <p class="muted text-sm" style="margin-top:8px">${p.desc}</p>
                <div style="margin-top:10px;display:flex;gap:8px">
                  <button class="btn-primary" onclick="addToCart(${p.id}); closeModal();">Add to cart</button>
                  <button class="outline" onclick="closeModal()">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);
      wrapper.addEventListener('click', (ev)=>{ if(ev.target===wrapper) closeModal(); });
    }
    function closeModal(){
      // remove topmost modal container
      const nodes = Array.from(document.body.children);
      for(let i=nodes.length-1;i>=0;i--){
        const n = nodes[i];
        if(n && n.innerHTML && n.innerHTML.includes('Add to cart') && n !== document.querySelector('.container')){ n.remove(); break; }
      }
    }

    /* ---------- Cart management ---------- */
    function saveCart(){ localStorage.setItem('demo_cart', JSON.stringify(state.cart)); }

    function addToCart(id, qty=1){
      const pid = String(id);
      if(state.cart[pid]) state.cart[pid].qty += qty;
      else{
        const p = products.find(x=>x.id===id);
        state.cart[pid] = {id:p.id,title:p.title,price:p.price,img:p.img,qty:qty};
      }
      saveCart();
      updateCartUI();
      flashBadge();
    }

    function updateCartUI(){
      const root = $('#cartItems');
      root.innerHTML='';
      const entries = Object.values(state.cart);
      if(entries.length===0){ root.innerHTML='<div class="muted">Cart is empty — add some products.</div>'; $('#cartCount').textContent = 0; $('#cartSubtotal').textContent = '₹0.00'; return; }

      let subtotal = 0;
      entries.forEach(item=>{
        subtotal += item.price * item.qty;
        const div = document.createElement('div');
        div.className='mini-item';
        div.innerHTML = `
          <img src="${item.img}" alt="${item.title}">
          <div style="flex:1">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div style="font-weight:700">${item.title}</div>
              <div>₹${(item.price * item.qty).toFixed(2)}</div>
            </div>
            <div class="muted text-sm">₹${item.price.toFixed(2)} each</div>
            <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center">
              <div class="qty-controls">
                <button class="outline" onclick="changeQty(${item.id}, -1)">-</button>
                <div style="padding:6px 10px;border-radius:8px;border:1px solid rgba(15,23,42,0.06)">${item.qty}</div>
                <button class="outline" onclick="changeQty(${item.id}, 1)">+</button>
              </div>
              <button class="outline" onclick="removeItem(${item.id})">Remove</button>
            </div>
          </div>
        `;
        root.appendChild(div);
      });

      $('#cartCount').textContent = entries.reduce((s,i)=>s+i.qty,0);
      $('#cartSubtotal').textContent = '₹' + subtotal.toFixed(2);
    }

    function changeQty(id, delta){
      const pid = String(id);
      if(!state.cart[pid]) return;
      state.cart[pid].qty += delta;
      if(state.cart[pid].qty <= 0) delete state.cart[pid];
      saveCart();
      updateCartUI();
    }

    function removeItem(id){ delete state.cart[String(id)]; saveCart(); updateCartUI(); }
    function clearCart(){ if(!confirm('Clear the cart?')) return; state.cart = {}; saveCart(); updateCartUI(); }

    function flashBadge(){
      const el = $('#cartCount');
      el.animate([{transform:'scale(1)'},{transform:'scale(1.25)'},{transform:'scale(1)'}],{duration:350});
    }

    /* ---------- bootstrap ---------- */
    init();

    // expose for demo/testing in console
    window.addToCart = addToCart;
    window.showDetails = showDetails;
    window.changeQty = changeQty;
    window.removeItem = removeItem;
    window.clearCart = clearCart;
  