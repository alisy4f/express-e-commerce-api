import { faker } from '@faker-js/faker'
import prisma from '../app/prisma.js'

async function main() {

    
    for (let i = 0; i < 7; i++) {
        await prisma.category.create({
            data: {
                name: faker.commerce.productAdjective(),
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