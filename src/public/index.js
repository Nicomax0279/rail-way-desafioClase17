const MenCon = document.getElementById("MensaggesContainer")
const campo = document.getElementById("menssageField");
if(campo){
    campo.focus()


function llenarChat(data){
let elementos = "";
//console.log(data)
data.forEach(i => {
    //console.log(i)
    elementos += `<p><strong>${i.username} [${i.date}]</strong>:${i.menssage}</p>`

    
});
MenCon.innerHTML = elementos
}
campo.addEventListener("keydown",(evt)=>{
    //console.log(evt.key)
    if(evt.key === "Enter"){
        console.log
    fetch("/chat",{method : "POST" , 
    headers: {
        'Content-Type': 'application/json',
      },
    body : JSON.stringify({menssage : campo.value})})
    .then(e=>{    campo.value = "" ; document.location.reload();})

     
}
})    
}else{
    let table = document.getElementById("tablebody");
    if(table){
    //fetch("/api/products").then(data=>JSON.parse(data)).then(data=>rellenarTabla(data))
    fetch("/api/products").then(response => response.json())
    .then(data => rellenarTabla(data));}
    
}









    function rellenarTabla(datos) {
        let table = document.getElementById("tablebody");
    let products;
    let html = "";
    html= '';
    products = datos;
    
    products.forEach((product)=>{
        html +=`
        <tr>
        <td scope="row">${product.id}</th>
        <td>${product.title}</td>
        <td>${product.price}</td>
        
        <td><img src=${product.thumbnail} alt="img" width="50"></td>
        </tr>`
    
    })
    
    table.innerHTML = html;
}

