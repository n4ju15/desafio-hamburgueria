const express = require('express') // Requer o Express para funcionar
const uuid = require('uuid') // Requer a biblioteca UUID para funcionar

const port = 3000 // Variável que guarda a porta onde estou rodando o projeto

const app = express() // Defino que Express() agora pode ser chamado usando apenas "app"

app.use(express.json()) // Avisa ao Express que será usado JSON como padrão

const orders = [] // Salva os pedidos em um array


// Middleware para verificar se o ID existe
const checkUserId = (request, response, next) => {
    const { id } = request.params // Pega o ID

    const index = orders.findIndex(newOrder => newOrder.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "Order not found" })
    }

    request.newOrderIndex = index
    request.newOrderId = id

    next()
}


// Middleware que exibe o método e a URL da requisição 
const details = (request, response, next) => {
    console.log(`Method: ${request.method}, URL: ${request.url}`)

    next()
}
app.use(details)

// Rota para receber pedidos
app.post('/orders', (request, response) => {
    const { order, clientName, price, status } = request.body

    const newOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

// Rota para listar todos os pedidos já feitos
app.get('/orders', (request, response) => {
    return response.json(orders)
})

// Rota para alterar um pedido já feito
app.put('/orders/:id', checkUserId, (request, response) => {
    const { order, clientName, price, status } = request.body

    const index = request.newOrderIndex
    const id = request.newOrderId

    const updatedOrder = { id, order, clientName, price, status: "Em preparação" }

    orders[index] = updatedOrder

    return response.json(updatedOrder)
})

// Rota para deletar um pedido
app.delete('/orders/:id', checkUserId, (request, response) => {
    const index = request.newOrderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

// Rota que recebe o ID nos parâmetros e retorna um pedido específico
app.get('/orders/:id', checkUserId, (request, response) => {
    const id = request.newOrderId
    const index = request.newOrderIndex

    const order = orders[index]

    return response.json(order)
})

// Rota que ao receber o ID nos parâmetros, coloca o status do pedido como "Pronto"
app.patch('/orders/:id', checkUserId, (request, response) => {
    const { status } = request.body; // Apenas atualiza o status

    const index = request.newOrderIndex;

    // Recupera os campos existentes
    const { id, order, clientName, price } = orders[index];

    // Atualiza o status
    orders[index] = { id, order, clientName, price, status: "Pronto" };

    return response.json(orders[index]); // Retorna o pedido completo
})


app.listen(port, () => console.log(`Server is running on port ${port}`)) // Mensagem que aparece quando rodo o projeto