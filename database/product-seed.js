import { faker } from '@faker-js/faker'
import prisma from '../app/prisma.js'

async function main() {
    await prisma.product.deleteMany()


    const categories = await prisma.category.findMany()
    for (let i = 0; i < 150; i++) {
        await prisma.product.create({
            data: {
                name: faker.commerce.product(),
                description: faker.commerce.productDescription(),
                price: parseFloat(faker.commerce.price()),
                in_stock: faker.datatype.boolean(),
                category_id: categories[Math.floor(Math.random() * categories.length)].id
            }
        })
    }
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })